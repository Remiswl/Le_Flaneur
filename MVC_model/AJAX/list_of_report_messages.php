<?php 

$selectedId = htmlspecialchars($_POST['id']);

include('../database_connexion.php');

$statement = $pdo->prepare("
    SELECT id, message 
    FROM report_messages 
    WHERE poi_id = ?;
");
$statement->execute(array($selectedId));
$message = $statement->fetch(PDO::FETCH_ASSOC);

$pdo = null;

header("Content-Type: Application/json");
echo $json = json_encode($message);