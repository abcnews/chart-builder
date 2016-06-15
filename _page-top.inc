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


			.graphic-types input {
				margin: 0;
				padding: 0;
				-webkit-appearance: none;
				-moz-appearance: none;
				appearance: none;
			}
			.graphic-types input:active + .thumbnail {
				border: 3px solid #ddd;
			}
			.graphic-types input:checked + .thumbnail {
				border: 3px solid #999;
			}
			.graphic-types input:checked ~ label {
				font-weight: bold;
			}
			.graphic-types .thumbnail {
				margin: 0 5px 0 0;
				cursor: pointer;
				background-size: contain;
				background-repeat: no-repeat;
				display: inline-block;
				width: 100px;
				height: 100px;
			}
			.graphic-types .thumbnail:hover{
				border: 3px solid #ddd;
			}
			.graphic-types label {
				vertical-align: middle;
				font-weight: normal;
			}


		</style>
		<link rel="shortcut icon" href="favicon.ico" />
	</head>
	<body>
		<div class="container">
