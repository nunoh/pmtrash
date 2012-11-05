<?php
// Database Handling class.

class Encryption
{
	private $algorithm = 'rijndael-256';	// AES 256b
	private $mode = 'cbc';	// Far enough for text-only encryption
	private $key;
	private $td;
	private $iv;
	
	static $_instance;
	
	/* Needs to get a key to be created 
	** Key is private for each user
	** it's md5-ed to get a 32bits long key, needed on crypto functions
	*/
	private function __construct($key) {
		$this->key = md5($key);
		$this->td = mcrypt_module_open($this->algorithm, '', $this->mode, '');
		$this->iv = mcrypt_create_iv(mcrypt_enc_get_iv_size($this->td), MCRYPT_RAND);	// if running on Windows	*/
	/*	$iv = mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_DEV_RANDOM);	// if running on Linux  	*/
		mcrypt_generic_init($this->td, $this->key, $this->iv);
	}
	
	private function __destruct() {
		mcrypt_generic_deinit($td);
		mcrypt_module_close($td);
		parent::__destruct();
	}
	
	public static function getInstance($arg) {
		if (!(self::$_instance instanceof self)) {
			self::$_instance = new self($arg);
		}
		return self::$_instance;
	}

	/* Encodes the given input */
	public function mencrypt($input){
		$encrypted_data = mcrypt_generic($this->td, $input);
		return $encrypted_data;
	}
	
	/* Decrypts the given input */
	public function mdecrypt($input){
		$data = mdecrypt_generic($this->td, $input);
		return $data;
	}
}

?>