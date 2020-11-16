<?php

$idToDelete = intval(htmlspecialchars($_POST['id']));

include('../database_connexion.php');

// Supprimer tous les likes correspondant à ce POI (table Likes)
$statement = $pdo->prepare("
    DELETE FROM likes
    WHERE point_of_interest_id = ?;
");
$statement->execute(array($idToDelete));

// Supprimer le signalement de la table report_messages
$statement = $pdo->prepare("
    DELETE FROM report_messages 
    WHERE poi_id = ?;
");
$statement->execute(array($idToDelete));

// Supprimer le poi de la table points_of_interest
$statement = $pdo->prepare("
    DELETE FROM points_of_interest 
    WHERE id = ?;
");
$statement->execute(array($idToDelete));

$pdo = null;