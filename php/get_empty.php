<?php

include "DB.php";

$db = DB::getInstance();

$query = "SELECT `ID`, `Longitude`, `Latitude` FROM `containers` where state = '0'";
$result = $db->getRows($query);

echo json_encode($result);

?>