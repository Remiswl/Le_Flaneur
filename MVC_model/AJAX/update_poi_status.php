<?php

$idToModify = htmlspecialchars($_POST['id']);

if ($_POST['status'] === 'approved') {
    $newStatus = 'proposed';
} else {
    $newStatus = 'approved';
}

include('../database_connexion.php');

$statement = $pdo->prepare("
    UPDATE points_of_interest
    SET status = ?
    WHERE id = ?;
");
$statement->execute(array($newStatus, $idToModify));

$pdo = null;