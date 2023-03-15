<?php

	//phpmyadmin credentials, be sure to change dbname, username and password to appropriate info
	$host = "localhost";
	$dbname = "user";
	$username = "phpmyadmin";
	$password = "CapStone_2023";

	$conn = mysqli_connect($host, $username, $password, $dbname);

	if (mysqli_connect_errno()){
		die("Connection error: " . mysqli_connect_error());
	}
	return $conn;
?>