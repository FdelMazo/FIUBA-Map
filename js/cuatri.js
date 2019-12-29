function setCuatri(cuatri) {
    FIUBAMAP.cuatri = cuatri
    $("#cuatri input").val(cuatri.toString().replace('.','c').replace(',','c'))
}

function getCuatri() {
    return parseFloat($("#cuatri input").val().replace('c','.'))
}

function cuatriActual() {
    date = new Date()
    anio = date.getYear() + 1900
    mes = date.getMonth()
    if (mes <= 6) cuatri = 1
    else cuatri = 2
    return parseFloat(anio+'.'+cuatri)
}

function getPrev(cuatri) {
    let dec = (cuatri - Math.floor(cuatri)).toFixed(1)*10
    if (dec == 1)
        return parseFloat((cuatri - 0.9).toFixed(1))
    else
        return parseFloat((cuatri - 0.1).toFixed(1))
}

function getNext(cuatri) {
    let dec = (cuatri - Math.floor(cuatri)).toFixed(1)*10
    if (dec == 1) {
        return parseFloat((cuatri + 0.1).toFixed(1))
    }
    else
        return parseFloat((cuatri + 0.9).toFixed(1))
}

$(document).ready(function () {
    $(document).on("keyup", function (event) {
        if (event.keyCode === 37) {
            setCuatri(getPrev(getCuatri()))
            FIUBAMAP.cambiarCuatri()
        }
        if (event.keyCode == 39) {
            setCuatri(getNext(getCuatri()))
            FIUBAMAP.cambiarCuatri()
        }
    })
    $("#cuatri-next").on("click", function (event) {
        setCuatri(getNext(getCuatri()))
        FIUBAMAP.cambiarCuatri()
    })
    $("#cuatri-prev").on("click", function (event) {
        setCuatri(getPrev(getCuatri()))
        FIUBAMAP.cambiarCuatri()
    })
})
