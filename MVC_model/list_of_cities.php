<?php

function getCities() {
    include('database_connexion.php');
    
    $statement = $pdo->prepare("
        SELECT id, name, zipcode, latitude, longitude 
        FROM cities 
        ORDER BY name;
    ");
    $statement->execute();
    $cities = $statement->fetchAll(PDO::FETCH_ASSOC);
    
    $pdo = null;
    
    return $cities;
}