$(document).ready(function () {
    $("#fullscreen-mode").on("click", function () {
        $("#header").remove()
        $("#footer").remove()
    })
    $("#dark-mode").on("click", function () {
        if ($('html').hasClass('dark')) {
            $('html').removeClass('dark')
            $("#dark-mode i").removeClass('fa-sun')
            $("#dark-mode i").addClass('fa-moon')
        }
        else {
            $('html').addClass('dark')
            $("#dark-mode i").removeClass('fa-moon')
            $("#dark-mode i").addClass('fa-sun')
        }
    })
})
