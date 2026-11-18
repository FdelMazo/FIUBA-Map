import { GraphType } from "./types/Graph";
import type { ColorScheme } from "./theme";
import { UserType } from "./types/User";

export const promediar = (materias: { nota: number }[]) => {
  const sum = materias.reduce((acc, node) => {
    acc += node.nota;
    return acc;
  }, 0);
  return sum ? (sum / materias.length).toFixed(2) : 0;
};

export const accCreditos = (acc: number, node: { creditos: number }) => {
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

// Las materias de una orientacion tienen categoria "Orientacion:<nombre del grupo>"
const PREFIJO_ORIENTACION = "Orientacion:";

// El nombre de la orientacion de una categoria, o undefined si no es de orientacion
export const getOrientacionDeCategoria = (categoria: string) =>
  categoria.startsWith(PREFIJO_ORIENTACION)
    ? categoria.slice(PREFIJO_ORIENTACION.length)
    : undefined;

// El grupo visual de una materia: el del json, el de su orientacion, o su categoria
export const getGrupo = (materia: { categoria: string; grupo?: string }) =>
  materia.grupo ??
  getOrientacionDeCategoria(materia.categoria) ??
  materia.categoria;

const COLORES_GRUPOS: ColorScheme[] = [
  "grupo1",
  "grupo2",
  "grupo3",
  "grupo4",
  "grupo5",
  "grupo6",
  "grupo7",
  "grupo8",
];

// Los grupos de la carrera (los del json y las orientaciones), con un color cada uno
// en el orden en que aparecen. Si hay mas grupos que colores, se repiten
export const getGrupos = (carrera: UserType.Carrera): UserType.Grupo[] => {
  const nombres = new Set<string>();
  carrera.graph.forEach((m) => {
    const grupo = m.grupo ?? getOrientacionDeCategoria(m.categoria);
    if (grupo) nombres.add(grupo);
  });
  return [...nombres].map((nombre, i) => ({
    nombre,
    colorScheme: COLORES_GRUPOS[i % COLORES_GRUPOS.length]!,
  }));
};

// Las orientaciones que se pueden elegir en la carrera (vacio si no te hace elegir)
export const getOrientaciones = (carrera: UserType.Carrera) =>
  getGrupos(carrera).filter(
    (g) => carrera.creditos.orientaciones?.[g.nombre] !== undefined,
  );

// La orientacion `nombre`, si la carrera la tiene como elegible
export const getOrientacion = (
  carrera: UserType.Carrera,
  nombre: string | undefined,
) => getOrientaciones(carrera).find((o) => o.nombre === nombre);

// Los finales de carrera obligatorios: los que no estan para elegir en `carrera.finDeCarrera`
// (el TIF de los planes 2020)
export const getFinesDeCarreraObligatorios = (carrera: UserType.Carrera) =>
  carrera.graph.filter(
    (m) =>
      m.categoria === "Fin de Carrera" &&
      !carrera.finDeCarrera?.some((f) => f.materia === m.id),
  );

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

  const [creditosOrientacion] = Object.values(creditos.orientaciones ?? {});
  const finDeCarrera = carrera.finDeCarrera?.[0];

  const electivas = (creditosOrientacion ?? creditos).electivas;
  const creditosElectivas =
    typeof electivas === "number"
      ? electivas
      : (finDeCarrera && electivas?.[finDeCarrera.id]) || 0;

  return (
    creditosCategoria("*CBC") +
    creditosCategoria("Materias Obligatorias") +
    creditosElectivas +
    (creditosOrientacion?.creditos ?? 0) +
    getFinesDeCarreraObligatorios(carrera).reduce(accCreditos, 0) +
    (finDeCarrera ? creditosDe(finDeCarrera.materia) : 0)
  );
};
