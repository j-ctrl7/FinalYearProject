<?php

	/**Login Credentials */
    $email = $_POST["email"];
    $password = $_POST["password"];
	
	if($_SERVER["REQUEST_METHOD"] === "POST"){
		
		$mysqli = require __DIR__ . "/connect.php";
		
		$sql = sprintf ("SELECT * FROM user
						WHERE email = '%s'",
						$mysqli->real_escape_string($email));
						
						
		$result = $mysqli->query($sql);
		
		$user = $result->fetch_assoc();
		
		if ($user) {
			if (password_verify($_POST["password"], $user["pword"])) {	
			
				session_start();
				
				$_SESSION["user_email"]= $user["email"];
				
				header("Location: ../index.html");
			}else {
				die("Invalid login");
                //header("Location: ../index.html");
			}
		} else {
			die("This email address does not match any account.");
		}

	}
?>