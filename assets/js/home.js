// JS specific to index.html page

/**
Initialize plugins for image mapping
http://davidlynch.org/projects/maphilight/docs/
https://github.com/stowball/jQuery-rwdImageMaps
**/ 
$(document).ready(function() {
    $('#bg-image').rwdImageMaps();
    $('#bg-image').maphilight();
});