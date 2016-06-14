<?php

require '_page-top.inc';

$graphics = json_decode(file_get_contents('graphic-templates.json'));
$isAdvancedMode = (strpos($_SERVER['REQUEST_URI'],'?mode=advanced') !== false);

?>

	<div class="page-header">
		<div class="btn-group btn-link btn-group-sm pull-right">
			<a class="btn" href="https://github.com/abcnews/dailygraphics/blob/master/README.md">Documentation</a>
			<a class="btn" href="https://github.com/abcnews/dailygraphics/issues">Report a bug</a>
			<?php if ($isAdvancedMode) { ?>
					<a class="btn" href="?mode=basic">Basic mode</a>
			<?php } else { ?>
					<a class="btn" href="?mode=advanced">Advanced mode</a>
			<?php } ?>
		</div>
		<h1>Chart Builder</h1>
	</div>

<div class="row">

<?php if ($isAdvancedMode) { ?>
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
		if ($isAdvancedMode) {
			echo "</td><td align='right'>";
			echo "<form action='server.php?action=deploy_template' method='post'>";
			echo "<input type='hidden' name='slug' value='{$entry->name}' />";
			echo "<input type='hidden' name='type' value='' />";
			echo "<div class='btn-group'>";
			echo "<button type='button' class='btn btn-xs btn-success dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' title='Update graphic to use the latest templates from the chosen graphic type.'>";
			echo "Rebuild from template <span class='caret'></span>";
			echo "</button>";
			echo "<ul class='dropdown-menu'>";
			foreach ($graphics->base as $graphic) {
				echo "<li><a href='#' data-type='{$graphic->id}'>{$graphic->description}</a></li>";
			}
			echo "<li role='separator' class='divider'></li>";
			foreach ($graphics->advanced as $graphic) {
				echo "<li><a href='#' data-type='{$graphic->id}'>{$graphic->description}</a></li>";
			}
			echo "</ul>";
			echo "</div>";
			echo "</form>";
			echo "</td><td align='right'>";
			echo "<form action='server.php?action=remove' method='post'>";
			echo "<input type='hidden' name='slug' value='{$entry->name}' />";
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

<?php if ($isAdvancedMode) { ?>
	<div class="col-md-3">
<?php } else { ?>
	<div class="col-md-5">
<?php } ?>

<div class="panel panel-success">
<div class="panel-heading">
	<h3 class="panel-title">Create new graphic</h3>
</div>
<div class="panel-body">

<?php if ($isAdvancedMode) { ?>

<form action="server.php?action=create" method="post">
	<input type='hidden' name='type' value='' />
	<div class="input-group">
		<input type="text" class="form-control" name="slug" placeholder="Graphic name">
		<div class="input-group-btn">
			<button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Create <span class="caret"></span></button>
			<ul class='dropdown-menu dropdown-menu-right'>
				<?php
					foreach ($graphics->base as $graphic) {
						echo "<li><a href='#' data-type='{$graphic->id}'>{$graphic->description}</a></li>";
					}
				?>
				<li role='separator' class='divider'></li>
				<?php
					foreach ($graphics->advanced as $graphic) {
						echo "<li><a href='#' data-type='{$graphic->id}'>{$graphic->description}</a></li>";
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
	foreach ($graphics->base as $graphic) {
		echo "<tr><td>";
		echo "<label><input type='radio' name='type' value='{$graphic->id}' id='input-{$graphic->id}' /> {$graphic->description}</label>";
		echo "</td><td align='right'>";
		echo "<label for='input-{$graphic->id}'>";
		echo "<img class='img-thumbnail' src='https://raw.githubusercontent.com/abcnews/dailygraphics/master/graphic_templates/_thumbs/{$graphic->image}.png' alt='' width='100' height='100'>";
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

<script src="http://www.abc.net.au/res/libraries/jquery/jquery-2.1.4.js"></script>
<script src="bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script src="scripts.js" charset="utf-8"></script>

</body>
</html>
