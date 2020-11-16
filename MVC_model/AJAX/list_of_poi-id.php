<?php

$poi_id = htmlspecialchars($_POST['poi_id']);

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
        ca.name AS category
    FROM points_of_interest AS poi
    INNER JOIN cities AS ci ON ci.id = poi.city_id
    INNER JOIN categories AS ca ON ca.id = poi.category_id
    WHERE poi.id = ?
");
$statement->execute(array($poi_id));
$poiData = $statement->fetch(PDO::FETCH_ASSOC);

$pdo = null;

header("Content-Type: Application/json");
echo $json = json_encode($poiData);