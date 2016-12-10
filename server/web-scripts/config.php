<?php

	header('Access-Control-Allow-Origin: *');
	define("SERVER", "localhost");
	define("HOST", "root");
	define("PASS", "");
	define("DB", "cw");

	mysql_connect(SERVER, HOST, PASS) or die("Error in Connection");
	mysql_select_db(DB) or die("Database not found");
?>