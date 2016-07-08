<?php

function cmp ($a, $b) {
	return $b['mtime'] - $a['mtime'];
}

$files = array();
if ($handle = opendir('graphics')) {
	while (false !== ($entry = readdir($handle))) {
		if (strpos($entry, '.') !== 0) {
			$meta = json_decode(@file_get_contents('graphics/' . $entry . '/meta.json'));

			$mtime = max($meta->staging->content->date, $meta->staging->template->date);

			if (!$mtime) {
				$f = fopen('graphics/' . $entry . '/build/child.html', "r");
				if ($f) {
					$dat = fstat($f);
					fclose($f);
					$mtime = $dat['mtime'];
				} else {
					$mtime = 0;
				}
			}

			if (isset($meta->production->date)) {
				if (empty($meta->production->date)) {
					$undeployed = true;
				} else {
					$undeployed = ($mtime > $meta->production->date);
				}
			} else {
				$flag = @fopen('graphics/' . $entry . '/.undeployed-changes.flag', "r");
				if ($flag) {
					fclose($flag);
					$undeployed = true;
				} else {
					$undeployed = false;
				}
			}

			$stagingContentDate = $meta->staging->content->date;
			$stagingTemplateDate = $meta->staging->template->date;
			$productionDate = $meta->production->date;

			$files[] = array(
				"name" => $entry,
				"mtime" => $mtime,
				"mtimeAtom" => date(DATE_ATOM, $mtime),
				"mtimeStr" => date("D, d M Y H:i", $mtime),
				"undeployed" => $undeployed,
				"stagingContentDate" => $stagingContentDate,
				"stagingContentDateAtom" => date(DATE_ATOM, $stagingContentDate),
				"stagingContentDateStr" => date("D, d M Y H:i", $stagingContentDate),
				"stagingTemplateDate" => $stagingTemplateDate,
				"stagingTemplateDateAtom" => date(DATE_ATOM, $stagingTemplateDate),
				"stagingTemplateDateStr" => date("D, d M Y H:i", $stagingTemplateDate),
				"stagingTemplateType" => $meta->staging->template->type,
				"productionDate" => $productionDate,
				"productionDateAtom" => date(DATE_ATOM, $productionDate),
				"productionDateStr" => date("D, d M Y H:i", $productionDate)
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
		<span class="badge pull-right"><?php echo count($files); ?></span>
	</h3>
</div>
<div class="panel-body">
<form>

	<div class="row">

	<div class="col-sm-12">
		<div class="input-group">
			<span class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>
			<input id="search" type="text" class="form-control" value="" placeholder="Filter by graphic name" aria-label="Search">
		</div>
	</div>
<!--
	<div class="col-sm-6">
		<div class="btn-group">
			<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				Filter by graphic type <span class="caret"></span>
			</button>
			<ul class="dropdown-menu" id="type-filter-2">
				<li><a href="#" data-type='ALL'><span class='badge'></span> All</a></li>
				<li role="separator" class="divider"></li>
				<?php
				foreach ($graphics->base as $graphic) {
					echo "<li><a href='#' data-type='{$graphic->id}'><span class='badge'></span> {$graphic->description}</a></li>";
				}
				?>
				<li role="separator" class="divider"></li>
				<?php
				foreach ($graphics->advanced as $graphic) {
					echo "<li><a href='#' data-type='{$graphic->id}'><span class='badge'></span> {$graphic->description}</a></li>";
				}
				?>
				<li role="separator" class="divider"></li>
				<li><a href="#" data-type='UNKNOWN'><span class='badge'></span> Unknown</a></li>
			</ul>
		</div>

		<select class="form-control" id="type-filter">
			<option value="">Filter by graphic type</option>
			<option value='' disabled></option>
			<?php
			foreach ($graphics->base as $graphic) {
				echo "<option value='{$graphic->id}'>{$graphic->description}</option>";
			}
			?>
			<option value='' disabled></option>
			<?php
			foreach ($graphics->advanced as $graphic) {
				echo "<option value='{$graphic->id}'>{$graphic->description}</option>";
			}
			?>
			<option value='' disabled></option>
			<option value="unknown">Unknown</option>
		</select>
	</div>
-->
</div>

</form>

<div id="results">

<?php
foreach ($files as $entry) {
	echo "<div class='row'>";

	echo "<div class='col-lg-6 col-md-4'>";
	echo "<div><code>{$entry['name']}</code></div>";
	if ($entry['mtime']) {
		echo "<small title='Last modified' class='text-muted'><span class='glyphicon glyphicon-calendar' aria-hidden='true'></span> <time datetime='{$entry['mtimeAtom']}'>{$entry['mtimeStr']}</time></small>";
	}
	if ($entry['stagingTemplateType']) {
		echo " <span class='label label-default'>{$entry['stagingTemplateType']}</span>";
	}
	echo "</div>";

	echo "<div class='col-lg-3 col-md-4 col-sm-6 col-xs-6'>";
	echo "<form method='post' action='server.php?action=update_from_content'>";
	echo "<input type='hidden' name='slug' value='{$entry['name']}' />";
	echo "<div class='env bg-info'>";
	echo "<button class='btn btn-primary sr-only' type='submit' title='Update graphic to use latest content from its Google Sheet.'>";
	echo "Refresh";
	echo "</button>";
	echo "<div class='btn-group'>";

	echo "<button class='btn btn-primary' type='submit' title='Update graphic to use latest content from its Google Sheet.'>";
	echo "<span class='glyphicon glyphicon-refresh' aria-hidden='true'></span>";
	echo "</button>";

	echo "<button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
	echo "<span class='caret'></span><span class='sr-only'>Toggle Dropdown</span>";
	echo "</button>";
	echo "<ul class='dropdown-menu'>";
	echo "<li><a href='#' title='Update graphic to use latest content from its Google Sheet.'>";
	echo "<span class='text-success'>";
	echo "<span class='glyphicon glyphicon-refresh' aria-hidden='true'></span> Refresh content";
	echo "</span></a></li>";
	if ($entry['stagingContentDate']) {
		echo "<li class='dropdown-header'>";
		echo "Last refreshed <time datetime='{$entry['stagingContentDateAtom']}'>{$entry['stagingContentDateStr']}</time></li>";
	}
	echo "<li role='separator' class='divider'></li>";
	echo "<li><a data-formaction='server.php?action=update_from_template' href='#' data-type='{$entry['stagingTemplateType']}'>";
	echo "<span class='text-warning'>";
	echo "<span class='glyphicon glyphicon-stats' aria-hidden='true'></span> Rebuild from template";
	echo "</span></a></li>";
	echo "<li class='dropdown-header'><select class='form-control' name='type'>";
	echo "<option value='' disabled>Select graphic template</option>";
	echo "<option value='' disabled></option>";
	foreach ($graphics->base as $graphic) {
		$selected = ($graphic->id == $entry['stagingTemplateType']) ? " selected='selected'" : '';
		echo "<option value='{$graphic->id}'{$selected}>{$graphic->description}</option>";
	}
	echo "<option value='' disabled></option>";
	foreach ($graphics->advanced as $graphic) {
		$selected = ($graphic->id == $entry['stagingTemplateType']) ? " selected='selected'" : '';
		echo "<option value='{$graphic->id}'{$selected}>{$graphic->description}</option>";
	}
	echo "</select></li>";
	if ($entry['stagingTemplateDate']) {
		echo "<li class='dropdown-header'>";
		echo "Last rebuilt <time datetime='{$entry['stagingTemplateDateAtom']}'>{$entry['stagingTemplateDateStr']}</time></li>";
	}
	echo "<li role='separator' class='divider'></li>";
	echo "<li><a data-formaction='server.php?action=deploy_to_production' href='#'>";
	echo "<span class='text-primary'><span class='glyphicon glyphicon-arrow-right' aria-hidden='true'></span> Push to production</span>";
	echo "</a></li>";
	if ($entry['productionDate']) {
		echo "<li class='dropdown-header'>";
		echo "Last pushed <time datetime='{$entry['productionDateAtom']}'>{$entry['productionDateStr']}</time></li>";
	}
	echo "<li role='separator' class='divider'></li>";
	echo "<li><a data-formaction='server.php?action=remove' href='#' title='Remove graphic from Chart Builder interface. Chart is still live but can no longer be managed.'>";
	echo "<span class='text-danger'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Remove graphic</span>";
	echo "</a></li>";
	echo "</ul>";

	echo "</div>";
	echo "<a class='btn btn-link' href='graphics/{$entry['name']}/build/'>Staging</a>";
	echo "</div>";
	echo "</form>";

	$panelClass = $entry['undeployed'] ? 'warning' : 'success';
	echo "</div>";

	echo "<div class='col-lg-3 col-md-4 col-sm-6 col-xs-6'>";
	echo "<div class='env bg-${panelClass}'>";
	if ($entry['undeployed']) {
		echo "<form action='server.php?action=deploy_to_production' method='post'>";
		echo "<input type='hidden' name='slug' value='{$entry['name']}' />";
		echo "<button class='btn btn-${panelClass}' type='submit' title='Update from staging'>";
		echo "<span class='glyphicon glyphicon-refresh' aria-hidden='true'></span>";
		echo "</button>";
		echo "<button class='btn btn-${panelClass} sr-only' type='submit' title='Update from staging'>";
		echo "Update";
		echo "</button>";
	}
	echo "<a class='btn btn-link' href='http://www.abc.net.au/dat/news/interactives/graphics/{$entry['name']}/'>";
	echo "<span class='text-${panelClass}'>Production</span>";
	echo "</a>";
	if ($entry['undeployed']) {
		echo "</form>";
	}
	echo "</div>";
	echo "</div>";
	echo "</div>\n";
}
?>
</div>

</div>

</div>
</div>
