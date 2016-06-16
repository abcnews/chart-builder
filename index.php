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

<script src="http://www.abc.net.au/res/libraries/jquery/jquery-2.1.4.js"></script>
<script src="bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script src="scripts.js" charset="utf-8"></script>

</body>
</html>
