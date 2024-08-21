export interface NodeType {
  nodeRef: this;
  label: string;
  group: string;
  nota: number;
  aprobada: boolean;
  cuatrimestre: number | undefined;
  level: number;
  originalLevel: number;
  hidden: boolean;
  categoria: string;
  opacity: number | undefined;
  id: string;
  creditos: number;
  requiere?: boolean;
  materia: string;
  aprobar(nota: number): this | undefined;
  desaprobar(): this;
  cursando(cuatri: number | undefined): this;
  isHabilitada(ctx:): boolean;
  actualizar(ctx: ): this;
  setOptions(data: {level: number}): boolean; // FIXME: medio hardcodeado esto de setOptions de NodeType
}