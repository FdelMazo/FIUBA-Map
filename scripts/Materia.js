function Materia(codigo){
    this.id = codigo
    this.nodo = NODOS.get(this.id);

    this.aprobar = function(){
        if (!this.nodo) return
        this.nodo.aprobada = true;
        this.actualizarGrupo()
        actualizarCreditos(this.nodo.creditos);
        let materiasQueHabilita = NETWORK.getConnectedNodes(this.id, 'to');
        materiasQueHabilita.forEach(m => {
            new Materia(m).habilitar()
        })
    }

    this.habilitar = function(){
        if (!this.nodo) return
        let neighborsFrom = NETWORK.getConnectedNodes(this.id, 'from');
        let todoAprobado = true;
        for (let i = 0; i < neighborsFrom.length; i++ ){
            let correlativa = NODOS.get(neighborsFrom[i]);
            if (!correlativa) continue;
            todoAprobado &= correlativa.aprobada
        }
        if (!todoAprobado || NETWORK.creditos < this.nodo.requiere) return;
        this.nodo.habilitada = true;
        this.actualizarGrupo()
    }

    this.ponerEnFinal = function(){
        if (!this.nodo) return
        this.desaprobar();
        this.nodo.enfinal = true;
        this.actualizarGrupo()
    }
    
    this.aprobarConNota = function(nota){
        if (!this.nodo) return
        if (nota) {
            this.nodo.nota = nota;
            if (this.nodo.label.includes('[')) 
                this.nodo.label = this.nodo.label.split('\n[')[0]
            this.nodo.label += '\n[' + this.nodo.nota + ']'
            actualizarPromedio(this.nodo);
        }
        if (!this.nodo.aprobada) this.aprobar();
    }
        
    this.deshabilitar = function(){
        if (!this.nodo) return
        this.nodo.habilitada = false;
        this.actualizarGrupo()
    }
    
    
    this.desaprobar = function(){
        if (!this.nodo) return
        if (this.nodo.aprobada) 
            actualizarCreditos(-this.nodo.creditos);
        this.nodo.aprobada = false;
        this.nodo.nota = 0;
        if (this.nodo.label.includes('[')) 
            this.nodo.label = this.nodo.label.split('\n[')[0]
        actualizarPromedio(this.nodo)
        this.nodo.enfinal = false;
    
        let materiasQueHabilita = NETWORK.getConnectedNodes(this.id, 'to');
        materiasQueHabilita.forEach(m => {
            new Materia(m).deshabilitar()
        });
        this.actualizarGrupo()
    }

    this.mostrarOpciones = function(){
        if (!this.nodo) return
        var self = this

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
            self.aprobarConNota(nota)
            $("#materiaclose-button").click()
        });
    
        $('#enfinal-button').on('click', function() {
            self.ponerEnFinal()
            $("#materiaclose-button").click()
        });
    
        $('#desaprobar-button').on('click', function() {
            self.desaprobar()
            $("#materiaclose-button").click()
        })
    }

    this.actualizarGrupo = function() {
        if (!this.nodo) return
        let grupoDefault = this.nodo.categoria;
        if (this.nodo.aprobada) grupoDefault = 'Aprobadas';
        else if (this.nodo.enfinal) grupoDefault = 'En Final';
        else if (this.nodo.habilitada) grupoDefault = 'Habilitadas';
        this.nodo.group = grupoDefault;
        NODOS.update(this.nodo)
    }

}


function createMateria(rowCells) {
    let [codigo, materia, creditos, correlativas, categoria, nivel] = rowCells;    
    let m = {}
    m.label = breakWords(materia);
    m.creditos = parseInt(creditos);
    m.correlativas = correlativas.split('-');
    m.id = codigo
    m.group = categoria
    m.level = nivel
    m.categoria = categoria
    m.aprobada = false
    m.nota = null
    m.enfinal = false
    m.habilitada = false
    return m
}

function breakWords(string){
    let broken = '';
    string.split(' ').forEach(element => {
        if (element.length < 5) broken+=' '+element;
        else broken+='\n'+element;
    });
    return broken.trim();
}

