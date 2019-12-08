class Materia {
    constructor(codigo, titulo, creditos, categoria, nivel) {
        this.id = codigo;
        this.label = breakWords(titulo);
        this.creditos = parseInt(creditos);
        this.group = categoria;
        this.level = nivel;
        this.categoria = categoria;
        this.aprobada = false;
        this.nota = null;
        this.enfinal = false;
        this.habilitada = false;
    }

    aprobar(nota){
        if (nota) {
            this.nota = nota
            if (this.label.includes('[')) this.label = this.label.split('\n[')[0];
            this.label += '\n[' + this.nota + ']';
            FIUBAMAP.actualizarPromedio(this);
        } 
        if (this.aprobada) return;
        this.aprobada = true;
        this.actualizar();
        FIUBAMAP.actualizarCreditos(this.creditos);
        let materiasQueYoHabilito = FIUBAMAP.network.getConnectedNodes(this.id, 'to');
        materiasQueYoHabilito.forEach(m => {
            let x = FIUBAMAP.materias.get(m);
            if (x) x.habilitar()
        })
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

    ponerEnFinal() {
        this.desaprobar();
        this.enfinal = true;
        this.actualizar()
    }

    deshabilitar() {
        this.habilitada = false;
        this.actualizar()
    }


    desaprobar() {
        if (this.aprobada)
            FIUBAMAP.actualizarCreditos(-this.creditos);
        this.aprobada = false;
        this.nota = 0;
        if (this.label.includes('['))
            this.label = this.label.split('\n[')[0];
        FIUBAMAP.actualizarPromedio(this);
        this.enfinal = false;

        let materiasQueHabilita = FIUBAMAP.network.getConnectedNodes(this.id, 'to');
        materiasQueHabilita.forEach(m => {
            let x = FIUBAMAP.materias.get(m);
            if (x) x.deshabilitar()
        });
        this.actualizar()
    }

    actualizar() {
        let grupoDefault = this.categoria;
        if (this.aprobada) grupoDefault = 'Aprobadas';
        else if (this.enfinal) grupoDefault = 'En Final';
        else if (this.habilitada) grupoDefault = 'Habilitadas';
        this.group = grupoDefault;
        FIUBAMAP.actualizar(this)
    }

    mostrarOpciones() {
        const self = this;

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
            if (nota) self.aprobar(nota);
            else self.aprobar();
            $("#materiaclose-button").click()
        });

        $('#enfinal-button').on('click', function () {
            self.ponerEnFinal();
            $("#materiaclose-button").click()
        });

        $('#desaprobar-button').on('click', function () {
            self.desaprobar();
            $("#materiaclose-button").click()
        })
    }
}

function breakWords(string) {
    let broken = '';
    string.split(' ').forEach(element => {
        if (element.length < 5) broken += ' ' + element;
        else broken += '\n' + element;
    });
    return broken.trim();
}

