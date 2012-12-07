<?php

include "DB.php";

$hash = $_GET["container"];

if ($hash == null) {
	echo "null";
}

else {	
	
	$db = DB::getInstance();
	
	// TODO convert hash to container id (the below code is wrong! just for testing purposes)
	$id = $hash;

	$query = "UPDATE containers SET state = '1' WHERE id = " . $id;

	// TODO
	//$db->setField()
	
	echo "ok";
}

?>