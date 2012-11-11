<?php
// Database Handling class.

class DB {		

	// local
	// private $db_host = "localhost";
	// private $db_user = "root";
	// private $db_pass = "";
	// private $db_name = "pmtrash";

	// remote nuno's server
	private $db_host = "localhost";
	private $db_user = "nunohesp_pmtrash";
	private $db_pass = "PmTrash!";
	private $db_name = "nunohesp_pmtrash";

	private $conection;
	
	static $_instance;
	
	private function __construct() {
		// creating BD instance
		$this->conection = mysql_connect($this->db_host,$this->db_user,$this->db_pass);
		mysql_select_db($this->db_name, $this->conection);
		@mysql_query("SET NAMES 'utf8'");
	}
	
	private function __clone(){}
	
	public static function getInstance() {
		if (!(self::$_instance instanceof self)) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}
	/* Raw request method */
	public function request($sql) {
		$res = mysql_query($sql,$this->conection);
		return $res;
	}
	
	/* Retrieving a single row
	** Returns a result row as an associative array
	*/
	public function getRow($sql) {
		$request = mysql_query($sql);
		if ($request) {
			return mysql_fetch_assoc($request);
		} else {
			return false;	
		}
	}
	
	/* Inserting a new row.
	** Returns:
	** Error message if fails to insert
	** ID of the inserted row OR
	** 0 if inserted but couldn't get the ID
	*/
	public function setRow($owner, $state, $longitude, $latitude){
			$request = sprintf("INSERT INTO 'containers'('ownerID', 'State', 'Longitude', 'Latitude') VALUES (".$owner.",".$state.",%s,%s)", mysql_real_escape_string($longitude), mysql_real_escape_string($latitude));
			
			$res = mysql_query($request);
			if (!$res) {
				$message  = 'Invalid query: ' . mysql_error() . "\n";
    			$message .= 'Whole query: ' . $query;
    			die($message);
			}
			$id = mysql_insert_id($this->conection);
			if (!$id) {
				die("Inserted ok BUT unable to recover inserted id.");	
			}
			return $id;
	}
	
	/* Retrieving multiple rows.
	** Returns an array
	*/
	public function getRows($sql) {
		$res = array();
		$request = mysql_query($sql);
		if ($request) {
			while ($f = mysql_fetch_assoc($request)) {
				array_push($res,$f);
			}
		}
		return $res;
	}
	
	/* Retrieving the value of a given field in a given row
	** Returns:
	** False if unable to execute the query or no results to show
	** First field on the first row of the result of the query (which should be 1 row of 1 field)
	*/
	public function getField($sql) {
		$res = mysql_query($sql, $this->conection);
		if (!$res || !mysql_num_rows($res)) {
			return false;	
		} else {
			return mysql_result($res,0);
		}
	}
	
	/* Counting the results that satisfy the query
	** Returns:
	** 0 if none or bad query
	++ [int] result
	*/
	public function getCount($sql) {
		$res = mysql_query($sql,$this->conection);
		if (!$res || !mysql_num_rows($res)) {
			return 0;
		} else {
			return mysql_num_rows($res);
		}
	}

	// TODO Enrique
	public function setField($field, $value) {

	}
}

?>