<?php

$city_id = htmlspecialchars($_POST['id']);

if (isset($_POST['choice'])) {
    $choice = htmlspecialchars($_POST['choice']);
} else {
    $choice = 'poi.likes';
}

// Récupération des POI de la ville sélectionnée
include('../database_connexion.php');

$statement = $pdo->prepare("
    SELECT 
        poi.id,
        poi.title,
        poi.description,
        poi.website,
        poi.address,
        poi.latitude,
        poi.longitude,
        poi.likes,
        poi.photo,
        ca.name AS category,
        ci.zipcode AS zipcode,
        ci.name AS city
    FROM points_of_interest AS poi
    INNER JOIN cities AS ci ON ci.id = poi.city_id
    INNER JOIN categories AS ca ON ca.id = poi.category_id
    WHERE poi.status = 'approved' AND ci.id = ?
    ORDER BY ?
    LIMIT 23;
");
$statement->execute(array($city_id, $choice));
$pois = $statement->fetchAll(PDO::FETCH_ASSOC);

$pdo = null;

header("Content-Type: Application/json");
echo $json = json_encode($pois);