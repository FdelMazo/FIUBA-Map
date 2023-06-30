/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { GraphContext } from "../../MapContext";
import { getCurrentCuatri } from "../../utils";
import MateriaControl from "./MateriaControl";
import MateriaStatus from "./MateriaStatus";
import { useHotkeys } from "react-hotkeys-hook";

const MateriaDisplay = () => {
  const { getNode, aprobar, displayedNode, desaprobar, cursando } =
    React.useContext(GraphContext);
  const node = React.useMemo(() => getNode(displayedNode), [displayedNode, getNode])

  useHotkeys('up', () => {
    let nextNota = node.nota + 1;
    if (node.nota === 0) nextNota = 4;
    if (node.nota === 10) {
      desaprobar(displayedNode)
      return
    };
    aprobar(displayedNode, nextNota)
  })

  useHotkeys('down', () => {
    let prevNota = node.nota - 1;
    if (node.nota === 4) prevNota = 0;
    if (node.nota === -2) prevNota = 10;
    if (node.nota === -1) {
      desaprobar(displayedNode)
      return
    };
    aprobar(displayedNode, prevNota)
  })

  useHotkeys('left', () => {
    if (node.categoria === "*CBC") return
    const prevCuatri = node.cuatrimestre ? node.cuatrimestre - 0.5 : getCurrentCuatri();
    cursando(displayedNode, prevCuatri);
  })

  useHotkeys('right', () => {
    if (node.categoria === "*CBC") return
    const nextCuatri = node.cuatrimestre ? node.cuatrimestre + 0.5 : getCurrentCuatri();
    cursando(displayedNode, nextCuatri);
  })

  useHotkeys('0,4,5,6,7,8,9', (e) => {
    const n = parseInt(e.key)
    if (n === 0) {
      aprobar(displayedNode, 10);
    } else {
      aprobar(displayedNode, n);
    }
  })

  return (
    <>
      <MateriaStatus />
      <MateriaControl />
    </>
  );
};

export default MateriaDisplay;
