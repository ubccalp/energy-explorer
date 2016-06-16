//Main js file
$(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    if(scroll > 21) {
        $('.navbar').addClass("navbar-small");
    } else {
         $('.navbar').removeClass("navbar-small");
    }
});