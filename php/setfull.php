<?php

include "DB.php";

$hash = $_POST["container"];

if ($hash == null) {
	echo "null";
}

else {	
	
	$db = DB::getInstance();
	
	// TODO convert hash to container id
	$id = 0;

	$query = "UPDATE containers SET state = '1' WHERE id = " . $id;

	$result = $db->getRows($query);
	
	echo "ok";
}

?>