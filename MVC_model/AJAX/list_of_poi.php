<?php

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
        poi.status,
        ca.name AS category,
        ci.zipcode AS zipcode,
        ci.name AS city
    FROM points_of_interest AS poi
    INNER JOIN cities AS ci ON ci.id = poi.city_id
    INNER JOIN categories AS ca ON ca.id = poi.category_id;
");
$statement->execute();
$allPois = $statement->fetchAll(PDO::FETCH_ASSOC);

$pdo = null;

header("Content-Type: Application/json");
echo $json = json_encode($allPois);