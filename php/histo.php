<?php
// DCC data management

include("DB.php");

$db = DB::getInstance();

// Getting array of full containers for that area
$query = "SELECT * FROM history";

$result = $db->getRows($query);

echo json_encode($result);
?>