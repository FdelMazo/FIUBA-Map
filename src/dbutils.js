import * as C from "./constants";

// Le pega al form de bugs
export const submitBug = async (user, bug) => {
    if (!bug) return;
    const formData = new FormData();
    const padron = user.padron;
    const carreraid = user.carrera.id;
    const orientacionid = user.orientacion?.nombre;
    const findecarreraid = user.finDeCarrera?.id;
    formData.append(`${C.BUGS_FORM_ENTRIES.padron}`, padron);
    formData.append(`${C.BUGS_FORM_ENTRIES.carrera}`, carreraid);
    formData.append(`${C.BUGS_FORM_ENTRIES.orientacion}`, orientacionid || "");
    formData.append(
        `${C.BUGS_FORM_ENTRIES.finDeCarrera}`,
        findecarreraid || ""
    );
    formData.append(`${C.BUGS_FORM_ENTRIES.bug}`, bug || "");
    return fetch(`${C.BUGS_FORM}`, {
        body: formData,
        method: "POST",
        mode: "no-cors",
    });
};

// Le pega al form que almacena [padron,carrera,orientacion,findecarrera]
export const postUser = async (user) => {
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
// el map es un json stringifeado que tiene [materias,optativas,aplazos,checkboxes]
export const postGraph = async (user, map) => {
    const formData = new FormData();
    formData.append(`${C.GRAPH_FORM_ENTRIES.padron}`, user.padron);
    formData.append(`${C.GRAPH_FORM_ENTRIES.carrera}`, user.carrera.id);
    formData.append(`${C.GRAPH_FORM_ENTRIES.map}`, JSON.stringify(map));
    return fetch(`${C.GRAPH_FORM}`, {
        body: formData,
        method: "POST",
        mode: "no-cors",
    })
};

// Hace lo mismo que fiuba repos: se fija si hay repos con el topic fiuba
// y los clasifica segun carreras, para poder decir "mira los N repos de esta materia!"
// Despues, con eso, solamente se redirige a fiuba repos
export const getFiubaRepos = async () => {
    const ALIAS_MATERIAS = await fetch(C.FIUBAREPOSJSON).then(res => res.json())

    let totalCount = null;
    const items = [];
    let i = 1;
    while (!totalCount || items.length < totalCount) {
        const res = await fetch(
            `https://api.github.com/search/repositories?` + new URLSearchParams({
                q: "topic:fiuba fork:true",
                sort: "updated",
                order: "desc",
                page: i,
                per_page: 100,
            }), {
            headers: {
                Accept: "application/vnd.github.v3+json"
            }
        });
        const json = await res.json();
        if (!json.items || !json.items.length) break;
        totalCount = json.total_count;
        items.push(...json.items);
        i++;
    }

    const codigosMaterias = [...new Set(items.flatMap(r =>
        r.topics.filter(t => t.match(/^\d\d\d\d$/))
    ))]

    let allMaterias = Object.keys(ALIAS_MATERIAS).reduce((acc, c) => {
        const nombre = ALIAS_MATERIAS[c];
        let m = acc.find(mx => mx.nombre === nombre)
        if (m) {
            m.codigos.push(c)
        } else {
            acc.push({
                codigos: [c],
                nombre,
            })
        }
        return acc;
    }, [])

    codigosMaterias.forEach(c => {
        const materia = allMaterias.find(m => m.codigos.includes(c))
        if (!materia) return;
        if (materia.reponames) {
            materia.reponames = new Set([...materia.reponames, ...items.filter(r => r.topics.includes(c)).map(r => r.full_name)])
        } else {
            materia['reponames'] = new Set(items.filter(r => r.topics.includes(c)).map(r => r.full_name))
        }
    })

    return allMaterias.filter(m => m.reponames?.size > 0);
}

// Consigue todos los mapas asociados a un padron, de todas las carreras
export const getGraphs = async (padron) => {
    const data = await fetch(
        `${C.SPREADSHEET}/${C.SHEETS.registros}!B:D?majorDimension=COLUMNS&key=${C.KEY}`
    )
        .then((res) => res.json())
        .then((res) => (!res.error ? res.values : null));
    if (!data) return;

    const [padrones, carreras, maps] = data;
    const indexes = [];
    let j = -1;
    while ((j = padrones.indexOf(padron, j + 1)) !== -1) {
        indexes.push(j);
    }

    const allLogins = [];
    for (let i = 0; i < indexes.length; i++) {
        allLogins.push({
            carreraid: carreras[indexes[i]],
            map: maps[indexes[i]],
        });
    }

    return allLogins.map((l) => ({
        carreraid: l.carreraid,
        map: JSON.parse(l.map),
    }));
};
