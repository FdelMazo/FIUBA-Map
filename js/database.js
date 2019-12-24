let FORMAPI = 'https://docs.google.com/forms/u/0/d/1xUf-9SWdGf0jv_weLRe4tlXb-GWHkH-kc-v_S8kKGCI';
let SHEETAPI = "https://spreadsheets.google.com/feeds/list/1B7ytzx_-XvmaMApIb1UX3DXBCSCAAelXs_TuJ0Ww2fE/default/public/values?alt=json";

function save(clave, carrera, materias) {
    let form = $("<form id='formRecord' type='hidden' action=" + FORMAPI + " onsubmit='return window.submitGoogleForm(this)'></form>");
    form.append("<input name='entry.774465991' value=" + clave + ">");
    form.append("<input name='entry.992084860' value=" + carrera + ">");
    form.append("<input name='entry.2026137499' value=" + materias + ">");
    form.submit()
}

function loadMap(api, clave) {
    $("#clave input").val(clave);
    let data = api.feed.entry;
    let usuario = null;
    data.forEach(fila => {
        if (fila.gsx$clave.$t == clave) usuario = fila
    });
    if (!usuario) {
        warningSnackbar(clave);
        $("#sistemas").click()
        return
    }
    let carrera = usuario.gsx$carrera.$t;
    let materias = usuario.gsx$materias.$t;
    let materiasAprobadas = materias
    main(carrera)
    cargarMaterias(materiasAprobadas)
}

$(document).ready(function () {
    $('#clave-save').on('click', function () {
        let clave = $("#clave input").val();
        if (!clave) return;
        let carrera = FIUBAMAP.carrera;
        let materias = mapToJson(FIUBAMAP.aprobadas)
        save(clave, carrera, materias);
        let url = new URL(window.location.href);
        url.searchParams.set('clave', clave)    
        window.history.pushState("", "", url.toString())
    });

    $('#clave-load').on('click', function () {
        let clave = $("#clave input").val();
        if (!clave) return;
        window.location = "https://fdelmazo.github.io/FIUBA-Map?clave=" + clave;
    });

    $('#clave input').on("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $("#clave-load").click();
        }
    });
});

function cargarMaterias(materias) {
    let map = objToMap(materias)
    FIUBAMAP.aprobadas = map
    FIUBAMAP.cambiarCuatri()
}

function mapToJson(map){
    let obj = {}
    map.forEach((map,cuatri) => {
        obj[cuatri] = Object.fromEntries(map)
    })
    return JSON.stringify(obj)        
}

function objToMap(obj){
    let json = JSON.parse(obj)
    let map = new Map()
    Object.keys(json).forEach(cuatri => {
        let submap = new Map()
        Object.keys(json[cuatri]).forEach(id => {
            submap.set(id, parseInt(json[cuatri][id]))
        })
        map.set(parseFloat(cuatri), submap)
    })
    return map
}
