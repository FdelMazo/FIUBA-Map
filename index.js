var FUERON_SELECCIONADOS = []

function main(file){
    $.ajax({
        url: file,
        dataType: 'text',
        success: function(data, jqXHR, textStatus) {graphFromCSV(data)}
    })
}

function breakWords(string){
    broken = ''
    string.split(' ').forEach(element => {
        if (element.length < 9) {broken+=' '+element}
        else {broken+='\n'+element}
    });
    return broken.trim();
}

function getNode(rowCells){
    var codigo = rowCells[0]
    var label = breakWords(rowCells[1])
    var creditos = rowCells[2]
    var grupo = rowCells[4]
    var nivel = rowCells[5]
    var caveat = rowCells[6]

    return {id:codigo, title:caveat, label:label, group:grupo, value: parseInt(creditos), aprobada: false,level:nivel, cid: parseInt(nivel), categoria: grupo}
}

function createClusterPerGroup(group){
    var cluster = {
        joinCondition : function(nodeOptions) {
            return nodeOptions.group === group;
        },
        clusterNodeProperties : {id: group, label: group}   
    }
    return cluster
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
            nodes.push(getNode(rowCells))
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
    var data = {
        nodes: nodes,
        edges: edges
    };

    var options = {
        nodes:{
            shape:'box',
        },
        layout: {
            hierarchical: {
                enabled: true,
                direction: 'LR',
            }
        },
        edges:{
            arrows: {
                to: {enabled: true, scaleFactor:0.7, type:'arrow'}
            },
        },
        groups: {
            Aprobadas: {
                color: '#7BE141'
            },
            CBC: {
                color: '#7BE141'
            }
        }
    };

    var network = new vis.Network(container, data, options);          
    network['creditos'] = 0

    return network
}

function graphFromCSV(data) {
    var result = csvToNodesAndEdges(data)
    var nodes = result[0]
    var edges = result[1]
    var grupos = result[2]
    
    var container = document.getElementById('grafo');
    network = create_network(container, nodes, edges)

    for (i = 2; i < grupos.length; i++) {
        cluster = {
            joinCondition:function(nodeOptions) {
                return nodeOptions.group === grupos[i];
            },
            clusterNodeProperties: {id: 'cluster-'+grupos[i], hidden: true, label:grupos[i], level:0}
        };
        network.cluster(cluster)
        $("#menu").append("<li><a class='toggle' id='toggle-"+grupos[i]+"'>"+grupos[i]+"</a></li>")
        
        $(document).on('click','.toggle',function(){
            var [_, grupo] = $(this).attr('id').split('-')
            network.openCluster('cluster-'+grupo);
        })
    } 

    network.on("click", function(params) {
        var creditos = network.creditos

        var id = params['nodes']['0'];
        if (!id) {return}

        var clickedNode = nodes.get(id)
        
        var aprobada = clickedNode.aprobada
        if (!aprobada) {
            clickedNode.aprobada = true
            clickedNode.group = 'Aprobadas'
            creditos += clickedNode.value
        }
        else {
            clickedNode.aprobada = false
            clickedNode.group = clickedNode.categoria
            creditos -= clickedNode.value
        }
        nodes.update(clickedNode);
        network.creditos = creditos
        $('#creditos-var').text(creditos)
    })
}

