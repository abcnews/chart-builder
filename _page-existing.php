<?php

function cmp ($a, $b) {
	return $b['mtime'] - $a['mtime'];
}

$files = array();
if ($handle = opendir('graphics')) {
	while (false !== ($entry = readdir($handle))) {
		if (strpos($entry, '.') !== 0) {
			$flag = @fopen('graphics/' . $entry . '/.undeployed-changes.flag', "r");
			if ($flag) {
				fclose($flag);
				$undeployed = true;
			} else {
				$undeployed = false;
			}

			$f = fopen('graphics/' . $entry . '/build/child.html', "r");
			if ($f) {
				$dat = fstat($f);
				fclose($f);
				$mtime = $dat['mtime'];
				$mtimeAtom = date(DATE_ATOM, $mtime);
				$mtimeStr = date("D, d M Y H:i", $mtime);
			} else {
				$mtime = 0;
				$mtimeAtom = "Not deployed";
				$mtimeStr = "Not deployed";
			}
			$files[] = array(
				"name" => $entry,
				"mtime" => $mtime,
				"mtimeAtom" => $mtimeAtom,
				"mtimeStr" => $mtimeStr,
				"undeployed" => $undeployed
			);
		}
	}

	closedir($handle);
	usort($files, "cmp");
}

?>


<div class="panel panel-primary">
<div class="panel-heading">
	<h3 class="panel-title">
		Existing graphics
		<span class="badge"><?php echo count($files); ?></span>
	</h3>
</div>
<div class="panel-body">
<form>
	<div class="input-group">
		<span class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>
		<input id="search" type="text" class="form-control" value="" placeholder="Filter by graphic name" aria-label="Search">
	</div>
</form>

<div id="results">

<?php
foreach ($files as $entry) {
	echo "<div class='row'>";

	echo "<div class='col-lg-6 col-md-4'>";
	echo "<div><code>{$entry['name']}</code></div>";
	echo "<small><time class='text-muted' datetime='{$entry['mtimeAtom']}'>{$entry['mtimeStr']}</time></small>";
	echo "</div>";

	echo "<div class='col-lg-3 col-md-4 col-sm-6 col-xs-6'>";
	echo "<form method='post'>";
	echo "<input type='hidden' name='slug' value='{$entry['name']}' />";
	echo "<input type='hidden' name='type' value='' />";
	echo "<div class='panel panel-info'>";
	echo "<div class='panel-heading'>";
	echo "<div class='btn-group'>";

	echo "<button class='btn btn-primary' type='submit' formaction='server.php?action=update_from_content' title='Update graphic to use latest content from its Google Sheet.'>";
	echo "<span class='glyphicon glyphicon-refresh' aria-hidden='true'></span>";
	echo "</button> ";

	if ($isAdvancedMode) {
		echo "<button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
		echo "<span class='caret'></span><span class='sr-only'>Toggle Dropdown</span>";
		echo "</button>";
		echo "<ul class='dropdown-menu'>";
		echo "<li><a formaction='server.php?action=update_from_content' href='#' title='Update graphic to use latest content from its Google Sheet.'><span class='text-success'><span class='glyphicon glyphicon-refresh' aria-hidden='true'></span> Refresh content</span></a></li>";
		echo "<li role='separator' class='divider'></li>";
		echo "<li class='dropdown-header'><span class='glyphicon glyphicon-stats' aria-hidden='true'></span> Rebuild from template</li>";
		foreach ($graphics->base as $graphic) {
			echo "<li><a data-formaction='server.php?action=update_from_template' href='#' data-type='{$graphic->id}'>{$graphic->description}</a></li>";
		}
		foreach ($graphics->advanced as $graphic) {
			echo "<li><a data-formaction='server.php?action=update_from_template' href='#' data-type='{$graphic->id}'><span class='text-warning'>{$graphic->description}</span></a></li>";
		}
		echo "<li role='separator' class='divider'></li>";
		echo "<li><a formaction='server.php?action=remove' href='#' class='text-danger' title='Remove graphic from Chart Builder interface. Chart is still live but can no longer be managed.'>";
		echo "<span class='text-danger'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Remove graphic</span>";
		echo "</a></li>";
		echo "</ul>";
	}

	echo "</div>";
	echo "<a class='btn btn-link' href='graphics/{$entry['name']}/build/'>Staging</a>";
	echo "</div>";
	echo "</div>";
	echo "</form>";

	$panelClass = $entry['undeployed'] ? 'warning' : 'success';
	echo "</div>";

	echo "<div class='col-lg-3 col-md-4 col-sm-6 col-xs-6'>";
	echo "<div class='panel panel-${panelClass}'>";
	echo "<div class='panel-heading'>";
	if ($entry['undeployed']) {
		echo "<form action='server.php?action=deploy_to_production' method='post'>";
		echo "<input type='hidden' name='slug' value='{$entry['name']}' />";
		echo "<button class='btn btn-${panelClass}' type='submit' title='Update'>";
		echo "<span class='glyphicon glyphicon-refresh' aria-hidden='true'></span>";
		echo "</button> ";
		echo "<a class='btn btn-link' href='http://www.abc.net.au/dat/news/interactives/graphics/{$entry['name']}/'>Production</a>";
		echo "</form>";
	} else {
		echo "<a class='btn btn-link' href='http://www.abc.net.au/dat/news/interactives/graphics/{$entry['name']}/'>Production</a>";
	}
	echo "</div>";
	echo "</div>";
	echo "</div>";
	echo "</div>\n";
}
?>
</div>

</div>

</div>
</div>
