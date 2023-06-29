import * as C from "./constants";
import ALIAS_MATERIAS from "./data/alias_materias";

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

export const postGraph = async (user, nodes, checkboxes, optativas, aplazos) => {
    const formData = new FormData();
    const padron = user.padron;
    const carreraid = user.carrera.id;
    const map = {
        materias: nodes.get({
            filter: (n) => n.aprobada || n.nota === -1 || n.cuatrimestre,
            fields: ["id", "nota", "cuatrimestre"],
        }),
    };
    if (checkboxes)
        map.checkboxes = checkboxes
            .filter((c) => c.check === true)
            .map((c) => c.nombre);
    if (optativas) map.optativas = optativas;
    if (aplazos) map.aplazos = aplazos;

    formData.append(`${C.GRAPH_FORM_ENTRIES.padron}`, padron);
    formData.append(`${C.GRAPH_FORM_ENTRIES.carrera}`, carreraid);
    formData.append(`${C.GRAPH_FORM_ENTRIES.map}`, JSON.stringify(map));
    return fetch(`${C.GRAPH_FORM}`, {
        body: formData,
        method: "POST",
        mode: "no-cors",
    })
};

export const getFiubaRepos = async () => {
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
