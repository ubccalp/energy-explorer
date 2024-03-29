<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>pagePiling.js plugin - Backgrounds</title>
	<meta name="author" content="Alvaro Trigo Lopez" />
	<meta name="description" content="pagePiling.js plugin by Alvaro Trigo." />
	<meta name="keywords"  content="pile,piling,piling.js,stack,pages,scrolling,stacking,touch,fullpile,scroll,plugin,jquery" />
	<meta name="Resource-type" content="Document" />

	<link rel="stylesheet" type="text/css" href="../jquery.pagepiling.css" />
	<link rel="stylesheet" type="text/css" href="examples.css" />

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>

	<script type="text/javascript" src="../jquery.pagepiling.min.js"></script>
	<script type="text/javascript" src="examples.js"></script>
	<script type="text/javascript">
		var deleteLog = false;

		$(document).ready(function() {
	    	$('#pagepiling').pagepiling({
	    		menu: '#menu',
	    		anchors: ['page1', 'page2', 'page3'],
	    		navigation: {
		            'textColor': '#f2f2f2',
		            'bulletsColor': '#ccc',
		            'position': 'right',
		            'tooltips': ['Page 1', 'Page 2', 'Page 3', 'Page 4']
		        }
			});
	    });
    </script>

    <style>
    /* Style for our header texts
	* --------------------------------------- */
	h1{
		font-size: 5em;
		font-family: arial,helvetica;
		color: #fff;
		margin:0;
		padding:0;
	}

	/* Centered texts in each section
	* --------------------------------------- */
	.section{
		text-align:center;
	}


	/* Backgrounds will cover all the section
	* --------------------------------------- */
	#section1,
	#section2,
	#section3{
		background-size: cover;
	}

	/* Defining each section background and styles
	* --------------------------------------- */
	#section1{
		background-image: url(https://raw.githubusercontent.com/alvarotrigo/pagePiling.js/master/examples/imgs/bg1.jpg);
	}
	#section2{
		background-image: url(https://raw.githubusercontent.com/alvarotrigo/pagePiling.js/master/examples/imgs/bg2.jpg);
		padding: 6% 0 0 0;
	}
	#section3{
		background-image: url(https://raw.githubusercontent.com/alvarotrigo/pagePiling.js/master/examples/imgs/bg3.jpg);
		padding: 6% 0 0 0;
	}
	#section3 h1{
		color: #000;
	}



	#section1 h1{
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
		top: 30px;
		color: #fff;
	}

	#section2 .intro{
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
		top: 30px;
	}
	#section2 h1,
	#section2 p{
		text-shadow: 1px 5px 20px #000;
	}

	#section3 h1,
	#section3 p{
		text-shadow: 1px 5px 20px #000;
		color: #fff;
	}

	#infoMenu li a{
		color: #fff;
	}
    </style>

</head>
<body>

	<?php include 'header.php'; ?>

	<ul id="menu">
		<li data-menuanchor="page1" class="active"><a href="#page1">Page 1</a></li>
		<li data-menuanchor="page2"><a href="#page2">Page 2</a></li>
		<li data-menuanchor="page3"><a href="#page3">Page 3</a></li>
	</ul>

	<div id="pagepiling">
	    <div class="section" id="section1">
	    	<h1>pagePiling.js</h1>
	    </div>
	    <div class="section" id="section2">
	    	<div class="intro">
	    		<h1>Backgrounds </h1>
	    		<p>Show it in full screen!</p>
	    	</div>
	    </div>
	    <div class="section" id="section3">
	    	<div class="intro">
	    		<h1>Just terrific!</h1>
	    		<p>Use the power of images</p>
	    	</div>
	    </div>
	</div>

	<?php include 'footer.php'; ?>

</body>
</html>
