function Carrera(id, titulo, tituloShort, plan, filename, orientaciones) {
    this.id = id;
    $("#carrera-actual-long").text(titulo + ' | ' + plan);
    $("#carrera-actual-short").text(tituloShort);
    $("#carreras .active").removeClass('active');
    $("#"+id).addClass('active');
    $("#orientaciones a").remove();
    if (orientaciones) $("#orientaciones-hidden").show();
    else $("#orientaciones-hidden").hide();
}