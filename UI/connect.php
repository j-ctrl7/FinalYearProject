<?php
    $email = $_POST["email"];
    $password = $_POST["password"];
    $username = $_POST["username"];

    //Database connection
    if (isset($_GET["email"])){
		echo "<h1>Values were sent fromt he form using <em>GET</em> method</h1>";
		echo "<p><strong>Email Address: </strong>".$_GET["email"]."</p>";
		echo "<p><strong>Password: </strong>".$_GET["password"]."</p>";
		echo "<p><strong>Username: </strong>".$_GET["username"]."</p>";
	}else if(isset($_POST["email"])){
		echo "<h1>Values were sent fromt he form using <em>POST</em> method</h1>";
		echo "<p><strong>Email Address: </strong>".$_POST["email"]."</p>";
		echo "<p><strong>Password: </strong>".$_POST["password"]."</p>";
		echo "<p><strong>Username: </strong>".$_POST["username"]."</p>";
	}
?>