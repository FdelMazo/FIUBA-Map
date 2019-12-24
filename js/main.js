function main(carrera) {
    $("#grafo").html("<div class='loader'></div>");
    $('#carreras .dropdown-content').hide();
    $("#carreras .active").removeClass('active');
    $("#materias").empty();
    $("#creditos-dropdown").empty();
    $('#creditos-var').text(0);
    let filename, titulo, tituloShort, plan, noblig, nelec, nelectpp;
    switch (carrera) {
        case 'informatica':
            filename = 'data/informatica-1986.csv';
            plan = 'Plan 1986 v2016';
            titulo = 'Ingeniería en Informática';
            tituloShort = 'Informática';
            noblig = 190
            nelec = 34
            nelectpp = 46
            break;
        case 'sistemas':
            filename = 'data/sistemas-1986.csv';
            plan = 'Plan 1986 v2016';
            titulo = 'Licenciatura en Análisis de Sistemas';
            tituloShort = 'Sistemas';
            noblig = 148
            nelec = 28
            break;
        case 'electronica':
            filename = 'data/electronica-2009.csv';
            plan = 'Plan 2009 v2019';
            titulo = 'Ingeniería Electrónica';
            tituloShort = 'Electrónica';
            noblig = 166
            nelec = 56
            break;
        case 'quimica':
            filename = 'data/quimica-1986.csv';
            plan = 'Plan 1986 v2016';
            titulo = 'Ingeniería Química';
            tituloShort = 'Química';
            noblig = 216
            nelec = 18
            nelectpp = 24
            break;
        case 'civil':
            filename = 'data/civil-2009.csv';
            plan = 'Plan 2009 v2016';
            titulo = 'Ingeniería Civil';
            tituloShort = 'Civil';
            noblig = 210
            nelec = 34
            break;
        case 'alimentos':
            filename = 'data/alimentos-2000.csv';
            plan = 'Plan 2000 v2016';
            titulo = 'Ingeniería de Alimentos';
            tituloShort = 'Alimentos';
            noblig = 210
            nelec = 34
            break;
        case 'electricista':
            filename = 'data/electricista-2009.csv';
            plan = 'Plan 2009 v2016';
            titulo = 'Ingeniería Electricista';
            tituloShort = 'Electricista';
            noblig = 206
            nelec = 16
            nelectpp = 22
            break;
        case 'naval':
            filename = 'data/naval-1986.csv';
            plan = 'Plan 1986 v2016';
            titulo = 'Ingeniería Naval y Mecánica';
            tituloShort = 'Naval';
            noblig = 226
            nelec = 20
            nelectpp = 38
            break;
        case 'mecanica':
            filename = 'data/mecanica-1986.csv';
            plan = 'Plan 1986 v2016';
            titulo = 'Ingeniería Mecánica';
            tituloShort = 'Mecánica';
            noblig = 218
            nelec = 24
            nelectpp = 28
            break;
        case 'petroleo':
            filename = 'data/petroleo-2015.csv';
            plan = 'Plan 2015 v2016';
            titulo = 'Ingeniería en Petróleo';
            tituloShort = 'Petróleo';
            noblig = 216
            nelec = 12
            nelectpp = 16
            break;        
        case 'agrimensura':
            filename = 'data/agrimensura-2006.csv';
            plan = 'Plan 2006 v2016';
            titulo = 'Ingeniería en Argimensura';
            tituloShort = 'Agrimensura';
            noblig = 178
            nelec = 12
            nelectpp = 18
            break;        
        case 'industrial':
            filename = 'data/industrial-2011.csv';
            plan = 'Plan 2011 v2019';
            titulo = 'Ingeniería Industrial';
            tituloShort = 'Industrial';
            noblig = 196
            nelec = 32
            break;        
    }

    $("#carrera-actual-long").text(titulo + ' | ' + plan);
    $("#carrera-actual-short").text(tituloShort);
    $("#" + carrera).addClass('active');

    $.ajax({
        url: filename,
        dataType: 'text',
        success: function (data) {
            new FiubaMap(data, carrera, noblig, nelec, nelectpp)
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
