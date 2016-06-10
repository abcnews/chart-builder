<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Chart Builder</title>
		<link rel="stylesheet" href="bootstrap/3.3.6/css/bootstrap.min.css">
		<link rel="stylesheet" href="bootstrap/3.3.6/css/bootstrap-theme.min.css">
		<style media="screen">
			pre {
				color: #fff;
				background: #000;
				font-family: Menlo, monospace;
				padding: 10px;
				font-size: 12px;
			}
			span.command {
				font-weight: bold;
				color: yellow;
			}
			a {
				font-family: Arial, Helvetica, sans-serif;
				font-size: 2em;
			}
		</style>
		<link rel="shortcut icon" href="favicon.ico" />
	</head>
	<body>
		<div class="container">

<?php

if (!getenv('GOOGLE_OAUTH_CLIENT_ID')) {
	// Get our contentftp username & password and google docs auth.
	$json = json_decode(file_get_contents('/home/nd/.abc-credentials'));

	$env = array(
		"GOOGLE_OAUTH_CLIENT_ID" => $json->dailygraphics->GOOGLE_OAUTH_CLIENT_ID,
		"GOOGLE_OAUTH_CONSUMER_SECRET" => $json->dailygraphics->GOOGLE_OAUTH_CONSUMER_SECRET,
		"AUTHOMATIC_SALT" => $json->dailygraphics->AUTHOMATIC_SALT,
		"FTP_PASS" => $json->contentftp->password,
		"FTP_USER" => $json->contentftp->username
	);

	foreach ($env as $key=>$val) {
		putenv("{$key}={$val}");
	}
};


function clean($string) {
	$string = strtolower($string); // Convert to lowercase.
	$string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
	return preg_replace('/[^a-z0-9\-]/', '', $string); // Removes special chars.
}

function runAndLogCommand($command){
	echo "<pre>";
	echo "$ <span class='command'>{$command}</span>\n";
	$x = system($command);
	echo "</pre>";
	return $x;
}

function bootstrapAlert($type, $msg){
	echo "<div class='alert alert-{$type}' role='alert'>";
	echo "<strong>{$type}</strong> {$msg}";
	echo "</div>";
}

$slug = $_POST['slug'];
$type = (isset($_POST['type']) ? $_POST['type'] : 'graphic');
$redirect = (isset($_POST['redirect']) ? "http://www.abc.net.au/dat/news/interactives/graphics/" . $slug . "/" : ".");

if ($slug) {
	chdir("dailygraphics");
	switch ($_GET['action']) {
		case "create":
			$slug = clean($slug);
			$x = runAndLogCommand("fab add_{$type}:{$slug}");
			if (strpos($x, "Done.") !== false) {
				// auto deploy when first created
				$y = runAndLogCommand("fab deploy:{$slug}");
				if (strpos($y, "Done.") !== false) {
					$status = 'success';
				}
			}
			break;

		case "deploy":
			$x = runAndLogCommand("fab deploy:{$slug}");
			if (strpos($x, "Done.") !== false) {
				$status = 'success';
			}
			break;

		case "deploy_template":
			$x = runAndLogCommand("fab deploy_template:{$slug},template={$type}");
			if (strpos($x, "Done.") !== false) {
				$status = 'success';
			}
			break;

		case "remove":
			runAndLogCommand("rm -rf ../graphics/{$slug}");
			$status = 'success';
			bootstrapAlert('warning', 'The graphic is not removed from production. Only from the Chart Builder interface.');
			// TODO: also remove from contentftp?
			break;
	}
}

if (isset($status) && $status != 'success') {
	bootstrapAlert('danger', 'Something has gone wrong.');
}

// header("Location: " . $redirect);
echo "<div><a href='{$redirect}'>Continue</a></div>";
?>
</div>

</body>
</html>
