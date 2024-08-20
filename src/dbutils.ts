import * as C from "./constants";
import { UserInfo, UserCarreraMap, UserMap } from "./types/User";
import {
  GithubSearchRepo,
  GithubSearchRepoJSON,
  AliasMateriasFIUBARepos,
  MateriaFIUBARepo,
  RegistrosValueRange,
} from "./types/externalAPI";

// Le pega al form de bugs
export const submitBug = async (user: UserInfo, bug: string) => {
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
export const postUser = async (user: UserInfo) => {
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
export const postGraph = async (user: UserInfo, map: UserCarreraMap) => {
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
  const ALIAS_MATERIAS: AliasMateriasFIUBARepos = await fetch(
    C.FIUBAREPOSJSON,
  ).then((res) => res.json());

  let totalCount = null;
  const repos: GithubSearchRepo[] = [];
  let i = 1;

  while (!totalCount || repos.length < totalCount) {
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

    const json: GithubSearchRepoJSON = await res.json();
    if (!json.items || !json.items.length) break;
    totalCount = json.total_count;
    repos.push(...json.items);
    i++;
  }

  // Agarra todos los codigos de materias que aparezcan en los topics de cada repo
  const codigosMaterias = [
    ...new Set(
      repos.flatMap((repo) =>
        // El regex /^\d\d\d\d$/ matchea a los topics que sean 4 numeros,
        // por ejemplo matchea "7573", pero no matchea "fiuba"
        repo.topics.filter((t: string) => t.match(/^\d\d\d\d$/)),
      ),
    ),
  ];

  // FIXME: quedo muy verboso accumulator, current??
  let allMaterias = Object.keys(ALIAS_MATERIAS).reduce<MateriaFIUBARepo[]>(
    (accumulator, current) => {
      const nombre = ALIAS_MATERIAS[current];
      let materia = accumulator.find((m) => m.nombre === nombre);

      if (materia) {
        materia.codigos.push(current);
      } else {
        accumulator.push({
          codigos: [current],
          nombre,
        });
      }

      return accumulator;
    },
    [],
  );

  codigosMaterias.forEach((codigo) => {
    const materia = allMaterias.find((materia) => materia.codigos.includes(codigo));

    if (!materia) return;
    if (materia.reponames) {
      materia.reponames = new Set([
        ...materia.reponames,
        ...repos.filter((repo) => repo.topics.includes(codigo)).map((repo) => repo.full_name),
      ]);
    } else {
      materia.reponames = new Set(
        repos.filter((repo) => repo.topics.includes(codigo)).map((repo) => repo.full_name),
      );
    }
  });

  return allMaterias.filter((materia) => materia.reponames && materia.reponames.size > 0);
};

// Consigue todos los mapas asociados a un padron, de todas las carreras
// TODO: quiza haya que handlear cuando maps es undefined en vez de permitirlo?,
export const getGraphs = async (padron: string) => {
  const data = await fetch(
    `${C.SPREADSHEET}/${C.SHEETS.registros}!B:D?majorDimension=COLUMNS&key=${C.KEY}`,
  )
    .then((res) => res.json())
    .then((res: RegistrosValueRange) => (res.error ? null : res.values));
  if (!data) return;

  const [padrones, carreras, maps] = data;
  const indexes: number[] = [];
  let j = -1;
  while ((j = padrones.indexOf(padron, j + 1)) !== -1) {
    indexes.push(j);
  }

  const allLogins: UserMap[] = [];
  for (let i = 0; i < indexes.length; i++) {
    allLogins.push({
      carreraid: carreras[indexes[i]].carreraid,
      map: JSON.parse(maps[indexes[i]].map),
    });
  }

  return allLogins;
};
