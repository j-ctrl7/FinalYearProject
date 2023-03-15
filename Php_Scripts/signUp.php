<?php
    /**SignUp Credentials */
    $name = $_POST["username"];
    $email = $_POST["email"];
    $pword = $_POST["password"];

    /**server-side validation for sign up */
    if(empty($name)){
        die("Name is required");
    }

    if(! filter_var($email, FILTER_VALIDATE_EMAIL)){
        die("Valid email is required");
    }

    if (strlen($pword) < 8) {
        die("Password must be at least 8 characters");
    }

    if(! preg_match("/[a-z]/i", $pword)){
        die("Password must contain at least one letter");
    }

    if(! preg_match("/[0-9]/i", $pword)){
        die("Password must contain at least one number");
    }

    if($pword !== $_POST['password_confirmation']){
        die("Passwords must match");
    }

    //space for password hashing...will be complete after database is fully connected
	$encrypted_password = password_hash($pword, PASSWORD_DEFAULT);

    $conn = require __DIR__ . "/connect.php";

    $sql = "INSERT INTO user (username, email, pword) VALUES (?, ?, ?)";

    $stmt = mysqli_stmt_init($conn);

    if(! mysqli_stmt_prepare($stmt, $sql)){
        die("SQL error: " . mysqli_error($conn));
    }
        
	mysqli_stmt_bind_param($stmt, 'sss', $name, $email, $encrypted_password);
    
    if (mysqli_stmt_execute($stmt)){
		header("Location: ../UI/signUp_successful.html");
		exit;
	}else {
		die($conn->error . "" . $conn->errno);
	}   
	
    //Displaying data on php page (for testing)
    //print_r($_POST);
    
?>