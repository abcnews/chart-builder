<?php

$graphics = json_decode(file_get_contents('graphic-templates.json'));

?>

<form action="server.php?action=create" method="post">

<div class="panel panel-success">
<div class="panel-heading">
	<h3 class="panel-title">Create new graphic</h3>
</div>

<?php if ($isAdvancedMode) { ?>

	<div class="panel-body">
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
					foreach ($graphics->advanced as $graphic) {
						echo "<li><a href='#' data-type='{$graphic->id}'><span class='text-warning'>{$graphic->description}</span></a></li>";
					}
				?>
			</ul>
		</div>
	</div><!-- /input-group -->
	</div>

<?php } else { ?>

<ul class="list-group graphic-types">

<?php
	$checked = " checked='checked'";
	foreach ($graphics->base as $graphic) {
		echo "<li class='list-group-item'>";
		echo "<input{$checked} type='radio' name='type' value='{$graphic->id}' id='input-{$graphic->id}' />";
		echo "<label for='input-{$graphic->id}' class='thumbnail' style='background-image:url(https://raw.githubusercontent.com/abcnews/dailygraphics/master/graphic_templates/_thumbs/" . str_replace("_","-",$graphic->id) . ".png);'></label>";
		echo "<label for='input-{$graphic->id}'>{$graphic->description}</label>";
		echo "</li>";
		$checked = '';
	}
?>

</ul>

<div class="panel-body">
	<div class="input-group">
		<input type="text" class="form-control" name="slug" placeholder="Graphic name">
		<span class="input-group-btn">
			<button class="btn btn-success" type="submit">Create</button>
		</span>
	</div><!-- /input-group -->
</div>

<?php } ?>

</div>

</form>
