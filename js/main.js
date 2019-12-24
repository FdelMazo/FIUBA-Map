function main(carrera) {
    $("#grafo").html("<div class='loader'></div>");
    defaultFooterSnackbar()
    $('#carreras .dropdown-content').hide();
    $("#carreras .active").removeClass('active');
    $("#materias").empty();
    let filename, titulo, tituloShort, plan;
    switch (carrera) {
        case 'informatica':
            filename = 'data/informatica-1986.csv';
            plan = 'Plan 1986 v2016';
            titulo = 'Ingeniería en Informática';
            tituloShort = 'Informática';
            break;
        case 'sistemas':
            filename = 'data/sistemas-1986.csv';
            plan = 'Plan 1986 v2016';
            titulo = 'Licenciatura en Análisis de Sistemas';
            tituloShort = 'Sistemas';
            break;
        case 'electronica':
            filename = 'data/electronica-2009.csv';
            plan = 'Plan 2009 v2019';
            titulo = 'Ingeniería Electrónica';
            tituloShort = 'Electrónica';
            break;
        case 'quimica':
            filename = 'data/quimica-1986.csv';
            plan = 'Plan 1986 v2016';
            titulo = 'Ingeniería Química';
            tituloShort = 'Química';
            break;
        case 'civil':
            filename = 'data/civil-2009.csv';
            plan = 'Plan 2009 v2016';
            titulo = 'Ingeniería Civil';
            tituloShort = 'Civil';
            break;
        case 'alimentos':
            filename = 'data/alimentos-2000.csv';
            plan = 'Plan 2000 v2016';
            titulo = 'Ingeniería de Alimentos';
            tituloShort = 'Alimentos';
            break;
        case 'electricista':
            filename = 'data/electricista-2009.csv';
            plan = 'Plan 2009 v2016';
            titulo = 'Ingeniería Electricista';
            tituloShort = 'Electricista';
            break;
        case 'naval':
            filename = 'data/naval-1986.csv';
            plan = 'Plan 1986 v2016';
            titulo = 'Ingeniería Naval y Mecánica';
            tituloShort = 'Naval';
            break;
        case 'mecanica':
            filename = 'data/mecanica-1986.csv';
            plan = 'Plan 1986 v2016';
            titulo = 'Ingeniería Mecánica';
            tituloShort = 'Mecánica';
            break;
        case 'petroleo':
            filename = 'data/petroleo-2015.csv';
            plan = 'Plan 2015 v2016';
            titulo = 'Ingeniería en Petróleo';
            tituloShort = 'Petróleo';
            break;        
        case 'agrimensura':
            filename = 'data/agrimensura-2006.csv';
            plan = 'Plan 2006 v2016';
            titulo = 'Ingeniería en Argimensura';
            tituloShort = 'Agrimensura';
            break;        
        case 'industrial':
            filename = 'data/industrial-2011.csv';
            plan = 'Plan 2011 v2019';
            titulo = 'Ingeniería Industrial';
            tituloShort = 'Industrial';
            break;        
    }

    $("#carrera-actual-long").text(titulo + ' | ' + plan);
    $("#carrera-actual-short").text(tituloShort);
    $("#" + carrera).addClass('active');

    $.ajax({
        url: filename,
        dataType: 'text',
        success: function (data) {
            new FiubaMap(data, carrera)
        },
        async: false
    })
}

$(document).ready(function () {
    $(".dropdown").on("mouseover", function () {
        $(this).children('.dropdown-content').show()
    });

    $(".dropdown").on("mouseout", function () {
        $(this).children('.dropdown-content').hide()
    });

    $('.carrera').on('click', function () {
        main($(this).attr('id'))
        FIUBAMAP.aprobar("CBC", 0, FIUBAMAP.cuatri)
    });

    $(document).keydown(function (event) {
        if (event.keyCode == 27)
            $('.close-button').click();
    });
});

$(document).ready(function () {
    $("#grafo").html("<div class='loader'></div>");
    defaultHeaderSnackbar()
    defaultFooterSnackbar()
    let url = new URL(window.location.href);
    let clave = url.searchParams.get('clave')
    if (clave)
        $.ajax({
            url: SHEETAPI,
            method: 'GET',
            success: function (data) {
                loadMap(data, clave)
            }
        })
    else
        $("#sistemas").click()
});
