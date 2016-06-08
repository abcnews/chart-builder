<!DOCTYPE html>
<html>
<head>
<title>Chart Builder - ABC</title>
<!-- Latest compiled and minified CSS -->
<!-- <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"> -->
<!-- Optional theme -->
<!-- <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css"> -->

<!-- Loading Bootstrap assets locally because of unpredictable ABC network behaviour -->
<link rel="stylesheet" href="bootstrap/3.3.6/css/bootstrap.min.css">
<link rel="stylesheet" href="bootstrap/3.3.6/css/bootstrap-theme.min.css">

<script src="http://www.abc.net.au/res/libraries/jquery/jquery-1.11.3.min.js"></script>
<script src="bootstrap/3.3.6/js/bootstrap.min.js"></script>

<link rel="shortcut icon" href="favicon.ico" />

<!-- Latest compiled and minified JavaScript -->
</head>

<?php
	$graphics = array(
		array(
			"id" => "line_chart",
			"image" => "line-chart",
			"description" => "Line chart",
		),
		array(
			"id" => "slopegraph",
			"image" => "slopegraph",
			"description" => "Slopegraph",
		),
		array(
			"id" => "bar_chart",
			"image" => "bar-chart",
			"description" => "Bar chart",
		),
		array(
			"id" => "grouped_bar_chart",
			"image" => "grouped-bar-chart",
			"description" => "Grouped bar chart",
		),
		array(
			"id" => "stacked_bar_chart",
			"image" => "stacked-bar-chart",
			"description" => "Stacked bar chart",
		),
		array(
			"id" => "column_chart",
			"image" => "column-chart",
			"description" => "Column chart",
		),
		array(
			"id" => "stacked_column_chart",
			"image" => "stacked-column-chart",
			"description" => "Stacked column chart",
		),
		array(
			"id" => "dot_chart",
			"image" => "dot-chart",
			"description" => "Dot chart",
		),
		array(
			"id" => "pie_chart",
			"image" => "pie-chart",
			"description" => "Pie chart",
		),
		array(
			"id" => "table",
			"image" => "table",
			"description" => "Responsive HTML table",
		),
	);
	$advancedGraphics = array(
		array(
			"id" => "block_histogram",
			"image" => "block-histogram",
			"description" => "Block histogram",
		),
		array(
			"id" => "locator_map",
			"image" => "locator-map",
			"description" => "Locator map",
		),
		array(
			"id" => "state_grid_map",
			"image" => "state-grid-map",
			"description" => "USA state grid map",
		),
		array(
			"id" => "graphic",
			"image" => "graphic",
			"description" => "Very basic new graphic",
		),
	);

	$isAdvanced = (strpos($_SERVER['REQUEST_URI'],'?mode=advanced') !== false);

?>

<body>
<div class="container">
	<div class="page-header">
		<div class="btn-group btn-link btn-group-sm pull-right">
			<a class="btn" href="https://github.com/abcnews/dailygraphics/blob/master/README.md">Documentation</a>
			<a class="btn" href="https://github.com/abcnews/dailygraphics/issues">Report a bug</a>
			<?php if ($isAdvanced) { ?>
					<a class="btn" href="?mode=basic">Basic mode</a>
			<?php } else { ?>
					<a class="btn" href="?mode=advanced">Advanced mode</a>
			<?php } ?>
		</div>
		<h1>Chart Builder</h1>
	</div>


<div class="row">

<?php if ($isAdvanced) { ?>
	<div class="col-md-9">
<?php } else { ?>
	<div class="col-md-7">
<?php } ?>

<div class="panel panel-primary">
<div class="panel-heading">
	<h3 class="panel-title">Existing graphics</h3>
</div>
<div class="panel-body">
<form>
	<div class="input-group">
		<span class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>
		<input id="search" type="text" class="form-control" value="" placeholder="Filter by graphic name" aria-label="Search">
	</div>
</form>

<table class="table table-hover">
<tbody id="results">
<?php
function cmp ($a, $b) {
	return $b['mtime'] - $a['mtime'];
}

