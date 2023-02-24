<?php

	//phpmyadmin credentials, be sure to change dbname, username and password to appropriate info
	$host = "localhost";
	$dbname = "login_db";
	$username = "root";
	$password = "";

	$conn = mysqli_connect($host, $username, $password, $dbname);

	if (mysqli_connect_errno()){
		die("Connection error: " . mysqli_connect_error());
	}
	echo "Database Connected Successfully";

	return $conn;
?>