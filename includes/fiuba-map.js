function main(file){
    $.ajax({
        url: file,
        dataType: 'text',
        success: function(data, jqXHR, textStatus) {graphFromCSV(data)}
    })
}

function graphFromCSV(data) {
    var container = document.getElementById('grafo');
    [NODOS, ARISTAS, GRUPOS, NODOS_CRED] = csvToNodesAndEdges(data)
    network = createNetwork(container, NODOS, ARISTAS)

    // El cluster Final De Carrera contiene las opciones de tesis y demas
    // No se agrega de entrada al mapa porque no es tan relevante (si estas terminando la carrera ya sabes que materias cursar...)
    var clusterFinalDeCarrera = createClusterFromGroup('Final De Carrera Clustered')
    network.cluster(clusterFinalDeCarrera)
    
    // Crea un cluster para las materias electivas y uno por cada orientacion
    // El cluster no se muestra (hidden: true)
    // Al clickear en los botones del menu, se abre el cluster, mostrando los nodos
    GRUPOS.forEach(grupo => {
        if (grupo.includes('Electivas') || grupo.includes('Orientación')) {
            var cluster = createClusterFromGroup(grupo)
            network.cluster(cluster)
            if (grupo.includes('Orientación')) {
                var [_,orientacion] = grupo.split(':')
                $("#orientaciones").append("<a class='toggle' id='toggle-"+grupo+"'>"+orientacion+"</a>")
            }
        }

    })
    $(document).on('click','.toggle',function(){
        var [_, grupo] = $(this).attr('id').split('-')
        if (network.isCluster('cluster-'+grupo)) { network.openCluster('cluster-'+grupo) }
        if (network.isCluster('cluster-Final De Carrera Clustered')) { network.openCluster('cluster-Final De Carrera Clustered')}
    })

    bindings()
    aprobar('CBC')
        
}

function csvToNodesAndEdges(data){
    var nodes = []
    var edges = []
    var grupos = []
    var nodosCred = []

    var allRows = data.split(/\r?\n|\r/);
    for (var singleRow = 1; singleRow < allRows.length-1; singleRow++) {
        var rowCells = allRows[singleRow].split(',');        
        var node = parseNode(rowCells)
        var correlativas = rowCells[3].split('-')
        for(var i=0; i<correlativas.length; i++){
            if(correlativas[i].includes('CRED')){
                // Un nodo CRED es aquel que requiere n creditos para aprobar (ej: legislatura necesita 140 creditos)
                var [_, c] = correlativas[i].split('CRED')
                node.requiere = c
                nodosCred.push(node)
                continue
            }
            edges.push({from:correlativas[i],to:rowCells[0]})
        }

        nodes.push(node)

        if (!grupos.includes(rowCells[4])) {grupos.push(rowCells[4])}
    }
    return [new vis.DataSet(nodes), new vis.DataSet(edges), grupos, nodosCred]
}

function createNetwork(container, nodes, edges){
    var data = { nodes: nodes, edges: edges };
    var options = {
        nodes:{ shape:'box' },
        layout: { hierarchical: { enabled: true, direction: 'LR', levelSeparation: 150 } },
        edges:{ arrows: { to: {enabled: true, scaleFactor:0.7, type:'arrow'} } },
        groups: { 
            Aprobadas: { color: '#7BE141' },
            Habilitadas: { color: '#ffa500' },
            'Final De Carrera': { color: '#FF7F50' },
            'Final De Carrera Clustered': { color: '#FF7F50' },
            'Orientación: Gestión Industrial de Sistemas': { color: '#FFFF00' },
            'Orientación: Sistemas Distribuidos': { color: '#7FFFD4' },
            'Orientación: Sistemas de Producción': { color: '#6495ED' },
            'Materias Electivas': { color: '#FA8072' },
            'Materias Obligatorias': { color: '#ADD8E6' }
        }
    };

    network = new vis.Network(container, data, options);          
    network['creditos'] = 0
    return network
}

function createClusterFromGroup(grupo){
    var cluster = {
        joinCondition:function(nodeOptions) {
            return nodeOptions.group === grupo;
        },
        clusterNodeProperties: {id: 'cluster-'+grupo, hidden: true, level:-1}
    };
    return cluster
}

function bindings() {
    network.on("click", function(params) {
        var creditos = network.creditos

        var id = params.nodes[0];
        if (!id) {return}
        
        var aprobada = NODOS.get(id).aprobada
        if (!aprobada) {
            network.creditos += NODOS.get(id).value
            aprobar(id)
        }
        else {
            network.creditos -= NODOS.get(id).value
            desaprobar(id)
        }
        $('#creditos-var').text(network.creditos)
    })
}

function aprobar(id){
    var nodo = NODOS.get(id)
    nodo.aprobada = true
    nodo.group = 'Aprobadas'
    NODOS.update(nodo);

    var neighborsTo = network.getConnectedNodes(id, 'to')
    for (var i = 0; i < neighborsTo.length; i++ ){
        var neighbor = NODOS.get(neighborsTo[i])
        if (!neighbor) {continue}
        if (neighbor.aprobada) {continue}
        intentar_habilitar(neighborsTo[i])
    }
    chequearNodosCRED()
}

function intentar_habilitar(id){
    var nodo = NODOS.get(id)
    if (network.creditos < nodo.requiere) {return}

    var neighborsFrom = network.getConnectedNodes(id, 'from')
    var todoAprobado = true
    for (var i = 0; i < neighborsFrom.length; i++ ){
        var neighbor = NODOS.get(neighborsFrom[i])
        if (!neighbor) {continue}
        if (!neighbor.aprobada) {todoAprobado = false; break}
    }

    if (!todoAprobado) {return}

    nodo.habilitada = true
    nodo.group = 'Habilitadas'
    NODOS.update(nodo);
}

function chequearNodosCRED(id){
    for(var i = 0; i<NODOS_CRED.length;i++){
        var nodo = NODOS_CRED[i]
        if (network.creditos < nodo.requiere) {deshabilitar(nodo.id)}
        else if (network.creditos >= nodo.requiere) {intentar_habilitar(nodo.id)}
    }
}

function deshabilitar(id){
    var nodo = NODOS.get(id)
    nodo.habilitada = false
    nodo.group = nodo.categoria
    NODOS.update(nodo);
}


function desaprobar(id){
    var nodo = NODOS.get(id)
    nodo.aprobada = false
    nodo.group = nodo.categoria
    if (nodo.habilitada) { nodo.group = 'Habilitadas'} 
    NODOS.update(nodo);
    
    var neighborsTo = network.getConnectedNodes(id, 'to')
    for (var i = 0; i <neighborsTo.length; i++ ){
        var neighbor = NODOS.get(neighborsTo[i])
        if (!neighbor) {continue}
        if (neighbor.aprobada) {continue}
        deshabilitar(neighborsTo[i])
    }
    chequearNodosCRED()

}

function parseNode(rowCells){
    var codigo = rowCells[0]
    var label = breakWords(rowCells[1])
    var creditos = rowCells[2]
    var grupo = rowCells[4]
    var nivel = rowCells[5]
    var caveat = rowCells[6]

    var node = {id:codigo, label:label, group:grupo, value: parseInt(creditos), aprobada: false, level:nivel, habilitada: false, categoria: grupo}
    if (caveat){ node.title = caveat }
    return node
}

function breakWords(string){
    var broken = ''
    string.split(' ').forEach(element => {
        if (element.length < 5) {broken+=' '+element}
        else {broken+='\n'+element}
    });
    return broken.trim();
}
