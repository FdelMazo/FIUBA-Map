function fiubamap(file, materiasFromLoad){
    $.ajax({
        url: file,
        dataType: 'text',
        success: function(data) {csvAGrafo(data, materiasFromLoad)}
    })
}

function csvAGrafo(data, materiasFromLoad) {
    [NODOS, ARISTAS, GRUPOS, NODOS_CRED] = csvANodosyAristas(data);
    NETWORK = crearNetwork(NODOS, ARISTAS);

    if (materiasFromLoad) {
        materiasFromLoad.forEach(m => {
            if (m.includes('*')){
                let [materia, nota] = m.split('*');
                if (nota == 'F') ponerEnFinal(materia)
                else aprobarConNota(materia, nota)
            }
            else aprobar(m)
        })
    }
    else {
        aprobar('CBC')
    }

    // Crea un cluster para las materias electivas y uno por cada orientacion
    // El cluster no se muestra (hidden: true)
    // Al clickear en los botones del menu, se abre el cluster, mostrando los nodos
    GRUPOS.forEach(g => {
        if (g.includes('Electivas') || g.includes('Orientación')) {
            let cluster = crearClusterDeCategoria(g);
            NETWORK.cluster(cluster);
            if (g.includes('Orientación')) {
                let [_,orientacion] = g.split(':');
                $("#orientaciones").append("<a class='toggle' id='toggle-"+g+"'>"+orientacion+"</a>")
            }
        }
    });
    bindings()
}

function csvANodosyAristas(data){
    let nodos = [];
    let aristas = [];
    let grupos = [];
    let nodosCred = [];

    let filas = data.split(/\r?\n|\r/);
    for (let fila = 1; fila < filas.length; fila++) {
        let rowCells = filas[fila].split(',');
        let [materia, correlativas] = nodoAMateria(rowCells);
        correlativas.forEach(c => {
            if (c.includes('CRED')){
                // Un nodo CRED es aquel que requiere n creditos para aprobar (ej: legislatura necesita 140 creditos)
                let [_, n] = c.split('CRED');
                materia.requiere = n;
                nodosCred.push(materia)
            }
            let edge = {from:c,to:materia.id};
            // Las aristas entre CBC y los nodos CRED sirven para que el layout quede bien
            // Pero no deben ser mostradas
            if (c == 'CBC' && materia.requiere) edge.hidden = true;
            aristas.push(edge)
        });
        nodos.push(materia);

        if (!grupos.includes(rowCells[4])) grupos.push(rowCells[4]);
    }
    return [new vis.DataSet(nodos), new vis.DataSet(aristas), grupos, nodosCred]
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

    let network = new vis.Network($('#grafo')[0], data, options);
    network.creditos = 0;
    $('#creditos-var').text(0);
    $('#promedio-var').text('-');
    network.aprobadasConNota = {};
    return network
}

function actualizarPromedio(nodo){
    if (nodo.nota == 0)
        delete NETWORK.aprobadasConNota[nodo.id];
    else
        NETWORK.aprobadasConNota[nodo.id] = parseInt(nodo.nota);
    let sumatoria = (Object.values(NETWORK.aprobadasConNota).reduce((a, b) => a + b, 0));
    let aprobadas = Object.values(NETWORK.aprobadasConNota).length;
    let promedio = (sumatoria / aprobadas).toFixed(2);
    if (!isNaN(promedio)) $('#promedio-var').text(promedio)
    else $('#promedio-var').text('-')
}

function actualizarCreditos(numero){
    NETWORK.creditos += numero;
    $('#creditos-var').text(NETWORK.creditos)
}

function crearClusterDeCategoria(grupo){
    return cluster = {
        joinCondition:function(nodeOptions) {
            return nodeOptions.categoria === grupo;
        },
        clusterNodeProperties: {id: 'cluster-'+grupo, hidden: true, level:20, allowSingleNodeCluster:true}
    };
}

function actualizarGrupo(nodo){
    let grupo = nodo.categoria;
    if (nodo.aprobada) grupo = 'Aprobadas';
    else if (nodo.enfinal) grupo = 'En Final';
    else if (nodo.habilitada) grupo = 'Habilitadas';
    nodo.group = grupo;
    NODOS.update(nodo)
}

function ponerEnFinal(id){
    desaprobar(id);
    let nodo = NODOS.get(id);
    nodo.enfinal = true;
    actualizarGrupo(nodo)
}

function aprobarConNota(id, nota){
    let nodo = NODOS.get(id);
    if (nota) {
        nodo.nota = nota;
        if (nodo.label.includes('[')) 
            nodo.label = nodo.label.split('\n[')[0]
        nodo.label += '\n[' + nodo.nota + ']'
        actualizarPromedio(nodo);
        NODOS.update(nodo);
    }
    if (!nodo.aprobada) aprobar(id);
}

