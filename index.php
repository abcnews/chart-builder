<?php

$isAdvancedMode = (strpos($_SERVER['REQUEST_URI'],'?mode=advanced') !== false);

require '_page-top.inc';
require '_page-header.php';

?>

<div class="row">
	<div class="col-sm-4 col-sm-push-8">
		<?php require '_page-create.php'; ?>
	</div>
	<div class="col-sm-8 col-sm-pull-4">
		<?php require '_page-existing.php'; ?>
	</div>
</div>

<?php

require '_page-bottom.inc';

?>
