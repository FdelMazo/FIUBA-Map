import React from "react";
import { GraphContext } from "../../MapContext";
import { getCurrentCuatri } from "../../utils";
import MateriaControl from "./MateriaControl";
import MateriaStatus from "./MateriaStatus";
import { useHotkeys } from "react-hotkeys-hook";

// Cuando una materia esta seleccionada, el header se convierte en solamente dos cosas:
// - un status de la materia (nombre, creditos, etc)
// - una botonera para controlar el nodo (aprobarlo, desaprobarlo, etc)
// Aca se setupea el teclado
// - flechitas de arriba y abajo: cambiar la nota
// - flechitas de der/izq: cambiar el cuatri
// - numeros: setear la nota
const MateriaDisplay = () => {
  const { getNode, aprobar, displayedNode, desaprobar, cursando } =
    React.useContext(GraphContext);
  const node = React.useMemo(
    () => (displayedNode ? getNode(displayedNode) : undefined),
    [displayedNode, getNode],
  );

  useHotkeys("up", () => {
    if (!node) return;
    let nextNota = node.nota + 1;
    if (node.nota === 0) nextNota = 4;
    if (node.nota === 10) {
      desaprobar(displayedNode);
      return;
    }
    aprobar(displayedNode, nextNota);
  });

  useHotkeys("down", () => {
    if (!node) return;
    let prevNota = node.nota - 1;
    if (node.nota === 4) prevNota = 0;
    if (node.nota === -2) prevNota = 10;
    if (node.nota === -1) {
      desaprobar(displayedNode);
      return;
    }
    aprobar(displayedNode, prevNota);
  });

  useHotkeys("left", () => {
    if (!node) return;
    if (["*CBC", "CBC"].includes(node.categoria)) return;
    const prevCuatri = node.cuatrimestre
      ? node.cuatrimestre - 0.5
      : getCurrentCuatri();
    cursando(displayedNode, prevCuatri);
  });

  useHotkeys("right", () => {
    if (!node) return;
    if (["*CBC", "CBC"].includes(node.categoria)) return;
    const nextCuatri = node.cuatrimestre
      ? node.cuatrimestre + 0.5
      : getCurrentCuatri();
    cursando(displayedNode, nextCuatri);
  });

  useHotkeys("0,4,5,6,7,8,9", (e) => {
    if (!node) return;
    const n = parseInt(e.key);
    if (n === 0) {
      aprobar(displayedNode, 10);
    } else {
      aprobar(displayedNode, n);
    }
  });

  return (
    <>
      <MateriaStatus />
      <MateriaControl />
    </>
  );
};

export default MateriaDisplay;
