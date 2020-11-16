<?php
    
$idToDelete = intval(htmlspecialchars($_POST['id']));

include('../database_connexion.php');

$statement = $pdo->prepare("
    DELETE FROM messages 
    WHERE id = ?;
");
$statement->execute(array($idToDelete));

$pdo = null;