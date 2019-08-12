var FORMAPI = 'https://docs.google.com/forms/u/0/d/1xUf-9SWdGf0jv_weLRe4tlXb-GWHkH-kc-v_S8kKGCI'
var SHEETAPI = "https://spreadsheets.google.com/feeds/list/1B7ytzx_-XvmaMApIb1UX3DXBCSCAAelXs_TuJ0Ww2fE/default/public/values?alt=json"

function save(clave, carrera, materias){
    var form = $("<form id='formRecord' type='hidden' action=" + FORMAPI + " onsubmit='return window.submitGoogleForm(this)'></form>")
    form.append("<input name='entry.774465991' value=" + clave + ">")
    form.append("<input name='entry.992084860' value=" + carrera + ">")
    form.append("<input name='entry.2026137499' value=" + materias + ">")
    form.submit()
}

function load(clave){
    $.ajax({
        url: SHEETAPI,
        method: 'GET',
        success: function(data) {
            loadMap(data,clave)
        }
    })
}

function loadMap(api, clave){
    var data = api.feed.entry
    usuario = null
    data.forEach(fila => {
        if(fila.gsx$clave.$t == clave) {
            usuario = fila
        }
    })
    if (!usuario) {window.location = "https://fdelmazo.github.io/FIUBA-Map"}
    let carrera = usuario.gsx$carrera.$t
    let materias = usuario.gsx$materias.$t 
    update(null,carrera, materias)
    $("#clave").val(clave)
}

$('#databaseButton').off('click').on('click',function(){
    let clave = $("#clave").val()
    if (!clave){ return }
    let carrera = carreraActual
    let materiasArr = []
    NODOS.forEach(nodo => {
        if (nodo.aprobada) {materiasArr.push(nodo.id)}
    })
    let materias = materiasArr.join('-')
    save(clave,carrera,materias)

    setTimeout(function() {
        window.location = "https://fdelmazo.github.io/FIUBA-Map?clave="+clave;
    }, 1000)
    
})

$('#databaseReload').off('click').on('click',function(){
    let clave = $("#clave").val()
    if (!clave){ return }
    window.location = "https://fdelmazo.github.io/FIUBA-Map?clave="+clave;    
})