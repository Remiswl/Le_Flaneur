<?php

$idToModify = htmlspecialchars($_POST['id']);

if ($_POST['status'] === 'unread') {
    $newStatus = 'read';
} else {
    $newStatus = 'unread';
}

include('../database_connexion.php');

$statement = $pdo->prepare("
    UPDATE messages
    SET status = ?
    WHERE id = ?;
");

$statement->execute(array($newStatus, $idToModify));

$pdo = null;