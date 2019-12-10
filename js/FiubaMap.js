FIUBAMAP = null;

class FiubaMap {
    constructor(data, carrera) {
        FIUBAMAP = this
        this.init(data);
        this.carrera = carrera;
        this.creditos = 0;
        this.cuatri = cuatriActual()
        $("#cuatri").val(this.cuatri)
        this.aprobadas = new Map();
        this.aprobar("CBC", 0, this.cuatri)
        this.resetBindings()
    }

    aprobar(m, nota, cuatri) {
        let mat = this.materias.get(m)
        mat.aprobar(nota)
        if (this.aprobadas.has(cuatri)) {
            let v = this.aprobadas.get(cuatri)
            v.set(mat.id, mat.nota)
            this.aprobadas.set(cuatri, v)
        }
        else {
            let mx = new Map()
            mx.set(mat.id, mat.nota)
            this.aprobadas.set(cuatri, mx)
        }
        this.actualizar()
    }

    desaprobar(m, nocuatri) {
        let mat = this.materias.get(m)
        if (!nocuatri && this.aprobadas.has(this.cuatri)) {
            this.aprobadas.get(this.cuatri).delete(mat.id)
            if (!this.aprobadas.get(this.cuatri)) {
                this.aprobadas.delete(this.cuatri)
            }
        }
        mat.desaprobar()
        this.actualizar()
    }
    
    cambiarCuatri() {
        const self = this
        self.aprobadas.forEach((map,cuatri) => {
            if (cuatri > this.cuatri)
                map.forEach((v,k) => {self.desaprobar(k, true)})
            else
                map.forEach((v,k) => {self.aprobar(k,v, cuatri)})
        })
        this.actualizar()
    }

    actualizar(m) {
        if (m) this.nodos.update(m)
        this.actualizarPromedio();
        this.actualizarCreditos();
    }
    
    actualizarPromedio() {
        const self = this
        let sumatoria = 0
        let cantidad = 0
        this.aprobadas.forEach((map,cuatri) => {
            if (cuatri > self.cuatri) return
            map.forEach((v,k) => {
                if (v <= 0) return;
                sumatoria += v;
                cantidad++;
            })
        })
        let promedio = (sumatoria / cantidad).toFixed(2);
        if (!isNaN(promedio)) $('#promedio-var').text(promedio);
        else $('#promedio-var').text('-');
    }

    actualizarCreditos() {
        const self = this
        let cred = 0
        this.aprobadas.forEach((map,cuatri) => {
            if (cuatri > self.cuatri) return
            map.forEach((v,k) => {
                if (v == -1) return;
                cred += self.materias.get(k).creditos;
            })
        })

        $('#creditos-var').text(cred)
        self.creditos = cred
    }


    chequearNodosCRED() {
        this.materias_cred.forEach(nodo => {
            if (this.creditos < nodo.requiere) nodo.deshabilitar();
            else if (this.creditos >= nodo.requiere) nodo.habilitar();
        })
    };
    
    init(data) {
        let nodos = [];
        let materias = new Map();
        let aristas = [];
        let grupos = [];
        let materiasCred = [];
        let filas = data.split(/\r?\n|\r/);
        for (let fila = 1; fila < filas.length; fila++) {
            let [codigo, titulo, creditos, correlativas, categoria, nivel] = filas[fila].split(',');;
            let materia = new Materia(codigo, titulo, creditos, categoria, nivel);
            correlativas.split('-').forEach(c => {
                if (c.includes('CRED')) {
                    // Una materia CRED requiere n creditos para aprobar (ej: legislatura necesita 140 creditos)
                    let [, n] = c.split('CRED');
                    materia.requiere = n;
                    materiasCred.push(materia)
                }
                let arista = {from: c, to: materia.id};
                // Las aristas entre CBC y los nodos CRED sirven para que el layout quede bien
                // Pero no deben ser mostradas
                if (c == 'CBC' && materia.requiere) arista.hidden = true;
                aristas.push(arista)
            });
            nodos.push(materia);
            materias.set(codigo, materia);
            if (!grupos.includes(materia.categoria)) grupos.push(materia.categoria);
        }
        this.materias = materias
        this.materias_cred = materiasCred
        this.nodos = new vis.DataSet(nodos)
        this.network = crearNetwork(this.nodos, new vis.DataSet(aristas));
        
        grupos.forEach(g => {
            if (g.includes('Electivas') || g.includes('Orientación')) {
                let cluster = {
                    joinCondition: function (nodeOptions) {
                        return nodeOptions.categoria === g;
                    },
                    clusterNodeProperties: {id: 'cluster-' + g, hidden: true, level: 20, allowSingleNodeCluster: true}
                }
                this.network.cluster(cluster);
                if (g.includes('Orientación')) {
                    let [, orientacion] = g.split(':');
                    $("#orientaciones").append("<a class='toggle' id='toggle-" + g + "'>" + orientacion + "</a>");
                }
            }
        })
    }

