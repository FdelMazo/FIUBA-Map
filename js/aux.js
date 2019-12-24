function resetBindings(FMap) {
    const self = FMap;
    $("#cuatri-next i").on("click", function (event) {
        setCuatri(getNext(getCuatri()))
        self.cambiarCuatri()
    })
    $("#cuatri-prev").on("click", function (event) {
        setCuatri(getPrev(getCuatri()))
        FIUBAMAP.cambiarCuatri()
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
        if (!id) {
            $(".close-button").click();
            return;
        }
        if (!self.materias.get(id).aprobada || self.materias.get(id).nota == -1) {
            self.aprobar(id, 0, self.cuatri)
            $(".close-button").click();
            self.materias.get(id).mostrarOpciones()
        } else {
            self.desaprobar(id)
            $(".close-button").click();
        }
        self.chequearNodosCRED()
    });
}

function breakWords(string) {
    let broken = '';
    string.split(' ').forEach(element => {
        if (element.length < 5) broken += ' ' + element;
        else broken += '\n' + element;
    });
    return broken.trim();
}

function materiasAprobadasConNota(aprobadasTotal, cuatriActual) {
    let aprobadas = new Map()
    let maxCuatri = -1
    aprobadasTotal.forEach((map, cuatri) => {
        if (cuatri > cuatriActual) return
        map.forEach((nota, materia) => {
            if (nota <= 0) return;
            if (aprobadas.has(materia)) {
                if (cuatri > maxCuatri) {
                    aprobadas.set(materia, nota)
                    maxCuatri = cuatri
                }
            }
            else
                aprobadas.set(materia, nota)
        })
    })
    return aprobadas
}

function materiasAprobadas(aprobadasTotal, cuatriActual) {
    let aprobadas = []
    aprobadasTotal.forEach((map, cuatri) => {
        if (cuatri > cuatriActual) return
        map.forEach((nota, materia) => {
            if (nota == -1) return;
            if (aprobadas.includes(materia)) return;
            aprobadas.push(materia)
        })
    })
    return aprobadas
}

function crearNetwork(nodes, edges) {
    let data = {nodes: nodes, edges: edges};
    let options = {
        nodes: {shape: 'box'},
        layout: {hierarchical: {enabled: true, direction: 'LR', levelSeparation: 150}},
        edges: {arrows: {to: {enabled: true, scaleFactor: 0.7, type: 'arrow'}}},
        groups: {
            'CBC': {color: '#FDA7DF'},
            'Aprobadas': {color: '#55efc4'},
            'Habilitadas': {color: '#FDA7DF'},
            'En Final': {color: '#fdcb6e'},
            'Materias Obligatorias': {color: '#ff7675'},
            'Materias Electivas': {color: '#a29bfe'},
            // Informática
            'Orientación: Gestión Industrial de Sistemas': {color: '#fab1a0'},
            'Orientación: Sistemas Distribuidos': {color: '#C4E538'},
            'Orientación: Sistemas de Producción': {color: '#fd79a8'},
            // Mecánica
            'Orientación: Diseño Mecánico': {color: '#fab1a0'},
            'Orientación: Termomecánica': {color: '#C4E538'},
            'Orientación: Metalúrgica': {color: '#fd79a8'},
            'Orientación: Computación Aplicada': {color: '#BDC581'},
            'Orientación: Industrias': {color: '#EE5A24'},
            // Electrónica
            'Orientación: Multiples Orientaciones': {color: '#fab1a0'},
            'Orientación: Procesamiento de Señales': {color: '#C4E538'},
            'Orientación: Automatización y Control': {color: '#fd79a8'},
            'Orientación: Física Electrónica': {color: '#BDC581'},
            'Orientación: Telecomunicaciones': {color: '#EE5A24'},
            'Orientación: Sistemas Digitales y Computación': {color: '#FFE4E1'},
            'Orientación: Multimedia': {color: '#FFDAB9'},
            'Orientación: Instrumentación Biomédica': {color: '#66CDAA'},
        },
    };

    return new vis.Network($('#grafo')[0], data, options);
}

function warningSnackbar(clave){
    $('#header-snackbar').removeClass();
    let html = `
        <div class="alert">
            <p class="close-button" onclick="defaultHeaderSnackbar(); setCuatri(FIUBAMAP.cuatri);"><i class="fas fa-fw fa-times"></i></p> 
            <p><strong>Padrón no registrado!</strong> Seleccioná tu carrera, marca las materias que aprobaste y toca el boton de guardar.
            <br>
            Una vez guardado, podés entrar a <a href=https://fdelmazo.github.io/FIUBA-Map/?clave=` + clave + `>https://fdelmazo.github.io/FIUBA-Map/?clave=` + clave + `</a> y ver tu progreso.</p>
        </div>
    `;
    $('#header-snackbar').html($(html));
    $('#header-snackbar').addClass('snackbar');
}

function defaultHeaderSnackbar() {
    $('#header-snackbar').removeClass();
    let html = `
    <div id="cuatri" class="center">
        <a id="cuatri-prev"><i class="fas fa-fw fa-arrow-left"></i></a> 
        <input readonly id="cuatri input" size="7" type="text">
        <a id="cuatri-next"><i class="fas fa-fw fa-arrow-right"></i></a> 
    </div>
    `;
    $('#header-snackbar').html($(html));
    $('#header-snackbar').addClass('snackbar');
    $('#header-snackbar').addClass('center-snackbar');
}


function defaultFooterSnackbar() {
    let html = `
    <div>
        <a target="_blank" href="https://github.com/fdelmazo/FIUBA-Map"><i class="fab fa-fw fa-github"></i></a> 
        <a><i onclick="$('#mail-content').toggle()" class="fas fa-fw fa-envelope"></i><span id="mail-content"> fdelmazo at fi.uba.ar</span></a> 
    </div>
    `;
    $('#footer-snackbar').html($(html));
}