function createFiubaMap(carrera, file, materiasFromLoad){
    $.ajax({
        url: file,
        dataType: 'text',
        success: function(data) {
            new FiubaMap(data, materiasFromLoad, carrera)
        }
    })
}

function FiubaMap(data, materiasFromLoad, carrera) {
    FIUBAMAP = this;
    this.carrera = carrera;
    let aristas;
    [this.MATERIAS, aristas, this.GRUPOS, this.MATERIAS_CRED] = csvANodosyAristas(data);
    this.NETWORK = crearNetwork(this.MATERIAS, aristas);

    this.resetBindings = function(){
        const self = this;
        $('.toggle').off('click').on('click',function(){
            let [, g] = $(self).attr('id').split('-');
            new Grupo(g).openOrClose();
            self.NETWORK.fit()
        });
        
        self.NETWORK.off('click').on("click", function(params) {
            if (!params.event.isFinal) return;
            let id = params.nodes[0];
            if (!id) return;
            let nodo = self.MATERIAS.get(id);
            let aprobada = nodo.aprobada;
            if (!aprobada) {
                if (PARTYMODE) partyMode(nodo);
                new Materia(id).aprobar()
            }
            else {
                new Materia(id).desaprobar()
            }
            self.chequearNodosCRED()
        });
    
        self.NETWORK.off('hold').on("hold", function (params) {
            let id = params.nodes[0];
            new Materia(id).mostrarOpciones()
        });

    };

    this.actualizarPromedio = function(nodo){
        if (nodo.nota === 0)
            delete this.aprobadasConNota[nodo.id];
        else
            this.aprobadasConNota[nodo.id] = parseInt(nodo.nota);
        let sumatoria = (Object.values(this.aprobadasConNota).reduce((a, b) => a + b, 0));
        let aprobadas = Object.values(this.aprobadasConNota).length;
        let promedio = (sumatoria / aprobadas).toFixed(2);
        if (!isNaN(promedio)) $('#promedio-var').text(promedio);
        else $('#promedio-var').text('-')
    };

    this.actualizarCreditos = function(n){
        this.creditos += n;
        $('#creditos-var').text(this.creditos)
    };

    this.chequearNodosCRED = function(){
        this.MATERIAS_CRED.forEach(nodo => {
            if (this.creditos < nodo.requiere) new Materia(nodo.id).deshabilitar();
            else if (this.creditos >= nodo.requiere) new Materia(nodo.id).habilitar();
        })
    };

    this.creditos = 0;
    this.aprobadasConNota = {};
    $('#creditos-var').text(0);
    $('#promedio-var').text('-');
    if (materiasFromLoad) aprobarMateriasFromLoad(materiasFromLoad);
    else { new Materia('CBC').aprobar() }

    this.GRUPOS.forEach(g => { crearGrupo(g) });
    this.resetBindings()

}

function csvANodosyAristas(data){
    let nodos = [];
    let aristas = [];
    let grupos = [];
    let materiasCred = [];
    let filas = data.split(/\r?\n|\r/);
    for (let fila = 1; fila < filas.length; fila++) {
        let rowCells = filas[fila].split(',');
        let materia = createMateria(rowCells);
        materia.correlativas.forEach(c => {
            if (c.includes('CRED')){
                // Una materia CRED requiere n creditos para aprobar (ej: legislatura necesita 140 creditos)
                let [, n] = c.split('CRED');
                materia.requiere = n;
                materiasCred.push(materia)
            }
            let arista = {from:c,to:materia.id};
            // Las aristas entre CBC y los nodos CRED sirven para que el layout quede bien
            // Pero no deben ser mostradas
            if (c == 'CBC' && materia.requiere) arista.hidden = true;
            aristas.push(arista)
        });
        nodos.push(materia);
        if (!grupos.includes(materia.categoria)) grupos.push(materia.categoria);
    }
    return [new vis.DataSet(nodos), new vis.DataSet(aristas), grupos, materiasCred]
}

function crearNetwork(nodes, edges){
    let data = { nodes: nodes, edges: edges };
    let options = {
        nodes:{ shape:'box' },
        layout: { hierarchical: { enabled: true, direction: 'LR', levelSeparation: 150 } },
        edges:{ arrows: { to: {enabled: true, scaleFactor:0.7, type:'arrow'} } },
        groups: {
            Aprobadas: { color: '#7BE141' },
            'En Final': { color: '#4ae9c1' },
            Habilitadas: { color: '#ffa500' },
            'Materias Electivas': { color: '#FA8072' },
            'Materias Obligatorias': { color: '#ADD8E6' },
            // Informática
            'Orientación: Gestión Industrial de Sistemas': { color: '#FFFF00' },
            'Orientación: Sistemas Distribuidos': { color: '#7FFFD4' },
            'Orientación: Sistemas de Producción': { color: '#6495ED' },
            // Mecánica
            'Orientación: Diseño Mecánico': { color: '#FFFF00' },
            'Orientación: Termomecánica': { color: '#7FFFD4' },
            'Orientación: Metalúrgica': { color: '#6495ED' },
            'Orientación: Computación Aplicada': { color: '#FFFFE0' },
            'Orientación: Industrias': { color: '#CCCCB3' },
            // Electrónica
            'Orientación: Multiples Orientaciones': { color: '#FFFF00' },
            'Orientación: Procesamiento de Señales': { color: '#7FFFD4' },
            'Orientación: Automatización y Control': { color: '#6495ED' },
            'Orientación: Física Electrónica': { color: '#FFFFE0' },
            'Orientación: Telecomunicaciones': { color: '#CCCCB3' },
            'Orientación: Sistemas Digitales y Computación': { color: '#FFE4E1' },
            'Orientación: Multimedia': { color: '#FFDAB9' },
            'Orientación: Instrumentación Biomédica': { color: '#66CDAA' },
        },
    };

    return new vis.Network($('#grafo')[0], data, options);
}
