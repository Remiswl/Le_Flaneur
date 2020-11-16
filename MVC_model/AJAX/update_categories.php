<?php

$newName = htmlspecialchars($_POST['newCatName']);
$idToModify = htmlspecialchars($_POST['idToModify']);

include('../database_connexion.php');
        
$statement = $pdo->prepare("
    UPDATE categories
    SET name = ?
    WHERE id = ?;
");
$statement->execute(array($newName, $idToModify));

$pdo = null;

header('Location: ../../MVC_view/admin.phtml');