<?php 

include('database_connexion.php');

$statement = $pdo->prepare("
    INSERT INTO contributors (
        first_name, 
        last_name,
        email,
        login,
        password
    )
    VALUES (
        :first_name, 
        :last_name,
        :email,
        :login,
        :password
    );
");
        
$statement->execute(array(
    'first_name' => $first_name, 
    'last_name' => $last_name,
    'email' => $email, 
    'login' => $login, 
    'password' => $password
));

// Renvoyer les informations pour créer les variables de session
$statement = $pdo->prepare("
    SELECT id, first_name, last_name, email, login, rights 
    FROM contributors 
    WHERE email = ?;
");
$statement->execute(array($email));
$userData = $statement->fetch(PDO::FETCH_ASSOC);

$pdo = null;