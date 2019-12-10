class Materia {
    constructor(codigo, titulo, creditos, categoria, nivel) {
        this.id = codigo;
        this.label = breakWords(titulo);
        this.creditos = parseInt(creditos);
        this.group = categoria;
        this.level = nivel;
        this.categoria = categoria;
        this.aprobada = false;
        this.nota = 0;
        this.habilitada = false;
    }

    aprobar(nota){
        this.aprobada = true;
        if (nota) {
            this.nota = parseInt(nota)
            if (this.label.includes('['))
                this.label = this.label.split('\n[')[0];
            if (nota == -1) {
                this.actualizar();
                return
            }
            this.label += '\n[' + this.nota + ']';
        } 
        let materiasQueYoHabilito = FIUBAMAP.network.getConnectedNodes(this.id, 'to');
        materiasQueYoHabilito.forEach(m => {
            let x = FIUBAMAP.materias.get(m);
            if (x) x.habilitar()
        })
        this.actualizar();
    }

    habilitar() {
        let materiasQueMeHabilitan = FIUBAMAP.network.getConnectedNodes(this.id, 'from');
        let todoAprobado = true;
        for (let i = 0; i < materiasQueMeHabilitan.length; i++) {
            let correlativa = FIUBAMAP.materias.get(materiasQueMeHabilitan[i]);
            if (!correlativa) continue;
            todoAprobado &= correlativa.aprobada
        }
        if (!todoAprobado || FIUBAMAP.creditos < this.requiere) return;
        this.habilitada = true;
        this.actualizar()
    }

    desaprobar() {
        this.aprobada = false;
        this.nota = 0;
        if (this.label.includes('['))
            this.label = this.label.split('\n[')[0];
        let materiasQueHabilita = FIUBAMAP.network.getConnectedNodes(this.id, 'to');
        materiasQueHabilita.forEach(m => {
            let x = FIUBAMAP.materias.get(m);
            if (x) x.deshabilitar()
        });
        this.actualizar()
    }

    deshabilitar() {
        this.habilitada = false;
        this.actualizar()
    }

    actualizar() {
        let grupoDefault = this.categoria;
        if (this.aprobada && this.nota >=0) grupoDefault = 'Aprobadas';
        else if (this.aprobada) grupoDefault = 'En Final';
        else if (this.habilitada) grupoDefault = 'Habilitadas';
        this.group = grupoDefault;
        FIUBAMAP.nodos.update(this)
        FIUBAMAP.actualizar()
    }

    mostrarOpciones() {
        const self = this;
        let nota = self.nota ? self.nota : '';
        let html = `
        <div class="modal" style='display:block'>
            <div id='materia-modal-content' class="modal-content">
                <span onclick='$(this.parentElement.parentElement.parentElement).empty()' id="materiaclose-button" class="close-button">&times;</span>
                <h3>[` + self.id + `] ` + self.label.split('\n[')[0] + ` (` + self.creditos + `créditos)</h3>
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
            if (!nota) nota = 0;
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
                $("#aprobar-button").click()
            }
        });
    }
}
