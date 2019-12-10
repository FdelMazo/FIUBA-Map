function cuatriActual() {
    date = new Date()
    anio = date.getYear() + 1900
    mes = date.getMonth()
    if (mes <= 6) cuatri = 1
    else cuatri = 2
    return parseFloat(anio+'.'+cuatri)
}

function getPrev(cuatri) {
    cuatri = parseFloat(cuatri)
    let dec = (cuatri - Math.floor(cuatri)).toFixed(1)*10
    if (dec == 1)
        return parseFloat((cuatri - 0.9).toFixed(1))
    else
        return parseFloat((cuatri - 0.1).toFixed(1))
}

function getNext(cuatri) {
    cuatri = parseFloat(cuatri)
    let dec = (cuatri - Math.floor(cuatri)).toFixed(1)*10
    if (dec == 1) {
        return parseFloat((cuatri + 0.1).toFixed(1))
    }
    else
        return parseFloat((cuatri + 0.9).toFixed(1))
}

function resetBindings(FMap) {
    const self = FMap;
    $(document).on("keyup", function (event) {
        if (event.keyCode === 33) {
            $("#cuatri").val(function (i, oldval) {
                return getPrev(oldval)
            })
            self.cambiarCuatri()
        }
        if (event.keyCode ==34) {
            $("#cuatri").val(function (i, oldval) {
                return getNext(oldval)
            })
            self.cambiarCuatri()
        }
    })
    
    $('#cuatri').off('change').on('change', function () {
        $("#cuatri").val(function(i, oldval) {
            if (oldval <= self.cuatri)
                return getPrev(self.cuatri)                
            else 
                return getNext(self.cuatri)
        })
        self.cambiarCuatri()
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
        if (!id) return;
        if (!self.materias.get(id).aprobada) {
            self.aprobar(id, 0, self.cuatri)
        } else {
            self.desaprobar(id)
        }
        self.chequearNodosCRED()
    });

    self.network.off('hold').on("hold", function (params) {
        let id = params.nodes[0];
        if (id) mostrarOpciones(self.materias.get(id))
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

function mostrarOpciones(materia) {
    const self = materia;
    let nota = self.nota ? self.nota : '';
    let html = `
    <div class="modal" style='display:block'>
        <div id='materia-modal-content' class="modal-content">
            <span onclick='$(this.parentElement.parentElement.parentElement).empty()' id="materiaclose-button" class="close-button">&times;</span>
            <h3>[` + self.id + `] ` + self.label + `</h3>
            <p>
                Nota:
                <input id='nota' class='materia-input' type="number" min="4" max="10" value="` + nota + `" />
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

    $('#aprobar-button').on('click', function () {
        let nota = $('#nota').val();
        FIUBAMAP.aprobar(self.id, nota, FIUBAMAP.cuatri);
        $("#materiaclose-button").click()
    });

    $('#enfinal-button').on('click', function () {
        FIUBAMAP.aprobar(self.id, -1, FIUBAMAP.cuatri);
        $("#materiaclose-button").click()
    });

    $('#desaprobar-button').on('click', function () {
        FIUBAMAP.desaprobar(self.id);
        $("#materiaclose-button").click()
    })

    $('#materia-modal').on("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            let nota = $('#nota').val();
            FIUBAMAP.aprobar(self.id, nota, FIUBAMAP.cuatri);
            $("#materiaclose-button").click()
        }
    });
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
            'Aprobadas': {color: '#7BE141'},
            'En Final': {color: '#4ae9c1'},
            'Habilitadas': {color: '#ffa500'},
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