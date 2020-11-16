<?php

$status = htmlspecialchars($_POST['status']);

include('../database_connexion.php');

$statement = $pdo->prepare("
    SELECT id, name, email, message, date, status 
    FROM messages 
    WHERE status = ?
    ORDER BY date DESC
");
$statement->execute(array($status));
$messages = $statement->fetchAll(PDO::FETCH_ASSOC);

$pdo = null;

header("Content-Type: Application/json");
echo $json = json_encode($messages);