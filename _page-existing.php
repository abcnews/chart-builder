<?php

function cmp ($a, $b) {
	return $b['mtime'] - $a['mtime'];
}

$files = array();
if ($handle = opendir('graphics')) {
	while (false !== ($entry = readdir($handle))) {
		if ($entry != "." && $entry != "..") {
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
				$mtimeAtom = "! Not deployed !";
				$mtimeStr = "! Not deployed !";
			}
			$files[] = array(
				"name" => $entry,
				"mtime" => $mtime,
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
</div>

<table class="table table-hover">
<tbody id="results">

<?php
foreach ($files as $entry) {
	echo "<tr>";
	echo "<td width='100%'>";
	echo "<div><code>{$entry['name']}</code></div>";
	echo "<small><time class='text-muted' datetime='{$entry['mtimeAtom']}'>{$entry['mtimeStr']}</time></small>";
	echo "</td>";
	echo "<td width='25%'>";
	echo "<form method='post'>";
	echo "<input type='hidden' name='slug' value='{$entry['name']}' />";
	echo "<input type='hidden' name='type' value='' />";
	echo "<div class='panel panel-info'>";
	echo "<div class='panel-heading'><a href='graphics/{$entry['name']}/build/'>Staging</a></div>";
	echo "<div class='list-group'>";

	echo "<div class='list-group-item'>";
	echo "<button class='btn btn-xs btn-primary' type='submit' formaction='server.php?action=update_from_content' title='Update graphic to use latest content from its Google Sheet.'>Refresh content</button> ";
	echo "</div>";

	if ($isAdvancedMode) {

		echo "<div class='list-group-item'>";
		echo "<div class='btn-group'>";
		echo "<button type='button' class='btn btn-xs btn-primary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' title='Update graphic to use the latest templates from the chosen graphic type.'>";
		echo "Rebuild from template <span class='caret'></span>";
		echo "</button>";
		echo "<ul class='dropdown-menu' data-formaction='server.php?action=update_from_template'>";
		foreach ($graphics->base as $graphic) {
			echo "<li><a href='#' data-type='{$graphic->id}'>{$graphic->description}</a></li>";
		}
		echo "<li role='separator' class='divider'></li>";
		foreach ($graphics->advanced as $graphic) {
			echo "<li><a href='#' data-type='{$graphic->id}'>{$graphic->description}</a></li>";
		}
		echo "</ul>";
		echo "</div>";
		echo "</div>";

		echo "<div class='list-group-item'>";
		echo "<button class='btn btn-xs btn-danger' type='submit' formaction='server.php?action=remove' title='Remove graphic from Chart Builder interface. Chart is still live but can no longer be managed.'>";
		echo "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Remove";
		echo "</button>";
		echo "</div>";

	}
	echo "</div>";
	echo "</div>";
	echo "</form>";

	$panelClass = $entry['undeployed'] ? 'warning' : 'success';
	echo "</td>";
	echo "<td width='25%'>";
	echo "<div class='panel panel-${panelClass}'>";
	echo "<div class='panel-heading'><a href='http://www.abc.net.au/dat/news/interactives/graphics/{$entry['name']}/'>Production</a></div>";
	if ($entry['undeployed']) {
		echo "<div class='list-group'>";
		echo "<div class='list-group-item'>";
		echo "<form action='server.php?action=deploy_to_production' method='post'>";
		echo "<input type='hidden' name='slug' value='{$entry['name']}' />";
		echo "<button class='btn btn-xs btn-${panelClass}' type='submit' title=''>Update</button> ";
		echo "</form>";
		echo "</div>";
		echo "</div>";
	}
	echo "</div>";
	echo "</td>";
	echo "</tr>";
}
?>
</tbody>
</table>

</div>
</div>
