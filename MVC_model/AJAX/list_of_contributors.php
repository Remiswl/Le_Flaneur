<?php

include('../database_connexion.php');

$statement = $pdo->prepare("
    SELECT 
        id,
        first_name,
        last_name,
        CONCAT(first_name, ' ', last_name) AS name, 
        email,
        login,
        password,
        rights
    FROM contributors
");
$statement->execute();
$users = $statement->fetchAll(PDO::FETCH_ASSOC);

$pdo = null;

header("Content-Type: Application/json");
echo $json = json_encode($users);