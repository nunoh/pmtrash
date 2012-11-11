<?php

include "DB.php";

$db_host = "localhost";
$db_usr = "nunohesp_pmtrash";
$db_pass = "PmTrash!";
$db_name = "nunohesp_pmtrash";

$con = mysql_connect($db_host, $db_usr, $db_pass);

$b = mysql_select_db($db_name, $con);
if (!$b) die(mysql_error());

$sql = "select * from containers where state = '1'";
echo $sql . "<br>";
$res = mysql_query($sql);
if (!$res) die(mysql_error());
$row = mysql_fetch_assoc($res);
echo json_encode($row);

?>