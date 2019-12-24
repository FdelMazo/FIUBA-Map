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
        <div id="materia" class="info center">
            <p id="materia-close" class="close-button" onclick="defaultHeaderSnackbar(); setCuatri(FIUBAMAP.cuatri)"><i class="fas fa-fw fa-times"></i></p> 
            <p><strong>[`+self.id+`] </strong>`+self.label.split('(')[0]+`</p>
            <input type="number" min="4" max="10" placeholder="Nota" value="` + nota + `" />
            <button id='materia-aprobar' style="background-color: `+FIUBAMAP.network.groups.groups['Aprobadas'].color+`">Aprobar</button>
            <div><button id='materia-enfinal' style="background-color:`+FIUBAMAP.network.groups.groups['En Final'].color+`">Poner En Final</button></div>
        </div>
        `;
        $('#header-snackbar').html($(html));
    
        $('#materia-aprobar').on('click', function () {
            let nota = $('#materia input').val();
            if (nota < 4 || nota > 10) return;
            if (!nota) nota = 0;
            FIUBAMAP.aprobar(self.id, nota, FIUBAMAP.cuatri);
            $("#materia-close").click()
        });
    
        $('#materia-enfinal').on('click', function () {
            FIUBAMAP.aprobar(self.id, -1, FIUBAMAP.cuatri);
            $("#materia-close").click()
        });
    
        $('#materia').on("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                $("#materia-aprobar").click()
            }
        });
    }
}
