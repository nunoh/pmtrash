<?php

include "DB.php";

$db = DB::getInstance();

$query = "SELECT `ID`, `Longitude`, `Latitude` FROM `containers`";
$result = $db->getRows($query);

echo json_encode($result);

?>