if ($handle = opendir('graphics')) {
	$files = array();
	while (false !== ($entry = readdir($handle))) {
		if ($entry != "." && $entry != "..") {
			$f = fopen('graphics/' . $entry . '/build', "r");
			if ($f) {
				$dat = fstat($f);
				fclose($f);
				$mtime = $dat['atime'];
				$mtimeStr = date(DATE_ATOM, $dat['atime']);
			} else {
				$mtime = 0;
				$mtimeStr = "Not deployed";
			}
			$files[] = array(
				"name" => $entry,
				"mtime" => $mtime,
				"mtimeStr" => $mtimeStr
			);
		}
	}

	closedir($handle);
	usort($files, "cmp");
	foreach ($files as $entry) {
		echo "<tr><td>";
		echo "<a href='http://www.abc.net.au/dat/news/interactives/graphics/{$entry['name']}/' title='{$entry['mtimeStr']}'>{$entry['name']}</a>";
		echo "</td><td align='right'>";
		echo "<form action='server.php?action=deploy' method='post'>";
		echo "<input type='hidden' name='slug' value='{$entry['name']}' />";
		echo "<button class='btn btn-xs btn-success' type='submit' title='Update graphic to use latest content from its Google Sheet.'>Refresh content</button> ";
		echo "</form>";
		if ($isAdvanced) {
			/*
			echo "<form style='display:inline' action='server.php?action=deploy_assets' method='post'>";
			echo "<input type='hidden' name='slug' value='{$entry['name']}' />";
			echo "<button class='btn btn-xs btn-success' type='submit'>Deploy Assets</button> ";
			echo "</form>";
			*/
			echo "</td><td align='right'>";
			echo "<form action='server.php?action=deploy_template' method='post'>";
			echo "<input type='hidden' name='slug' value='{$entry['name']}' />";
			echo "<input type='hidden' name='type' value='' />";
			echo "<div class='btn-group'>";
			echo "<button type='button' class='btn btn-xs btn-success dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' title='Update graphic to use the latest templates from the chosen graphic type.'>";
			echo "Rebuild from template <span class='caret'></span>";
			echo "</button>";
			echo "<ul class='dropdown-menu'>";
			foreach ($graphics as $graphic) {
				echo "<li><a href='#' data-type='{$graphic['id']}'>{$graphic['description']}</a></li>";
			}
			echo "<li role='separator' class='divider'></li>";
			foreach ($advancedGraphics as $graphic) {
				echo "<li><a href='#' data-type='{$graphic['id']}'>{$graphic['description']}</a></li>";
			}
			echo "</ul>";
			echo "</div>";
			echo "</form>";
			echo "</td><td align='right'>";
			echo "<form action='server.php?action=remove' method='post'>";
			echo "<input type='hidden' name='slug' value='{$entry['name']}' />";
			echo "<button class='btn btn-xs btn-danger' type='submit' title='Remove graphic from Chart Builder interface. Chart is still live but can no longer be managed.'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Remove</button>";
			echo "</form>";
		}
		echo "</td></tr>";
	}
}
?>
</tbody>
</table>
</div>
</div>
</div>

<?php if ($isAdvanced) { ?>
	<div class="col-md-3">
<?php } else { ?>
	<div class="col-md-5">
<?php } ?>

<div class="panel panel-success">
<div class="panel-heading">
	<h3 class="panel-title">Create new graphic</h3>
</div>
<div class="panel-body">

<?php if ($isAdvanced) { ?>

<form action="server.php?action=create" method="post">
	<input type='hidden' name='type' value='' />
	<div class="input-group">
		<input type="text" class="form-control" name="slug" placeholder="Graphic name">
		<div class="input-group-btn">
			<button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Create <span class="caret"></span></button>
			<ul class='dropdown-menu dropdown-menu-right'>
			<?php
				foreach ($graphics as $graphic) {
					echo "<li><a href='#' data-type='{$graphic['id']}'>{$graphic['description']}</a></li>";
				}
				echo "<li role='separator' class='divider'></li>";
				foreach ($advancedGraphics as $graphic) {
					echo "<li><a href='#' data-type='{$graphic['id']}'>{$graphic['description']}</a></li>";
				}
			?>
			</ul>
		</div>
	</div><!-- /input-group -->
</form>

<?php } else { ?>

<form action="server.php?action=create" method="post">
<table class="table"><tbody>

<?php
	foreach ($graphics as $graphic) {
		echo "<tr><td>";
		echo "<label><input type='radio' name='type' value='{$graphic['id']}' id='input-{$graphic['id']}' /> {$graphic['description']}</label>";
		echo "</td><td align='right'>";
		echo "<label for='input-{$graphic['id']}'>";
		echo "<img class='img-thumbnail' src='https://raw.githubusercontent.com/abcnews/dailygraphics/master/graphic_templates/_thumbs/{$graphic['image']}.png' alt='' width='100' height='100'>";
		echo "</label>";
		echo "</td></tr>";
	}
?>

</tbody></table>

<div class="input-group">
	<input type="text" class="form-control" name="slug" placeholder="Graphic name">
	<span class="input-group-btn">
		<button class="btn btn-success" type="submit">Create</button>
	</span>
</div><!-- /input-group -->

</form>

<?php } ?>

</div>
</div>

</div>
</div>
</div>

<script>
function search(input) {
	$("#results tr").each(function () {
		var $tr = $(this);
		var text = $tr.find("a").text();
		if (text.indexOf(input) === -1) {
			$tr.hide();
		} else {
			$tr.show();
		}
	});
}

$(document).ready(function () {

	$("#search").on("input", function () {
		search($(this).val());
	});

	$('.dropdown-menu a').click(function (event) {
		event.preventDefault();
		$(this).closest('form')
			.find('input[name=type]')
				.val($(this).data('type'))
				.end()
			.submit();
	});

});
</script>
</body>
</html>
