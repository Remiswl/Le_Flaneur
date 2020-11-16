<?php

include('database_connexion.php');
    
$statement = $pdo->prepare("
    INSERT INTO messages (name, email, message) 
    VALUES (?, ?, ?);
");
$statement->execute(array($name, $email, $message));

$pdo = null;