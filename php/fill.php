<?php
// DCC data management

include("DB.php");

$db = DB::getInstance();

if ( isset( $_GET["id"] ) ) {
	//	Updating State of container to full
	$query = "UPDATE containers SET State = 1 WHERE ID = " . $_GET["id"];
	$result = $db->request($query);
}else{
	// 	Getting array of full containers for that area
	$query = "SELECT ID, Longitude AS Lo, Latitude AS La FROM containers WHERE State = 0";
	
	$result = $db->getRows($query);
	
	echo json_encode($result);
}
?>