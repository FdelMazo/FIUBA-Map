import { NodeType } from "./types/Node";
import { GraphType } from "./types/Graph";

export const promediar = (materias: NodeType[]) => {
  const sum = materias.reduce((acc, node: NodeType) => {
    acc += node.nota;
    return acc;
  }, 0);
  return sum ? (sum / materias.length).toFixed(2) : 0;
};

export const accCreditos = (
  acc: number,
  node: NodeType | GraphType.Optativa,
) => {
  acc += node.creditos;
  return acc;
};

export const accCreditosNecesarios = (
  acc: number,
  grupo: GraphType.Credito,
) => {
  acc += grupo.creditosNecesarios;
  return acc;
};

export const accProportion = (acc: number, grupo: GraphType.Credito) => {
  if (grupo.proportion) {
    acc += grupo.proportion;
  }
  return acc;
};

export const getCurrentCuatri = () => {
  const today = new Date();
  let cuatri = today.getFullYear();
  const month = today.getMonth();
  // recordemos que el month esta 0-indexed
  // 1C entre marzo (2) y julio (6)
  // 2C entre agosto (7) y febrero (1)
  if (month < 2) cuatri -= 0.5;
  else if (month > 6) cuatri += 0.5;
  return cuatri;
};

// Creditos totales necesarios para recibirse en la carrera.
// Cada plan tiene distintas combinaciones de orientacion y fin de carrera, pero
// el total es el mismo para todas. Lo calculamos con la primera combinacion elegible, sin
// depender de lo que haya configurado el usuario.
export const getCreditosTotalesNecesarios = (carrera: UserType.Carrera) => {
  const { graph, creditos } = carrera;
  const creditosDe = (id: string) =>
    graph.find((m) => m.id === id)?.creditos ?? 0;
  const creditosCategoria = (categoria: string) =>
    graph.filter((m) => m.categoria === categoria).reduce(accCreditos, 0);

  const orientacion = carrera.orientaciones?.find(
    (o) => !o.nonEligible,
  )?.nombre;
  const finDeCarrera = carrera.finDeCarrera?.[0];
  const creditosOrientacion =
    (carrera.eligeOrientaciones &&
      orientacion &&
      creditos.orientacion?.[orientacion]) ||
    undefined;

  const electivas = (creditosOrientacion ?? creditos).electivas;
  const creditosElectivas =
    typeof electivas === "number"
      ? electivas
      : (finDeCarrera && electivas?.[finDeCarrera.id]) || 0;

  return (
    creditosCategoria("*CBC") +
    creditosCategoria("Materias Obligatorias") +
    creditosElectivas +
    (creditosOrientacion?.orientacion ?? 0) +
    (creditos.materias ?? []).reduce((acc, m) => acc + creditosDe(m.id), 0) +
    (finDeCarrera ? creditosDe(finDeCarrera.materia) : 0)
  );
};