function aprobar(id){
    let nodo = NODOS.get(id);
    nodo.aprobada = true;
    actualizarCreditos(nodo.creditos);
    actualizarGrupo(nodo);

    let materiasQueHabilita = NETWORK.getConnectedNodes(id, 'to');
    materiasQueHabilita.forEach(m => {
        let materia = NODOS.get(m);
        if (!materia) return;
        habilitar(m)
    })
}

function habilitar(id){
    let nodo = NODOS.get(id);
    let neighborsFrom = NETWORK.getConnectedNodes(id, 'from');
    let todoAprobado = true;
    for (let i = 0; i < neighborsFrom.length; i++ ){
        let correlativa = NODOS.get(neighborsFrom[i]);
        if (!correlativa) continue;
        todoAprobado &= correlativa.aprobada
    }
    if (!todoAprobado || NETWORK.creditos < nodo.requiere) return;
    nodo.habilitada = true;
    actualizarGrupo(nodo)

}

function chequearNodosCRED(){
    NODOS_CRED.forEach(nodo => {
        if (NETWORK.creditos < nodo.requiere) deshabilitar(nodo.id);
        else if (NETWORK.creditos >= nodo.requiere) habilitar(nodo.id);
    })
}

function deshabilitar(id){
    let nodo = NODOS.get(id);
    nodo.habilitada = false;
    actualizarGrupo(nodo)
}


function desaprobar(id){
    let nodo = NODOS.get(id);
    if (nodo.aprobada) 
        actualizarCreditos(-nodo.creditos);
    nodo.aprobada = false;
    nodo.nota = 0;
    if (nodo.label.includes('[')) 
        nodo.label = nodo.label.split('\n[')[0]
    actualizarPromedio(nodo)
    nodo.enfinal = false;

    let materiasQueHabilita = NETWORK.getConnectedNodes(id, 'to');
    materiasQueHabilita.forEach(m => {
        let materia = NODOS.get(m);
        if (!materia) return;
        deshabilitar(m)
    });

    actualizarGrupo(nodo)
}

function nodoAMateria(rowCells){
    let [codigo, materia, creditos, correlativas, categoria, nivel] = rowCells;
    materia = breakWords(materia);
    creditos = parseInt(creditos);
    correlativas = correlativas.split('-');
    let node = {id:codigo, label:materia, group: categoria, level:nivel,
        categoria: categoria, aprobada: false, nota: null, enfinal: false, creditos: creditos, habilitada: false};
    return [node, correlativas]
}

function breakWords(string){
    let broken = '';
    string.split(' ').forEach(element => {
        if (element.length < 5) broken+=' '+element;
        else broken+='\n'+element;
    });
    return broken.trim();
}

function mostrarOpciones(id){
    let nodo = NODOS.get(id);
    let nodonota = nodo.nota ? nodo.nota : '';
    let html = `
    <div class="modal" style='display:block'>
        <div id='materia-modal-content' class="modal-content">
            <span onclick='$(this.parentElement.parentElement.parentElement).empty()' id="materiaclose-button" class="close-button">&times;</span>
            <h3>[`+nodo.id+`] `+nodo.label+`</h3>
            <p>
                Nota:
                <input id='nota' class='materia-input' type="number" min="4" max="10" value="`+nodonota+`" />
            </p>
            <div id='materia-botones'>
                <button id='enfinal-button'>En Final</button>
                <button id='desaprobar-button'>Desaprobar</button>
                <button id='aprobar-button'>Aprobar</button>
            </div>
        </div>
    </div>
    `;
    $('#materia-modal').append($(html));

    $('#aprobar-button').on('click', function() {
        let nota = $('#nota').val();
        aprobarConNota(id, nota);
        $("#materiaclose-button").click()
    });

    $('#enfinal-button').on('click', function() {
        ponerEnFinal(id);
        $("#materiaclose-button").click()
    });

    $('#desaprobar-button').on('click', function() {
        desaprobar(id)
        $("#materiaclose-button").click()
    })
}

function bindings() {
    $('.toggle').off('click').on('click',function(){
        let [_, grupo] = $(this).attr('id').split('-');
        if (NETWORK.isCluster('cluster-'+grupo)) NETWORK.openCluster('cluster-'+grupo);
        else NETWORK.cluster(crearClusterDeCategoria(grupo));
        NETWORK.fit()
    });
    
    NETWORK.off('click').on("click", function(params) {
        if (!params.event.isFinal) return;
        let id = params.nodes[0];
        if (!id) return;
        let nodo = NODOS.get(id);
        let aprobada = nodo.aprobada;
        if (!aprobada) {
            if (PARTYMODE) partyMode(nodo);
            aprobar(id)
        }
        else {
            desaprobar(id)
        }
        chequearNodosCRED()
    });

    NETWORK.off('hold').on("hold", function (params) {
        let id = params.nodes[0];
        if (!id) return;
        mostrarOpciones(id)
    });
}

$(document).keydown(function(event) {
    if (event.keyCode == 27)
      $('.close-button').click();
});