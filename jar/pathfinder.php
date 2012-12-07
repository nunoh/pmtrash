<?php
// Gets the route using ACO JAva Applet.

include("../php/DB.php");

$db = DB::getInstance();

// Any area in particular?
$area = 0; 					// Defaults to 0 for testing purposes
$file = "files/test.tsp";
if (isset($_GET['area'])) {	
	$area = $_GET['area'];
	$file = "files/path_".$area.".tsp";
}

// Getting array of full containers for that area
$query = "SELECT `ID`, `Longitude`, `Latitude` FROM `containers` WHERE `areaID` = ".$area." AND `State` = 1";
$result = $db->getRows($query);

/// CODE IF USING GOOGLE ROUTING /////////////////
/*

echo json_encode($result);

//*///////////////////////////////////////////////


/// CODE IF USING JAVA APPLET ROUTING ////////////

// Creating the applet working file
$fh = fopen($file, 'w') or die("can't open file");

// Some header lines
$line = "NAME: test" . PHP_EOL;
$line .= "DATE: " . date("Y-m-d H:i:s") . PHP_EOL;
$line .= "CONTAINERS: " . sizeof($result) . PHP_EOL;
$line .= "NODE COORDINATES" . PHP_EOL;
fwrite($fh, $line);
fclose($fh);

// Appending the results on it
$fc = fopen($file, 'a') or die("can't open file");
foreach ($result as $point) {
	$line = $point["ID"]." ".$point["Longitude"]." ".$point["Latitude"] . PHP_EOL;
	fwrite($fc, $line);
//	echo "Writing line: $line<br>";
}

// And closing it
fwrite($fc, "EOF");
fclose($fc);

// Execute java applet
$res = shell_exec("java -jar AntColony.jar");

//echo str_replace("\n","<br>",$res);

// Finding the real result
$pos1 = strpos($res, "[");
$pos2 = strpos($res, "]");
$ordered = substr($res,($pos1+1),($pos2-$pos1));	// Returns: 1,2,3,4 (ordered results)
$ord_arr = explode(",",$ordered);	// Into an array

$complete_res = array();

// Appending the extra information
foreach ($ord_arr as $thisID) {
	$sql_histo = "SELECT * FROM history WHERE ID = ".$thisID." LIMIT 1";	// Already ordered by date in DB
	$extra = $db->getRow($sql_histo);
	$complete_res[] = array($thisID,$extra);
}

echo json_encode($complete_res);
//*/
?>