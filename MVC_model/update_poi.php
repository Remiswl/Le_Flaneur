<?php

include('database_connexion.php');

// Modification de la table Cities
// Ajouter la ville et le zipcode s'ils ne sont pas encore dans la BDD 
$statement = $pdo->prepare("
    SELECT id, name, zipcode, latitude, longitude 
    FROM cities 
    WHERE zipcode = ?;
");
$statement->execute(array($zipcode));
$listOfZipcode = $statement->fetchAll(PDO::FETCH_ASSOC);

if($listOfZipcode == null){
    $statement = $pdo->prepare("
        INSERT INTO cities (name, zipcode, latitude, longitude) 
        VALUES (?, ?, ?, ?);
    ");
    $statement->execute(array($city, $zipcode, $cityLat, $cityLong));
};

// Une fois qu'on est sûr que la ville est bien dans la BDD,
// on récupère le city_id
$statement = $pdo->prepare("SELECT id FROM cities WHERE zipcode = ?");
$statement->execute(array($zipcode));
$newCityId = $statement->fetch(PDO::FETCH_ASSOC);

// Modification de la table points_of_interest
$statement = $pdo->prepare("
    UPDATE points_of_interest
    SET
        city_id = ?,
        title = ?,
        description = ?,
        website = ?,
        address = ?,
        latitude = ?,
        longitude = ?,
        category_id = ?,
        photo = ?
    WHERE id = ?;
");

$statement->execute(array(
    intval($newCityId['id']),
    $title, 
    $description, 
    $website,
    $address,
    $lat,
    $long,
    $category_id, 
    $fileDestination, 
    $idToModify
));

$pdo = null;