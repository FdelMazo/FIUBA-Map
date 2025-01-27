import * as C from "./constants";
import { UserType } from "./types/User";
import { GithubAPI, GoogleSheetAPI } from "./types/externalAPI";

// Le pega al form de bugs
export const submitBug = async (user: UserType.Info, bug: string) => {
  if (!bug) return;
  const formData = new FormData();
  const padron = user.padron;
  const carreraid = user.carrera.id;
  const orientacionid = user.orientacion?.nombre;
  const findecarreraid = user.finDeCarrera?.id;
  formData.append(`${C.BUGS_FORM_ENTRIES.padron}`, padron);
  formData.append(`${C.BUGS_FORM_ENTRIES.carrera}`, carreraid);
  formData.append(`${C.BUGS_FORM_ENTRIES.orientacion}`, orientacionid || "");
  formData.append(`${C.BUGS_FORM_ENTRIES.finDeCarrera}`, findecarreraid || "");
  formData.append(`${C.BUGS_FORM_ENTRIES.bug}`, bug || "");
  return fetch(`${C.BUGS_FORM}`, {
    body: formData,
    method: "POST",
    mode: "no-cors",
  });
};

// Le pega al form que almacena [padron,carrera,orientacion,findecarrera]
export const postUser = async (user: UserType.Info) => {
  const formData = new FormData();
  const padron = user.padron;
  const carreraid = user.carrera.id;
  const orientacionid = user.orientacion?.nombre;
  const findecarreraid = user.finDeCarrera?.id;
  formData.append(`${C.USER_FORM_ENTRIES.padron}`, padron);
  formData.append(`${C.USER_FORM_ENTRIES.carrera}`, carreraid);
  formData.append(`${C.USER_FORM_ENTRIES.orientacion}`, orientacionid || "");
  formData.append(`${C.USER_FORM_ENTRIES.finDeCarrera}`, findecarreraid || "");
  return fetch(`${C.USER_FORM}`, {
    body: formData,
    method: "POST",
    mode: "no-cors",
  });
};

// Le pega al form que almacena [padron,carrera,map]
// el map es un JSON stringifeado que tiene [materias, optativas, aplazos, checkboxes]
export const postGraph = async (user: UserType.Info, map: UserType.CarreraMap) => {
  const formData = new FormData();
  formData.append(`${C.GRAPH_FORM_ENTRIES.padron}`, user.padron);
  formData.append(`${C.GRAPH_FORM_ENTRIES.carrera}`, user.carrera.id);
  formData.append(`${C.GRAPH_FORM_ENTRIES.map}`, JSON.stringify(map));
  return fetch(`${C.GRAPH_FORM}`, {
    body: formData,
    method: "POST",
    mode: "no-cors",
  });
};

// Hace lo mismo que FIUBA Repos: se fija si hay repos con el topic fiuba
// y los clasifica segun carreras, para poder decir "mira los N repos de esta materia!"
// Despues, con eso, solamente se redirige a FIUBA Repos
export const getFiubaRepos = async () => {
  // TODO: handlear el caso que haya un error fetcheando la data???
  const ALIAS_MATERIAS: GithubAPI.AliasMateriasFIUBARepos = await fetch(C.FIUBAREPOSJSON).then((res) =>
    res.json()
  );

  let totalCount = null;
  const items: GithubAPI.GithubSearchRepo[] = [];
  let i = 1;
  while (!totalCount || items.length < totalCount) {
    const res = await fetch(
      `https://api.github.com/search/repositories?` +
        new URLSearchParams({
          q: "topic:fiuba fork:true",
          sort: "updated",
          order: "desc",
          page: i.toString(),
          per_page: "100",
        }),
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      },
    );
    const json: GithubAPI.GithubSearchRepoJSON = await res.json();
    if (!json.items || !json.items.length) break;
    totalCount = json.total_count;
    items.push(...json.items);
    i++;
  }

  // Agarra todos los codigos de materias que aparezcan en los topics de cada repo
  const codigosMaterias = [
    ...new Set(
      items.flatMap((r) =>
        // El regex /^\d\d\d\d$/ matchea a los topics que sean 4 numeros,
        // por ejemplo matchea "7573", pero no matchea "fiuba"
        r.topics.filter((t: string) => t.match(/^\d\d\d\d$/)),
      ),
    ),
  ];

  let allMaterias = Object.keys(ALIAS_MATERIAS).reduce<GithubAPI.MateriaFIUBARepo[]>(
    (acc, c) => {
      const nombre = ALIAS_MATERIAS[c];
      let m = acc.find((mx) => mx.nombre === nombre);
      if (m) {
        m.codigos.push(c);
      } else {
        acc.push({
          codigos: [c],
          nombre,
        });
      }
      return acc;
    },
    [],
  );

  codigosMaterias.forEach((c) => {
    const materia = allMaterias.find((m) =>m.codigos.includes(c));
    if (!materia) return;
    if (materia.reponames) {
      materia.reponames = new Set([
        ...materia.reponames,
        ...items.filter((r) => r.topics.includes(c)).map((r) => r.full_name),

      ]);
    } else {
      materia["reponames"] = new Set(
        items.filter((r) => r.topics.includes(c)).map((r) => r.full_name),
      );
    }
  });

  return allMaterias.filter((m) => m.reponames && m.reponames.size > 0);
};

// Consigue todos los mapas asociados a un padron, de todas las carreras
export const getGraphs = async (padron: string) => {
  const data = await fetch(
    `${C.SPREADSHEET}/${C.SHEETS.registros}!B:D?majorDimension=COLUMNS&key=${C.KEY}`,
  )
    .then((res) => res.json())
    .then((res: GoogleSheetAPI.RegistrosValueRange) => (!res.error ? res.values : null));
  if (!data) return;

  const [padrones, carreras, maps] = data;
  const indexes: number[] = [];
  let j = -1;
  while ((j = padrones.indexOf(padron, j + 1)) !== -1) {
    indexes.push(j);
  }

  const allLogins: {carreraid: string, map: string}[] = [];
  for (let i = 0; i < indexes.length; i++) {
    allLogins.push({
      carreraid: carreras[indexes[i]],
      map: maps[indexes[i]],
    });
  }

  return allLogins.map((l) => ({
    carreraid: l.carreraid,
    map: JSON.parse(l.map),
  })) as UserType.Map[];
};
