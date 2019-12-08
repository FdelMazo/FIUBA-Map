FIUBAMAP = null;

class FiubaMap {
    constructor(data, materiasFromLoad, carrera) {
        FIUBAMAP = this
        this.init(data);
        this.carrera = carrera;
        this.creditos = 0;
        this.aprobadas = {};
        if (materiasFromLoad) this.aprobarMateriasFromLoad(materiasFromLoad);
        else this.materias.get("CBC").aprobar()

        this.resetBindings()
    }

    resetBindings() {
        const self = this;
        $('.toggle').off('click').on('click', function () {
            let [, id] = $(this).attr('id').split('-');
            if (self.network.isCluster('cluster-' + id)) self.network.openCluster('cluster-' + id);
            else self.network.cluster({
                joinCondition: function (nodeOptions) { return nodeOptions.categoria === id; },
                clusterNodeProperties: {id: 'cluster-' + id, hidden: true, level: 20, allowSingleNodeCluster: true}
            });
            self.network.fit()
        });

        self.network.off('click').on("click", function (params) {
            if (!params.event.isFinal) return;
            let id = params.nodes[0];
            if (!id) return;
            let m = self.materias.get(id);
            let aprobada = m.aprobada;
            if (!aprobada) {
                m.aprobar()
            } else {
                m.desaprobar()
            }
            self.chequearNodosCRED()
        });

        self.network.off('hold').on("hold", function (params) {
            let id = params.nodes[0];
            if (id) self.materias.get(id).mostrarOpciones()
        });

    };

    actualizar(m) {
        this.materias.set(m.id, m)
        this.nodos.update(m)
    }
    
    actualizarPromedio(m) {
        if (m.nota === 0)
            delete this.aprobadas[m.id];
        else
            this.aprobadas[m.id] = parseInt(m.nota);
        let sumatoria = (Object.values(this.aprobadas).reduce((a, b) => a + b, 0));
        let aprobadas = Object.values(this.aprobadas).length;
        let promedio = (sumatoria / aprobadas).toFixed(2);
        if (!isNaN(promedio)) $('#promedio-var').text(promedio);
        else $('#promedio-var').text('-')
    };

    actualizarCreditos(n) {
        this.creditos += n;
        $('#creditos-var').text(this.creditos)
    };

    chequearNodosCRED() {
        this.materias_cred.forEach(nodo => {
            if (this.creditos < nodo.requiere) this.materias.get(nodo.id).deshabilitar();
            else if (this.creditos >= nodo.requiere) this.materias.get(nodo.id).habilitar();
        })
    };

    aprobarMateriasFromLoad(materiasFromLoad) {
        materiasFromLoad.forEach(m => {
            if (m.includes('*')) {
                let [id, nota] = m.split('*');
                if (nota == 'F') this.materias.get(id).ponerEnFinal();
                else this.materias.get(id).aprobar(nota)
            } else this.materias.get(m).aprobar()
        })
    }
    
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
}

function crearNetwork(nodes, edges) {
    let data = {nodes: nodes, edges: edges};
    let options = {
        nodes: {shape: 'box'},
        layout: {hierarchical: {enabled: true, direction: 'LR', levelSeparation: 150}},
        edges: {arrows: {to: {enabled: true, scaleFactor: 0.7, type: 'arrow'}}},
        groups: {
            Aprobadas: {color: '#7BE141'},
            'En Final': {color: '#4ae9c1'},
            Habilitadas: {color: '#ffa500'},
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
