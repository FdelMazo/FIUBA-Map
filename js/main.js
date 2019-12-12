function main(carrera) {
    $('.dropdown-content').hide();
    $("#grafo").html("<div class='loader'></div>");
    let filename, titulo, tituloShort, orientaciones, plan, help;
    switch (carrera) {
        case 'informatica':
            orientaciones = true;
            filename = 'data/informatica-1986.csv';
            plan = 'Plan 1986 v2016';
            titulo = 'Ingeniería en Informática';
            tituloShort = 'Informática';
            help = `<li>156 créditos de materias obligatorias</li>
                    <li>34 créditos de una orientación</li>
                    <li>Tesis ó Trabajo Profesional</li>
                    <li>34 créditos de electivas (Tésis) ó 46 créditos de electivas (TPP)</li>`
            break;
        case 'sistemas':
            orientaciones = false;
            filename = 'data/sistemas-1986.csv';
            plan = 'Plan 1986 v2016';
            titulo = 'Licenciatura en Análisis de Sistemas';
            tituloShort = 'Sistemas';
            help = `<li>148 créditos de materias obligatorias</li>
                    <li>28 créditos de electivas</li>
                    <li>Inglés</li>`
            break;
        case 'electronica':
            orientaciones = true;
            filename = 'data/electronica-2009.csv';
            plan = 'Plan 2009 v2019';
            titulo = 'Ingeniería Electrónica';
            tituloShort = 'Electrónica';
            help = `<li>166 créditos de materias obligatorias</li>
                    <li>56 créditos de electivas</li>
                    <li>Inglés</li>
                    <li>Tesis ó Trabajo Profesional</li>
                    <li>Práctica Profesional</li>`
            break;
        case 'quimica':
            orientaciones = false;
            filename = 'data/quimica-1986.csv';
            plan = 'Plan 1986 v2016';
            titulo = 'Ingeniería Química';
            tituloShort = 'Química';
            help = `<li>216 créditos de materias obligatorias</li>
                    <li>Tesis ó Trabajo Profesional</li>
                    <li>18 créditos de electivas (Tésis) ó 24 créditos de electivas (TPP)</li>`
            break;
        case 'civil':
            orientaciones = false;
            filename = 'data/civil-2009.csv';
            plan = 'Plan 2009 v2016';
            titulo = 'Ingeniería Civil';
            tituloShort = 'Civil';
            help = `<li>210 créditos de materias obligatorias</li>
                    <li>34 créditos de electivas</li>
                    <li>Inglés</li>
                    <li>Trabajo Profesional</li>
                    <li>Práctica Profesional</li>`
            break;
        case 'alimentos':
            orientaciones = false;
            filename = 'data/alimentos-2000.csv';
            plan = 'Plan 2000 v2016';
            titulo = 'Ingeniería de Alimentos';
            tituloShort = 'Alimentos';
            help = `<li>210 créditos de materias obligatorias</li>
                    <li>34 créditos de electivas</li>
                    <li>Inglés</li>
                    <li>Trabajo Profesional</li>
                    <li>Práctica Profesional</li>`
            break;
        case 'electricista':
            orientaciones = false;
            filename = 'data/electricista-2009.csv';
            plan = 'Plan 2009 v2016';
            titulo = 'Ingeniería Electricista';
            tituloShort = 'Electricista';
            help = `<li>206 créditos de materias obligatorias</li>
                    <li>Inglés</li>
                    <li>Tesis ó Trabajo Profesional</li>
                    <li>Práctica Profesional</li>
                    <li>16 créditos de electivas (Tésis) ó 22 créditos de electivas (TPP)</li>`
            break;
        case 'naval':
            orientaciones = false;
            filename = 'data/naval-1986.csv';
            plan = 'Plan 1986 v2016';
            titulo = 'Ingeniería Naval y Mecánica';
            tituloShort = 'Naval';
            help = `<li>226 créditos de materias obligatorias</li>
                    <li>Tesis ó Trabajo Profesional</li>
                    <li>20 créditos de electivas (Tésis) ó 38 créditos de electivas (TPP)</li>`
            break;
        case 'mecanica':
            orientaciones = true;
            filename = 'data/mecanica-1986.csv';
            plan = 'Plan 1986 v2016';
            titulo = 'Ingeniería Mecánica';
            tituloShort = 'Mecánica';
            help = `<li>190 créditos de materias obligatorias</li>
                    <li>28 créditos de una orientación</li>
                    <li>Tesis ó Trabajo Profesional</li>
                    <li>24 créditos de electivas (Tésis) ó 28 créditos de electivas (TPP)</li>`
            break;
        case 'petroleo':
            orientaciones = false;
            filename = 'data/petroleo-2015.csv';
            plan = 'Plan 2015 v2016';
            titulo = 'Ingeniería en Petróleo';
            tituloShort = 'Petróleo';
            help = `<li>216 créditos de materias obligatorias</li>
                    <li>Inglés</li>
                    <li>Tesis ó Trabajo Profesional</li>
                    <li>Práctica Profesional</li>
                    <li>12 créditos de electivas (Tésis) ó 16 créditos de electivas (TPP)</li>`
            break;        
        case 'agrimensura':
            orientaciones = false;
            filename = 'data/agrimensura-2006.csv';
            plan = 'Plan 2006 v2016';
            titulo = 'Ingeniería en Argimensura';
            tituloShort = 'Agrimensura';
            help = `<li>178 créditos de materias obligatorias</li>
                    <li>Tesis ó Trabajo Profesional</li>
                    <li>Práctica Profesional</li>
                    <li>12 créditos de electivas (Tésis) ó 18 créditos de electivas (TPP)</li>`
            break;        
        case 'industrial':
            orientaciones = false;
            filename = 'data/industrial-2011.csv';
            plan = 'Plan 2011 v2019';
            titulo = 'Ingeniería Industrial';
            tituloShort = 'Industrial';
            help = `<li>196 créditos de materias obligatorias</li>
                    <li>32 créditos de electivas</li>
                    <li>4 créditos de materias humanísticas de otras facultades de la UBA</li>
                    <li>Ingles</li>
                    <li>Tesis ó Trabajo Profesional</li>
                    <li>Práctica Profesional</li>`
            break;        
    }

    $("#carrera-actual-long").text(titulo + ' | ' + plan);
    $("#carrera-actual-short").text(tituloShort);
    $("#carreras .active").removeClass('active');
    $("#" + carrera).addClass('active');
    $("#orientaciones a").remove();
    $('#creditos-var').text(0);
    $('#help-list').html(help);
    $('#promedio-var').text('-');
    $("[id='toggle-Materias Electivas']").css("background-color", "");
    if (orientaciones) $("#orientaciones-hidden").show();
    else $("#orientaciones-hidden").hide();

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