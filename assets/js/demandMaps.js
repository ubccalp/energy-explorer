// scroll function
$(function () {
	$('a[href*=\\#sect]').on('click', function (e) {
		e.preventDefault();
		$('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top }, 500, 'linear');
	});
});

// date function
var today = new Date();

var year = today.getFullYear;

// map functions
var map;

function init() {
	// set map options
	var options = {
		zoom: 13,
		center: [49.256, -123.1],
		zoomControl: false,
		scrollWheelZoom: true,
		cartodb_logo: false,
		minZoom: 4,
		maxZoom: 18,
		maxBounds: [[53, -110], [44, -150]],
		attributionControl: false,
		// 		infowindow: true,
	};

	// create the map object
	map = new L.Map('map', options);

	// sublayer container
	var sublayers = [];

	// create a layer with 1 sublayer
	cartodb.createLayer(map, {
		user_name: 'jsalter',
		type: 'cartodb',
		sublayers: [
			//Baselayer
			{
				type: "http",
				urlTemplate: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
				subdomains: ["a", "b", "c"]
			},

			//EUI
			{
				sql: "SELECT * FROM combiparcels",
				cartocss: '#combiparcels {\
						  [eui=null] {polygon-opacity: 0.0;polygon-fill: #fff;}\
						  [eui=0] {polygon-opacity: 0.0;polygon-fill: #fff;}\
						  [eui>1] {polygon-fill: #FEC428;}\
						  [eui>150] {polygon-fill: #F89541;}\
						  [eui>175] {polygon-fill: #E66B5C;}\
						  [eui>200] {polygon-fill: #CB4778;}\
						  [eui>225] {polygon-fill: #A92096;}\
						  [eui>250] {polygon-fill: #7E00A8;}\
						  [eui>275] {polygon-fill: #4C00A1;}\
						  [eui>300] {polygon-fill: #0D0287;}\
						  polygon-opacity: 1.0;\
						  polygon-gamma: 0.4;\
						  line-color: #FFF;\
						  line-width: 0;\
						  line-opacity: 1.0;\
						  line-comp-op: soft-light;\
						  [zoom>14]{line-width: 1.5;}\
						}',
			},

			//EUI "Real"
			{
				sql: "SELECT * FROM combiparcels",
				cartocss: "#combiparcels {\
						  [eui=null] {polygon-opacity: 0.0;polygon-fill: #fff;}\
						  [eui=0] {polygon-opacity: 0.0;polygon-fill: #fff;}\
						  [eui>1] {polygon-fill: #FEC428;line-color: #FEC428;}\
						  [eui>150] {polygon-fill: #F89541;line-color:#F89541;}\
						  [eui>175] {polygon-fill: #E66B5C;line-color:#E66B5C;}\
						  [eui>200] {polygon-fill: #CB4778;line-color:#CB4778;}\
						  [eui>225] {polygon-fill: #A92096;line-color:#A92096;}\
						  [eui>250] {polygon-fill: #7E00A8;line-color:#7E00A8;}\
						  [eui>275] {polygon-fill: #4C00A1;line-color:#4C00A1;}\
						  [eui>300] {polygon-fill: #0D0287;line-color:#0D0287;}\
						  polygon-opacity: 0.25;\
						  polygon-gamma: 1.0;\
						  line-width: 0.0;\
						  line-opacity: 1.0;\
						  line-comp-op: soft-light;\
						  [zoom>14]{line-width: 0.0;}\
						  [real=true]{\
						  		polygon-opacity:1.0;\
						  		}\
						}",
			},

			//GHG
			{
				sql: "SELECT * FROM combiparcels",
				cartocss: '#combiparcels {\
						  [ghg=null] {polygon-opacity: 0.0;polygon-fill: #fff;}\
						  [ghg=0] {polygon-opacity: 0.0;polygon-fill: #fff;}\
						  [ghg>=1] {polygon-fill: #FFFF00;}\
						  [ghg>5] {polygon-fill: #9EDB39;}\
						  [ghg>10] {polygon-fill: #4AC26D;}\
						  [ghg>50] {polygon-fill: #1FA288;}\
						  [ghg>100] {polygon-fill: #277F8E;}\
						  [ghg>200] {polygon-fill: #365C8D;}\
						  [ghg>300] {polygon-fill: #45317F;}\
						  [ghg>600] {polygon-fill: #440054;}\
  						  polygon-opacity: 1.0;\
						  polygon-gamma: 0.4;\
						  line-color: #FFF;\
						  line-width: 0.0;\
						  line-opacity: 0.5;\
						  line-comp-op: soft-light;\
						  [zoom>14]{line-width: 1.5;}\
						}'
			},

			//GHGi
			{
				sql: "SELECT * FROM combiparcels",
				cartocss: '#combiparcels {\
    						[ghgi=null] {polygon-opacity: 0.0;polygon-fill: #fff;}\
					  		[ghgi>=0] {polygon-fill: #E1C7EC;}\
					  		[ghgi>20] {polygon-fill: #B3B4D9;}\
					  		[ghgi>25] {polygon-fill: #8FAED7;}\
					  		[ghgi>30] {polygon-fill: #67A9CF;}\
					  		[ghgi>35] {polygon-fill: #3690C0;}\
					  		[ghgi>40] {polygon-fill: #02818A;}\
					  		[ghgi>45] {polygon-fill: #016C59;}\
					  		[ghgi>50] {polygon-fill: #014636;}\
  							polygon-opacity: 1.0;\
						  polygon-gamma: 0.4;\
						  line-color: #FFF;\
						  line-width: 0.0;\
						  line-opacity: 0.5;\
						  line-comp-op: soft-light;\
						  [zoom>14]{line-width: 1.5;}\
						}'
			},

			//Labels
			{
				type: "http",
				urlTemplate: 'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
				subdomains: ["a", "b", "c"]
			},

			//Buildings 1
			{
				sql: "SELECT * FROM ubc_bld_euis_hts ORDER BY ST_YMax(the_geom) DESC",
				cartocss: "#ubc_bld_euis_hts{\
    						[zoom < 14]{\
						  			polygon-opacity: 0.0;\
						  			line-opacity:0.0;\
						  			}\
						  	[bldg_ht>0]{\
						  		[zoom = 14]{\
									polygon-fill: #E5E2CF;\
									polygon-opacity: 0.7;\
									line-opacity:0.7;\
									line-color: #B9B397;\
									}\
								[zoom >14]::under{\
									building-fill-opacity: 0.0;\
									}\
								[zoom >14]{\
						  			polygon-fill:transparent;\
						  			line-color: #B9B397;\
						  			line-opacity:0.0;\
						  			building-fill: #E5E2CF;\
						  			building-fill-opacity: 0.9;\
						  			building-height: [bldg_ht]*1.5;\
									}\
								}\
							}"
			},

			//Buildings 2
			{
				sql: "SELECT * FROM ubc_bld_euis_hts ORDER BY ST_YMax(the_geom) DESC",
				cartocss: "#ubc_bld_euis_hts{\
    						[zoom < 14]{\
						  			polygon-opacity: 0.0;\
						  			line-opacity:0.0;\
						  			}\
						  	[bldg_ht>0]{\
								[ttleui=null] {polygon-opacity: 0.0;polygon-fill: #fff;}\
								[ttleui=0] {polygon-opacity: 0.0;polygon-fill: #fff;}\
								[ttleui>1] {polygon-fill: #FEC428;}\
								[ttleui>150] {polygon-fill: #F89541;}\
								[ttleui>175] {polygon-fill: #E66B5C;}\
								[ttleui>200] {polygon-fill: #CB4778;}\
								[ttleui>225] {polygon-fill: #A92096;}\
								[ttleui>250] {polygon-fill: #7E00A8;}\
								[ttleui>275] {polygon-fill: #4C00A1;}\
								[ttleui>300] {polygon-fill: #0D0287;}\
								polygon-opacity: 1.0;\
								line-opacity:0.7;\
								line-color: #B9B397;\
								[zoom >14]::under{\
									building-fill-opacity: 0.0;\
									}\
								[zoom >14]{\
						  			polygon-fill:transparent;\
						  			line-color: #B9B397;\
						  			line-opacity:0.0;\
						  			[ttleui=null] {building-fill-opacity: 0.0}\
									[ttleui=0] {building-fill-opacity: 0.0}\
									[ttleui>1] {building-fill: #FEC428;}\
									[ttleui>150] {building-fill: #F89541;}\
									[ttleui>175] {building-fill: #E66B5C;}\
									[ttleui>200] {building-fill: #CB4778;}\
									[ttleui>225] {building-fill: #A92096;}\
									[ttleui>250] {building-fill: #7E00A8;}\
									[ttleui>275] {building-fill: #4C00A1;}\
									[ttleui>300] {building-fill: #0D0287;}\
						  			building-fill-opacity: 0.9;\
						  			building-height: [bldg_ht]*1.5;\
									}\
								}\
							}"
			},
		],
	})
		.addTo(map)
		.done(function (layer) {

			// eui 
			var layer1 = layer.getSubLayer(1);
			layer1.show();

			// eui real
			var layer2 = layer.getSubLayer(2);
			layer2.hide();

			// ghg
			var layer3 = layer.getSubLayer(3);
			layer3.hide();

			// ghgi
			var layer4 = layer.getSubLayer(4);
			layer4.hide();

			// buildings 1
			var layer6 = layer.getSubLayer(6);
			layer6.show();

			// buildings 2
			var layer7 = layer.getSubLayer(7);
			layer7.hide();

			layer1.setInteractivity(['address', 'pid', 'yr_built', 'eui', 'ghg', 'ghgi']);
			layer1.setInteraction(true);

			layer2.setInteractivity(['address', 'pid', 'yr_built', 'eui', 'ghg', 'ghgi']);
			layer2.setInteraction(true);

			layer3.setInteractivity(['address', 'pid', 'yr_built', 'eui', 'ghg', 'ghgi']);
			layer3.setInteraction(true);

			layer4.setInteractivity(['address', 'pid', 'yr_built', 'eui', 'ghg', 'ghgi']);
			layer4.setInteraction(true);

			sublayers.push(layer1, layer2, layer3, layer4, layer6, layer7);

			cartodb.vis.Vis.addInfowindow(map, layer, ['address', 'pid', 'yr_built', 'eui', 'ghg', 'ghgi'], {
				infowindowTemplate: $('#infowindow_template').html(),
				templateType: 'mustache'
			});

			// 		layer1.on('featureClick', function(event, latlng, pos, data, layerIndex) {
			//     		console.log("test event");
			//     		console.log(data);
			// 			});

		});

	// map-click to enable mouse-scroll
	map.on('click', function () {
		map.scrollWheelZoom.enable();
	});

	// Create the control and add it to the map;
	// L.control.layers(0).addTo(map);
	var control = L.control.zoom({ position: 'topleft' })
	control.addTo(map);

	// call getContainer routine
	var htmlObject = control.getContainer();

	// get parent node
	var a = document.getElementById('Lcontrols');

	// append node to new parent
	function setParent(el, newParent) {
		newParent.appendChild(el);
	}

	// call setParent
	setParent(htmlObject, a);

	// button sublayer interaction
	$("#eui").click(function () {
		$(this).addClass("selectedButton");
		$("#ghgi").removeClass("selectedButton");
		$("#ghg").removeClass("selectedButton");
		$("#real").removeClass("selectedButton");
		sublayers[0].show();
		sublayers[1].hide();
		sublayers[2].hide();
		sublayers[3].hide();
		sublayers[4].show();
		sublayers[5].hide();
		$("#section03").css("background", '#E66B5C');
		$(".maptitle").html('<font size="5">Energy Use Intensity: Energy measurement by energy use and relative building size (kWh/m<sup>2</sup>). <a href="./map-methods">Map methodology<a></a></font>');
		document.getElementById("leg").src = "../img/legEUI.svg";
	});

	$("#ghgi").click(function () {
		$(this).addClass("selectedButton");
		$("#eui").removeClass("selectedButton");
		$("#ghg").removeClass("selectedButton");
		$("#real").removeClass("selectedButton");
		sublayers[0].hide();
		sublayers[1].hide();
		sublayers[2].hide();
		sublayers[3].show();
		sublayers[4].show();
		sublayers[5].hide();
		$("#section03").css("background", '#3690C0');
		$(".maptitle").html('<font size="5">Greenhouse Gas Intensity: GHG measurement by energy use and relative building size (kg CO2e/m). <a href="./map-methods">Map methodology<a></a></font>');
		document.getElementById("leg").src = "../img/legGHGi.svg";
	});

	$("#ghg").click(function () {
		$(this).addClass("selectedButton");
		$("#eui").removeClass("selectedButton");
		$("#ghgi").removeClass("selectedButton");
		$("#real").removeClass("selectedButton");
		sublayers[0].hide();
		sublayers[1].hide();
		sublayers[2].show();
		sublayers[3].hide();
		sublayers[4].show();
		sublayers[5].hide();
		$("#section03").css("background", '#4AC26D');
		$(".maptitle").html('<font size="5">Greenhouse Gas Emissions: GHG measurement of tonnes of emissions emitted by energy use (T CO2<sub>e</sub>). <a href="./map-methods">Map methodology<a></a></font>');
		document.getElementById("leg").src = "../img/legGHG.svg";
	});

	$("#real").click(function () {
		$(this).addClass("selectedButton");
		$("#eui").removeClass("selectedButton");
		$("#ghgi").removeClass("selectedButton");
		$("#ghg").removeClass("selectedButton");
		sublayers[0].hide();
		sublayers[1].show();
		sublayers[2].hide();
		sublayers[3].hide();
		sublayers[4].hide();
		sublayers[5].show();
		$("#section03").css("background", '#E66B5C');
		$(".maptitle").html('<font size="5"><i>Real Values: Have citizens potentially input data to capture real energy use intensity on a map (coming soon)</i>. <a href="./map-methods">Map methodology<a></a></font>');
		document.getElementById("leg").src = "../img/legEUI.svg";
	});

}
