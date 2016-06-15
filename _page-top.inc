<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Chart Builder - ABC News</title>
		<!-- Loading Bootstrap assets locally because of unpredictable ABC network behaviour -->
		<link rel="stylesheet" href="bootstrap/3.3.6/css/bootstrap.min.css">
		<link rel="stylesheet" href="bootstrap/3.3.6/css/bootstrap-theme.min.css">
		<style media="screen">
			table table tr th {
				padding-right: 5px;
				text-align: right;
				font-weight: normal;
			}
			table table th,
			table table td {
				padding-top: 5px;
			}
			table table tr:first-child th,
			table table tr:first-child td {
				border-bottom: 1px solid #ddd;
				padding-top: 0;
				padding-bottom: 5px;
			}


			table.graphic-types input {
				position: absolute;
				z-index: 999;
			}
			table.graphic-types input:active +.thumbnail {
				opacity: 0.9;
			}
			table.graphic-types input:checked +.thumbnail {
				filter: none;
			}
			table.graphic-types .thumbnail {
				margin: 0 5px 0 0;
				cursor: pointer;
				background-size: contain;
				background-repeat: no-repeat;
				display: inline-block;
				width: 100px;
				height: 100px;
				transition: all 100ms ease-in;
				filter: grayscale(.7) opacity(.7);
			}
			table.graphic-types .thumbnail:hover{
				filter: grayscale(.5) opacity(.9);
			}
			table.graphic-types label {
				vertical-align: top;
			}


		</style>
		<link rel="shortcut icon" href="favicon.ico" />
	</head>
	<body>
		<div class="container">
