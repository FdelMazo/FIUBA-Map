FIUBAMAP = null;

class FiubaMap {
    constructor(data, carrera) {
        FIUBAMAP = this
        this.init(data);
        this.carrera = carrera;
        this.creditos = 0;
        this.cuatri = cuatriActual()
        setCuatri(this.cuatri)
        this.aprobadas = new Map();
        resetBindings(this)
        this.actualizarCreditos();
        this.actualizarPromedio();
    }

    aprobar(id, nota, cuatri) {
        let mat = this.materias.get(id)
        mat.aprobar(nota)
        this.agregarMateria(mat, cuatri)
        this.actualizar()
    }

    desaprobar(id, cambioCuatri) {
        let mat = this.materias.get(id)
        if (!cambioCuatri)
            this.removerMateria(mat)
        mat.desaprobar()
        this.actualizar()
    }
    
    cambiarCuatri() {
        const self = this
        self.aprobadas.forEach((map,cuatri) => {
            cuatri = parseFloat(cuatri)
            if (cuatri > self.cuatri) {
                map.forEach((v,k) => {
                    if (self.materias.get(k).nota == -1 && v != -1) return
                    self.desaprobar(k, true)
                })
            }
            else {
                map.forEach((v,k) => {
                    self.aprobar(k, v, cuatri)
                })
            }
        })
        this.actualizar()
        this.chequearNodosCRED()
    }

    actualizar() {
        this.actualizarPromedio();
        this.actualizarCreditos();
    }
    
    actualizarPromedio() {
        const self = this
        let sumatoria = 0
        let cantidad = 0
        let materias = materiasAprobadasConNota(self.aprobadas, self.cuatri)
        materias.forEach((nota, materia) => {
            sumatoria += nota
            cantidad++
        })
        let promedio = (sumatoria / cantidad).toFixed(2);
        if (!isNaN(promedio))  {
            $('#promedio').text("Promedio: "+promedio);
            $("#promedio").show();
        }
        else $('#promedio').empty();
    }

    actualizarCreditos() {
        const self = this
        let cred = 0
        let materias = materiasAprobadas(self.aprobadas, self.cuatri)
        materias.forEach((id) => {
            let m = this.materias.get(id)
            cred+=m.creditos
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
    
    agregarMateria(mat, cuatri) {
        let aprobadasEnCuatri = this.aprobadas.get(cuatri)
        if (!aprobadasEnCuatri)
            aprobadasEnCuatri = new Map()
        aprobadasEnCuatri.set(mat.id, mat.nota)
        this.aprobadas.set(parseFloat(cuatri), aprobadasEnCuatri)
    }

    removerMateria(mat) {
        let aprobadasEnCuatri = this.aprobadas.get(this.cuatri)
        if (!aprobadasEnCuatri) return;
        aprobadasEnCuatri.delete(mat.id)
        if (!aprobadasEnCuatri.size)
            this.aprobadas.delete(this.cuatri)
        else
            this.aprobadas.set(this.cuatri, aprobadasEnCuatri)
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
            materia.setTitle();
            nodos.push(materia);
            materias.set(codigo, materia);
            if (!grupos.includes(materia.categoria)) grupos.push(materia.categoria);
        }
        this.materias = materias
        this.materias_cred = materiasCred
        this.nodos = new vis.DataSet(nodos)
        this.network = crearNetwork(this.nodos, new vis.DataSet(aristas));
        
        let electivas = {
            joinCondition: function (nodeOptions) {
                return nodeOptions.categoria === 'Materias Electivas';
            },
            clusterNodeProperties: {id: 'cluster-Materias Electivas', hidden: true, level: 20, allowSingleNodeCluster: true}
        }
        let htmlelectivas = `<a class='toggle' id='toggle-Materias Electivas'>Electivas</a>`
        this.network.cluster(electivas);

        grupos = grupos.filter(g => g.includes('Orientación'))
        if (grupos.length == 0) {
            $("#materias").append(htmlelectivas)
        }
        else {
            let html = `
            <a class="dropbtn">
                <span>Materias</span>
                <i class="fas fa-fw fa-caret-down"></i>
            </a>
            <div id='materias-dropdown' class="dropdown-content dropdown-content-right">`+htmlelectivas+`</div>`
            $("#materias").append(html)
            grupos.forEach(g => {
                let cluster = {
                    joinCondition: function (nodeOptions) {
                        return nodeOptions.categoria === g;
                    },
                    clusterNodeProperties: {id: 'cluster-' + g, hidden: true, level: 20, allowSingleNodeCluster: true}
                }
                this.network.cluster(cluster);
                let [, categoria] = g.split(':');
                $("#materias-dropdown").append("<a class='toggle' id='toggle-" + g + "'>" + categoria + "</a>");
            })
        }
    }
}
