function main(file){
    $.ajax({
        url: file,
        dataType: 'text',
        success: function(data, jqXHR, textStatus) {graphFromCSV(data)}
    })
}

function graphFromCSV(data) {
    var container = document.getElementById('grafo');
    [NODES, EDGES, GRUPOS] = csvToNodesAndEdges(data)
    network = create_network(container, NODES, EDGES)

    // Crea un cluster para las materias electivas y uno por cada orientacion
    // El cluster no se muestra (hidden: true)
    // Al clickear en los botones del menu, se abre el cluster, mostrando los nodos
    GRUPOS.forEach(grupo => {
        if (grupo.includes('Electivas') || grupo.includes('Orientación')) {
            var cluster = createClusterFromGroup(grupo)
            network.cluster(cluster)
            if (grupo.includes('Electivas')) {
                $("#menu").append("<li class='right'><a class='toggle' id='toggle-"+grupo+"'>"+grupo+"</a></li>")
            }

            else if (grupo.includes('Orientación')) {
                $("#orientaciones").append("<a class='toggle' id='toggle-"+grupo+"'>"+grupo+"</a>")
            }
        
            $(document).on('click','.toggle',function(){
                network.openCluster('cluster-'+grupo);
            })
        
        }

    })

    bindings()

    aprobar('CBC')
        
}

function csvToNodesAndEdges(data){
    var nodes_ids = []
    var nodes = []
    var edges = []
    var grupos = []

    var allRows = data.split(/\r?\n|\r/);
    for (var singleRow = 1; singleRow < allRows.length-1; singleRow++) {
        var rowCells = allRows[singleRow].split(',');        
        if (!nodes_ids.includes(rowCells[0])) {
            nodes_ids.push(rowCells[0])
            nodes.push(parseNode(rowCells))
        }

        var correlativas = rowCells[3].split('-')
        correlativas.forEach(x => {
            edges.push({from:x,to:rowCells[0]})
        });

        if (!grupos.includes(rowCells[4])) {grupos.push(rowCells[4])}
    }
    return [new vis.DataSet(nodes), new vis.DataSet(edges), grupos]
}

function create_network(container, nodes, edges){
    var data = { nodes: nodes, edges: edges };
    var options = {
        nodes:{ shape:'box' },
        layout: { hierarchical: { enabled: true, direction: 'LR' } },
        edges:{ arrows: { to: {enabled: true, scaleFactor:0.7, type:'arrow'} } },
        groups: { Aprobadas: { color: '#7BE141' } }
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
        
        var aprobada = NODES.get(id).aprobada
        if (!aprobada) {
            aprobar(id)
            creditos += NODES.get(id).value
        }
        else {
            desaprobar(id)
            creditos -= NODES.get(id).value
        }
        network.creditos = creditos
        $('#creditos-var').text(creditos)
    })
}

// Funciones auxiliares

function aprobar(id){
    var nodo = NODES.get(id)
    nodo.aprobada = true
    nodo.group = 'Aprobadas'
    NODES.update(nodo);

    neighborsTo = network.getConnectedNodes(id, 'to')
    for (i = 0; i <neighborsTo.length; i++ ){
        var neighbor = NODES.get(neighborsTo[i])
        if (!neighbor) {continue}
        if (neighbor.aprobada) {continue}
        habilitar(neighborsTo[i])
    }

}

function habilitar(id){
    var nodo = NODES.get(id)
    nodo.habilitada = true
    nodo.group = 'Habilitadas'
    NODES.update(nodo);
}

function deshabilitar(id){
    var nodo = NODES.get(id)
    nodo.habilitada = false
    nodo.group = nodo.categoria
    NODES.update(nodo);
}


function desaprobar(id){
    var nodo = NODES.get(id)
    nodo.aprobada = false
    nodo.group = nodo.categoria
    if (nodo.habilitada) { nodo.group = 'Habilitadas'} 
    NODES.update(nodo);
    
    for (i = 0; i <neighborsTo.length; i++ ){
        var neighbor = NODES.get(neighborsTo[i])
        if (!neighbor) {continue}
        if (neighbor.aprobada) {continue}
        deshabilitar(neighborsTo[i])
    }

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
        if (element.length < 9) {broken+=' '+element}
        else {broken+='\n'+element}
    });
    return broken.trim();
}
