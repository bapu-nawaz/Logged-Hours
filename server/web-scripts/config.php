<?php

	header('Access-Control-Allow-Origin: *');
	define("SERVER", "localhost");
	define("HOST", "xbmcom_cw");
	define("PASS", "Nothing0");
	define("DB", "xbmcom_crystal_white");

	mysql_connect(SERVER, HOST, PASS) or die("Error in Connection");
	mysql_select_db(DB) or die("Database not found");
?>