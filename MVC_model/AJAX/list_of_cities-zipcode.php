<?php

$city_zipcode = htmlspecialchars($_POST['cityZipcode']);

// Récupération des POI de la ville sélectionnée
include('../database_connexion.php');

$statement = $pdo->prepare("
    SELECT id, name, zipcode, latitude, longitude 
    FROM cities 
    WHERE zipcode = ?;
");
$statement->execute(array($city_zipcode));
$city = $statement->fetch(PDO::FETCH_ASSOC);

$pdo = null;

header("Content-Type: Application/json");
echo $json = json_encode($city); 