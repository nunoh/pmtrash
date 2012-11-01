<?php
// ACO Applet Handling script.

include("DB.php");

$db = DB::getInstance();

// Any area in particular?
$area = 0; 					// Default to 0 for testing purposes
$file = "files/test.tsp";
if (isset($_GET['area'])) {	
	$area = $_GET['area'];
	$file = "files/path_".$area.".tsp";
}

// Getting array of full containers for that area
$query = "SELECT `ID`, `Longitude`, `Latitude` FROM `containers` WHERE `areaID` = ".$area." AND `State` = 1";
//echo $query. PHP_EOL;
$result = $db->getRows($query);

echo json_encode($result);
/*
var_dump($result);
// Creating the applet working file
$fh = fopen($file, 'w') or die("can't open file");

$line = "NAME: test" . PHP_EOL;
$line .= "DIMENSION: " . sizeof($result) . PHP_EOL;
$line .= "NODE_COORD_SECTION" . PHP_EOL;
fwrite($fh, $line);
fclose($fh);

// Appending the results on it
$fc = fopen($file, 'a') or die("can't open file");
foreach ($result as $point) {
	$line = $point["ID"]." ".$point["Longitude"]." ".$point["Latitude"] . PHP_EOL;
	fwrite($fc, $line);
	echo "Writing line: $line<br>";
}

// And closing it
fwrite($fc, "EOF");
fclose($fc);

// Execute java applet
$res = shell_exec("java -jar AntColony.jar");

echo str_replace("\n","<br>",$res);
// Jsonize data
*/
?>