<?php

function getPoi() {
    include('database_connexion.php');
    
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
    
    return $allPois;
}

function getPoiById($poi_id){
    include('database_connexion.php');
    
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
            ca.id AS category_id,
            ci.zipcode AS zipcode,
            ci.name AS city,
            ci.latitude AS cityLatitude,
            ci.longitude AS cityLongitude
            
        FROM points_of_interest AS poi
        INNER JOIN cities AS ci ON ci.id = poi.city_id
        INNER JOIN categories AS ca ON ca.id = poi.category_id
        WHERE poi.id = ?
    ");
    $statement->execute(array($poi_id));
    $poiData = $statement->fetch(PDO::FETCH_ASSOC);
    
    $pdo = null;
    
    return $poiData;
}