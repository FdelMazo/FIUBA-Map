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
}
