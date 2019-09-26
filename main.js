$('.carrera').on('click', function(){
    update($(this).attr('id'))
})

function update(carrera, materiasFromLoad){
    $('.dropdown-content').hide();
    $("#grafo").text("");
    $("#grafo").append("<div class='loader'></div>");
    let filename, titulo, tituloShort, orientaciones, plan;
    switch(carrera){
        case 'informatica':
            orientaciones = true;
            filename = 'data/informatica-1986.csv';
            titulo = 'Ingeniería en Informática';
            tituloShort = 'Informática';
            plan = 'Plan 1986 v2016';
            break;
        case 'sistemas':
            orientaciones = false;
            filename = 'data/sistemas-1986.csv';
            titulo = 'Licenciatura en Análisis de Sistemas';
            tituloShort = 'Sistemas';
            plan = 'Plan 1986 v2016';
            break;
        case 'electronica':
            orientaciones = true;
            filename = 'data/electronica-2009.csv';
            titulo = 'Ingeniería Electrónica';
            tituloShort = 'Electrónica';
            plan = 'Plan 2009 v2019';
            break;
        case 'quimica':
            orientaciones = false;
            filename = 'data/quimica-1986.csv';
            titulo = 'Ingeniería Química';
            tituloShort = 'Química';
            plan = 'Plan 1986 v2016';
            break;
        case 'civil':
            orientaciones = false;
            filename = 'data/civil-2009.csv';
            titulo = 'Ingeniería Civil';
            tituloShort = 'Civil';
            plan = 'Plan 2009 v2016';
            break;
        case 'alimentos':
            orientaciones = false;
            filename = 'data/alimentos-2000.csv';
            titulo = 'Ingeniería de Alimentos';
            tituloShort = 'Alimentos';
            plan = 'Plan 2000 v2016';
            break;
        case 'electricista':
            orientaciones = false;
            filename = 'data/electricista-2009.csv';
            titulo = 'Ingeniería Electricista';
            tituloShort = 'Electricista';
            plan = 'Plan 2009 v2016';
            break;
        case 'naval':
            orientaciones = false;
            filename = 'data/naval-1986.csv';
            titulo = 'Ingeniería Naval y Mecánica';
            tituloShort = 'Naval';
            plan = 'Plan 1986 v2016';
            break;
        case 'mecanica':
            orientaciones = true;
            filename = 'data/mecanica-1986.csv';
            titulo = 'Ingeniería Mecánica';
            tituloShort = 'Mecánica';
            plan = 'Plan 1986 v2016';
            break;
        case 'petroleo':
            orientaciones = false;
            filename = 'data/petroleo-2015.csv';
            titulo = 'Ingeniería en Petróleo';
            tituloShort = 'Petróleo';
            plan = 'Plan 2015 v2016';
            break;
        case 'agrimensura':
            orientaciones = false;
            filename = 'data/agrimensura-2006.csv';
            titulo = 'Ingeniería en Argimensura';
            tituloShort = 'Agrimensura';
            plan = 'Plan 2006 v2016';
            break;
        case 'industrial':
            orientaciones = false;
            filename = 'data/industrial-2011.csv';
            titulo = 'Ingeniería Industrial';
            tituloShort = 'Industrial';
            plan = 'Plan 2011 v2019';
            break
    }

    CARRERA_ACTUAL = carrera;
    $("#carrera-actual-long").text(titulo + ' | ' + plan);
    $("#carrera-actual-short").text(tituloShort);
    $("#carreras .active").removeClass('active');
    $("#"+CARRERA_ACTUAL).addClass('active');
    fiubamap(filename, materiasFromLoad);
    mostrarOrientaciones(orientaciones)
}

function mostrarOrientaciones(show){
    $("#orientaciones a").remove();
    if (show) $("#orientaciones-hidden").show();
    else $("#orientaciones-hidden").hide();
}

$(document).ready(function(){
    $(".dropdown").on("mouseover", function () {
        $(this).children('.dropdown-content').show()
    });

    $(".dropdown").on("mouseout", function () {
        $(this).children('.dropdown-content').hide()
    });
})

