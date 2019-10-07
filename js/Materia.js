function Materia(codigo, titulo, creditos, correlativas, categoria, nivel){
    this.id = codigo;
    this.label = breakWords(titulo);
    this.creditos = parseInt(creditos);
    this.correlativas = correlativas.split('-');
    this.group = categoria;
    this.level = nivel;
    this.categoria = categoria;
    this.aprobada = false;
    this.nota = null;
    this.enfinal = false;
    this.habilitada = false;
    this.nodo = this

    this.aprobar = function(){
        if (!this.nodo) return;
        this.nodo.aprobada = true;
        this.actualizar();
        FIUBAMAP.actualizarCreditos(this.nodo.creditos);
        let materiasQueYoHabilito = FIUBAMAP.NETWORK.getConnectedNodes(this.id, 'to');
        materiasQueYoHabilito.forEach(m => {
            let x = FIUBAMAP.MATERIAS.get(m)
            if (x) x.habilitar()
        })
    };

    this.habilitar = function(){
        if (!this.nodo) return;
        let materiasQueMeHabilitan = FIUBAMAP.NETWORK.getConnectedNodes(this.id, 'from');
        let todoAprobado = true;
        for (let i = 0; i < materiasQueMeHabilitan.length; i++ ){
            let correlativa = FIUBAMAP.MATERIAS.get(materiasQueMeHabilitan[i]);
            if (!correlativa) continue;
            todoAprobado &= correlativa.aprobada
        }
        if (!todoAprobado || FIUBAMAP.creditos < this.nodo.requiere) return;
        this.nodo.habilitada = true;
        this.actualizar()
    };

    this.ponerEnFinal = function(){
        if (!this.nodo) return;
        this.desaprobar();
        this.nodo.enfinal = true;
        this.actualizar()
    };
    
    this.aprobarConNota = function(nota){
        if (!this.nodo) return;
        this.nodo.nota = nota;
        if (this.nodo.label.includes('['))
            this.nodo.label = this.nodo.label.split('\n[')[0];
        this.nodo.label += '\n[' + this.nodo.nota + ']';
        FIUBAMAP.actualizarPromedio(this.nodo);
        if (!this.nodo.aprobada) this.aprobar();
    };
        
    this.deshabilitar = function(){
        if (!this.nodo) return;
        this.nodo.habilitada = false;
        this.actualizar()
    };
    
    
    this.desaprobar = function(){
        if (!this.nodo) return;
        if (this.nodo.aprobada) 
            FIUBAMAP.actualizarCreditos(-this.nodo.creditos);
        this.nodo.aprobada = false;
        this.nodo.nota = 0;
        if (this.nodo.label.includes('['))
            this.nodo.label = this.nodo.label.split('\n[')[0];
        FIUBAMAP.actualizarPromedio(this.nodo);
        this.nodo.enfinal = false;
    
        let materiasQueHabilita = FIUBAMAP.NETWORK.getConnectedNodes(this.id, 'to');
        materiasQueHabilita.forEach(m => {
            let x = FIUBAMAP.MATERIAS.get(m)
            if (x) x.deshabilitar()
        });
        this.actualizar()
    };

    this.actualizar = function() {
        if (!this.nodo) return;
        let grupoDefault = this.nodo.categoria;
        if (this.nodo.aprobada) grupoDefault = 'Aprobadas';
        else if (this.nodo.enfinal) grupoDefault = 'En Final';
        else if (this.nodo.habilitada) grupoDefault = 'Habilitadas';
        this.nodo.group = grupoDefault;
        FIUBAMAP.MATERIAS.update(this.nodo)
    };

    this.mostrarOpciones = function(){
        if (!this.nodo) return;
        const self = this;

        let nodonota = self.nodo.nota ? self.nodo.nota : '';
        let html = `
        <div class="modal" style='display:block'>
            <div id='materia-modal-content' class="modal-content">
                <span onclick='$(this.parentElement.parentElement.parentElement).empty()' id="materiaclose-button" class="close-button">&times;</span>
                <h3>[`+self.id+`] `+self.nodo.label+`</h3>
                <p>
                    Nota:
                    <input id='nota' class='materia-input' type="number" min="4" max="10" value="`+nodonota+`" />
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
    
        $('#aprobar-button').on('click', function() {
            let nota = $('#nota').val();
            if (nota) self.aprobarConNota(nota);
            else self.aprobar();
            $("#materiaclose-button").click()
        });
    
        $('#enfinal-button').on('click', function() {
            self.ponerEnFinal();
            $("#materiaclose-button").click()
        });
    
        $('#desaprobar-button').on('click', function() {
            self.desaprobar();
            $("#materiaclose-button").click()
        })
    }
}

function breakWords(string){
    let broken = '';
    string.split(' ').forEach(element => {
        if (element.length < 5) broken+=' '+element;
        else broken+='\n'+element;
    });
    return broken.trim();
}

