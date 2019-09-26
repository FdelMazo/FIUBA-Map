function Grupo(g) {
    this.id = g
    this.openOrClose = function() {
        if (FIUBAMAP.NETWORK.isCluster('cluster-'+id)) FIUBAMAP.NETWORK.openCluster('cluster-'+id);
        else FIUBAMAP.NETWORK.cluster(crearClusterDeCategoria(id));    
    }
}

function crearGrupo(g) {
    if (g.includes('Electivas') || g.includes('Orientación')) {
        let cluster = crearClusterDeCategoria(g);
        FIUBAMAP.NETWORK.cluster(cluster);
        if (g.includes('Orientación')) {
            let [_,orientacion] = g.split(':');
            $("#orientaciones").append("<a class='toggle' id='toggle-"+g+"'>"+orientacion+"</a>")
        }
    }
}

function crearClusterDeCategoria(g){
    return cluster = {
        joinCondition:function(nodeOptions) {
            return nodeOptions.categoria === g;
        },
        clusterNodeProperties: {id: 'cluster-'+g, hidden: true, level:20, allowSingleNodeCluster:true}
    };
}
