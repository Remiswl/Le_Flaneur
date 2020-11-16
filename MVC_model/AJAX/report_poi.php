<?php

$poiId = htmlspecialchars($_POST['id']);
$newStatus = htmlspecialchars($_POST['newStatus']);
$message = htmlspecialchars($_POST['message']);

include('../database_connexion.php');

// Changer le status du POI
$statement = $pdo->prepare("
    UPDATE points_of_interest
    SET status = ?
    WHERE id = ?;
");
$statement->execute(array($newStatus, $poiId));

// Ajouter le message dans la table report_messages
$statement = $pdo->prepare("
    INSERT INTO report_messages (message, poi_id)
    VALUES (?, ?);
");
$statement->execute(array($message, $poiId));

$pdo = null;