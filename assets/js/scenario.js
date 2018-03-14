$(document).ready(function () {
	/*
	* Plugin intialization
	*/

	$('#scenarios').css({ 'background': '#3b97d3' });

	$('#pagepiling').pagepiling({
		normalScrollElements:true,
		menu: '#menu',
		anchors: ['page1', 'page2', 'page3', 'page4', 'page5'],
		sectionsColor: ['white', 'white', 'white', 'white', 'white'],
		navigation: {
			'position': 'right',
			'tooltips': ['Page 1', 'Page 2', 'Page 3', 'Page 4', 'Page 5']
		},		
		afterRender: function () {
			$('#pp-nav').addClass('custom');
		},
		afterLoad: function (anchorLink, index) {
			if (index > 1) {
				$('#pp-nav').removeClass('custom');
			} else {
				$('#pp-nav').addClass('custom');
			}
		}
	});

});