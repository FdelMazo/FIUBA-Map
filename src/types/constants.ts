// La interfaz de ctxRenderer que utilizamos con vis.js para dibujar el graph y los nodos
// mas info en https://visjs.github.io/vis-network/docs/network/nodes.html

export interface Ctx {
  fillStyle: string;
  strokeStyle: string;
  lineWidth: number;
  globalAlpha: number;
  textAlign: string;
  font: string;

  beginPath(): void;

  moveTo(x: number, y: number): void;

  lineTo(x: number, y: number): void;

  closePath(): void;

  save(): void;

  fill(): void;

  stroke(): void;

  restore(): void;

  measureText(text: string): { width: number };

  fillText(text: string, x: number, y: number): void;
}

export interface DrawFinDeCarrera {
  ctx: Ctx;
  id: string;
  x: number;
  y: number;
  state: { selected: boolean; hover: boolean };
  style: { size: number; opacity: number; color: string };
  label: string;
}
