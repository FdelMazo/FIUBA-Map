function main(file){
    $.ajax({
        url: file,
        dataType: 'text',
        success: function(data, jqXHR, textStatus) {graphFromCSV(data)}
    })
}

function graphFromCSV(data) {
    container = document.getElementById('grafo');
    [nodes, edges, grupos] = csvToNodesAndEdges(data)
    network = create_network(container, nodes, edges)

    // Crea un cluster para las materias electivas y uno por cada orientacion
    // El cluster no se muestra (hidden: true)
    // Al clickear en los botones del menu, se abre el cluster, mostrando los nodos
    grupos.forEach(grupo => {
        if (grupo.includes('Electivas') || grupo.includes('Orientación')) {
            cluster = createClusterFromGroup(grupo)
            network.cluster(cluster)
            if (grupo.includes('Electivas')) {
                $("#menu").append("<li class='right'><a class='toggle' id='toggle-"+grupo+"'>"+grupo+"</a></li>")
            }

            else if (grupo.includes('Orientación')) {
                $("#orientaciones").append("<a class='toggle' id='toggle-"+grupo+"'>"+grupo+"</a>")
            }
        
            $(document).on('click','.toggle',function(){
                var [_, grupo] = $(this).attr('id').split('-')
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
    cluster = {
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
        
        var aprobada = nodes.get(id).aprobada
        if (!aprobada) {
            aprobar(id)
            creditos += nodes.get(id).value
        }
        else {
            desaprobar(id)
            creditos -= nodes.get(id).value
        }
        network.creditos = creditos
        $('#creditos-var').text(creditos)
    })
}

// Funciones auxiliares

function aprobar(id){
    nodo = nodes.get(id)
    nodo.aprobada = true
    nodo.group = 'Aprobadas'

    neighborsTo = network.getConnectedNodes(id,'to')
    neighborsTo.forEach(x => {
        neighbor = nodes.get(x)
        if (!neighbor) {return}
        neighbor.group = 'Habilitada'
        nodes.update(neighbor);
    })

    nodes.update(nodo);
}

function desaprobar(id){
    nodes.get(id)
    nodo.aprobada = false
    nodo.group = nodo.categoria
    
    neighborsTo = network.getConnectedNodes(id,'to')
    neighborsTo.forEach(x => {
        neighbor = nodes.get(x)
        if (!neighbor) {return}
        neighbor.group = neighbor.categoria
        nodes.update(neighbor);
    })

    nodes.update(nodo);
}

function parseNode(rowCells){
    codigo = rowCells[0]
    label = breakWords(rowCells[1])
    creditos = rowCells[2]
    grupo = rowCells[4]
    nivel = rowCells[5]
    caveat = rowCells[6]

    node = {id:codigo, label:label, group:grupo, value: parseInt(creditos), aprobada: false,level:nivel, cid: parseInt(nivel), categoria: grupo}
    if (caveat){ node.title = caveat }
    return node
}

function breakWords(string){
    broken = ''
    string.split(' ').forEach(element => {
        if (element.length < 9) {broken+=' '+element}
        else {broken+='\n'+element}
    });
    return broken.trim();
}
