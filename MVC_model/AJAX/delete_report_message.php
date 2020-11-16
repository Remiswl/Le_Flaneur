<?php

$idToDelete = htmlspecialchars($_POST['id']);
$newStatus = 'approved';

include('../database_connexion.php');

$statement = $pdo->prepare("
    DELETE FROM report_messages 
    WHERE poi_id = ?;
");
$statement->execute(array($idToDelete));

$statement = $pdo->prepare("
    UPDATE points_of_interest
    SET status = ?
    WHERE id = ?;
");
$statement->execute(array($newStatus, $idToDelete));

$pdo = null;