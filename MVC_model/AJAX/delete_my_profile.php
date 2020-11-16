<?php

$idToDelete = intval(htmlspecialchars($_POST['id']));

include('../database_connexion.php');

$statement = $pdo->prepare("
    DELETE FROM contributors 
    WHERE id = ?;
");
$statement->execute(array($idToDelete));

$pdo = null;