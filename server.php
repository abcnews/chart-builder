<?php

require '_page-top.inc';

echo '<br>';

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
	echo "$ <strong>{$command}</strong>\n";
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
$status = 'danger';

if ($slug) {
	chdir("dailygraphics");
	switch ($_GET['action']) {
		case "create":
			$slug = clean($slug);
			$x = runAndLogCommand("fab add_{$type}:{$slug}");
			if (strpos($x, "Done.") !== false) {
				// auto build when first created
				$y = runAndLogCommand("fab update_from_content:{$slug}");
				if (strpos($y, "Done.") !== false) {
					// auto deploy when first created
					$z = runAndLogCommand("fab deploy_to_production:{$slug}");
					if (strpos($z, "Done.") !== false) {
						$status = 'success';
					}
				}
			}
			break;

		case "deploy": // legacy support for parent.html links
		case "update_from_content":
			$x = runAndLogCommand("fab update_from_content:{$slug}");
			if (strpos($x, "Done.") !== false) {
				$status = 'success';
			}
			break;

		case "update_from_template":
			$x = runAndLogCommand("fab update_from_template:{$slug},template={$type}");
			if (strpos($x, "Done.") !== false) {
				$status = 'success';
			}
			break;

		case "deploy_to_production":
			$x = runAndLogCommand("fab deploy_to_production:{$slug}");
			if (strpos($x, "Done.") !== false) {
				$status = 'success';
			}
			break;

		case "remove":
			runAndLogCommand("rm -rf ../graphics/{$slug}");
			$status = 'warning';
			bootstrapAlert($status, 'The graphic is not removed from production. Only from the Chart Builder interface.');
			// TODO: also remove from contentftp?
			break;

		case "git_pull_dailygraphics":
			runAndLogCommand("git pull");
			break;

		case "git_pull_chartbuilder":
			runAndLogCommand("git -C ../ pull");
			break;

	}
}

if ($status == 'danger') {
	bootstrapAlert($status, 'Something has gone wrong. Please let a developer know.');
}

// header("Location: " . $redirect);
echo "<div><a class='btn btn-{$status} btn-lg' href='{$_SERVER['HTTP_REFERER']}'>Continue</a></div>";

require '_page-bottom.inc';

?>