    resetBindings() {
        const self = this;
        $('#cuatri').off('change').on('change', function () {
            let cuatri = $("#cuatri").val()
            if (cuatri <= self.cuatri) {
                cuatri = getPrev(self.cuatri)                
            }
            else  {
                cuatri = getNext(self.cuatri) 
            }
            $("#cuatri").val(cuatri)                
            self.cuatri = cuatri
            self.cambiarCuatri()
        })

        $('.toggle').off('click').on('click', function () {
            let [, id] = $(this).attr('id').split('-');
            if (self.network.isCluster('cluster-' + id)) {
                self.network.openCluster('cluster-' + id);
                let color = self.network.groups.groups[id].color
                $(this).css("background-color", color);
            }
            else {
                self.network.cluster({
                    joinCondition: function (nodeOptions) { return nodeOptions.categoria === id; },
                    clusterNodeProperties: {id: 'cluster-' + id, hidden: true, level: 20, allowSingleNodeCluster: true}
                })
                $(this).css("background-color", "");
            }
            self.network.fit()
        });

        self.network.off('click').on("click", function (params) {
            if (!params.event.isFinal) return;
            let id = params.nodes[0];
            if (!id) return;
            let m = self.materias.get(id);
            let aprobada = m.aprobada;
            if (!aprobada) {
                self.aprobar(id, 0, self.cuatri)
            } else {
                self.desaprobar(id)
            }
            self.chequearNodosCRED()
        });

        self.network.off('hold').on("hold", function (params) {
            let id = params.nodes[0];
            if (id) self.materias.get(id).mostrarOpciones()
        });
    };
}

function crearNetwork(nodes, edges) {
    let data = {nodes: nodes, edges: edges};
    let options = {
        nodes: {shape: 'box'},
        layout: {hierarchical: {enabled: true, direction: 'LR', levelSeparation: 150}},
        edges: {arrows: {to: {enabled: true, scaleFactor: 0.7, type: 'arrow'}}},
        groups: {
            'Aprobadas': {color: '#7BE141'},
            'En Final': {color: '#4ae9c1'},
            'Habilitadas': {color: '#ffa500'},
            'Materias Electivas': {color: '#FA8072'},
            'Materias Obligatorias': {color: '#ADD8E6'},
            // Informática
            'Orientación: Gestión Industrial de Sistemas': {color: '#FFFF00'},
            'Orientación: Sistemas Distribuidos': {color: '#7FFFD4'},
            'Orientación: Sistemas de Producción': {color: '#6495ED'},
            // Mecánica
            'Orientación: Diseño Mecánico': {color: '#FFFF00'},
            'Orientación: Termomecánica': {color: '#7FFFD4'},
            'Orientación: Metalúrgica': {color: '#6495ED'},
            'Orientación: Computación Aplicada': {color: '#FFFFE0'},
            'Orientación: Industrias': {color: '#CCCCB3'},
            // Electrónica
            'Orientación: Multiples Orientaciones': {color: '#FFFF00'},
            'Orientación: Procesamiento de Señales': {color: '#7FFFD4'},
            'Orientación: Automatización y Control': {color: '#6495ED'},
            'Orientación: Física Electrónica': {color: '#FFFFE0'},
            'Orientación: Telecomunicaciones': {color: '#CCCCB3'},
            'Orientación: Sistemas Digitales y Computación': {color: '#FFE4E1'},
            'Orientación: Multimedia': {color: '#FFDAB9'},
            'Orientación: Instrumentación Biomédica': {color: '#66CDAA'},
        },
    };

    return new vis.Network($('#grafo')[0], data, options);
}

function cuatriActual() {
    date = new Date()
    anio = date.getYear() + 1900
    mes = date.getMonth()
    if (mes <= 6) cuatri = 1
    else cuatri = 2
    return parseFloat(anio+'.'+cuatri)
}

function getPrev(cuatri) {
    let dec = (cuatri - Math.floor(cuatri)).toFixed(1)*10
    if (dec == 1)
        return parseFloat((cuatri - 0.9).toFixed(1))
    else
        return parseFloat((cuatri - 0.1).toFixed(1))
}

function getNext(cuatri) {
    let dec = (cuatri - Math.floor(cuatri)).toFixed(1)*10
    if (dec == 1) {
        return parseFloat((cuatri + 0.1).toFixed(1))
    }
    else
        return parseFloat((cuatri + 0.9).toFixed(1))
}
