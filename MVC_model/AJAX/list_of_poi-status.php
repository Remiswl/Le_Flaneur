<?php

include('../database_connexion.php');

// Si un seul status est sélectionné
if (isset($_POST['status'])) {
    $status = htmlspecialchars($_POST['status']);

    $statement = $pdo->prepare("
        SELECT 
            poi.id, 
            poi.title,
            poi.description,
            poi.website, 
            poi.address,
            poi.photo,
            poi.status,
            ca.name AS category,
            ci.zipcode AS zipcode,
            ci.name AS city
        FROM 
            points_of_interest AS poi, 
            categories AS ca,
            cities AS ci
        WHERE 
            poi.category_id = ca.id AND
            poi.city_id = ci.id AND
            poi.status = ?
    ");
    
    $statement->execute(array($status));
}
// Si deux status sont sélectionnés
else if (isset($_POST['status1']) && isset($_POST['status2'])){
    $status1 = htmlspecialchars($_POST['status1']);
    $status2 = htmlspecialchars($_POST['status2']);
    
    $statement = $pdo->prepare("
        SELECT 
            poi.id, 
            poi.title,
            poi.description,
            poi.website, 
            poi.address,
            poi.photo,
            poi.status, 
            ca.name AS category,
            ci.zipcode AS zipcode,
            ci.name AS city
        FROM 
            points_of_interest AS poi, 
            categories AS ca,
            cities AS ci
        WHERE 
            poi.category_id = ca.id AND
            poi.city_id = ci.id AND
            (status = ? OR status = ?)
    ");
    
    $statement->execute(array($status1, $status2));
}

$poi = $statement->fetchAll(PDO::FETCH_ASSOC);
$pdo = null;

header("Content-Type: Application/json");
echo $json = json_encode($poi);