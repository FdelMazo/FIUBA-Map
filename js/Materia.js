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
        this.nota = parseInt(nota)
        if (this.label.includes('['))
            this.label = this.label.split('\n[')[0];
        if (nota == -1) {
            this.actualizar();
            return
        }
        if (nota > 0) this.label += '\n[' + this.nota + ']';
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
        <div class="snackbar">
            <span class="close-button" onclick="$(this.parentElement.parentElement).empty();">&times;</span> 
            <p><strong>[`+self.id+`] `+self.label.split('\n[')[0]+`</strong></p>    
            <div><input id='nota' class='materia-input' type="number" min="4" max="10" placeholder="Nota" value="` + nota + `" />
            <button id='aprobar-button'>Aprobar</button>
            <button id='enfinal-button'>En Final</button>
        </div>
        `;
        $('#materia-snackbar').append($(html));
    
        $('#aprobar-button').on('click', function () {
            let nota = $('#nota').val();
            if (!nota || nota < 4 || nota >10) nota = 0;
            FIUBAMAP.aprobar(self.id, nota, FIUBAMAP.cuatri);
            $("#materiaclose-button").click()
        });
    
        $('#enfinal-button').on('click', function () {
            FIUBAMAP.aprobar(self.id, -1, FIUBAMAP.cuatri);
            $("#materiaclose-button").click()
        });
    
        $('#materia-snackbar').on("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                $("#aprobar-button").click()
            }
        });
    }
}
