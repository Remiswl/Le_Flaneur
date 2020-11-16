<?php

include('database_connexion.php');

// Ajouter la ville et le zipcode s'ils ne sont pas encore dans la BDD 
$statement = $pdo->prepare("SELECT id FROM cities WHERE zipcode = ?");
$statement->execute(array($zipcode));
$listOfZipcode = $statement->fetchAll(PDO::FETCH_ASSOC);

if($listOfZipcode == null){
    $statement = $pdo->prepare("
        INSERT INTO cities (name, zipcode, latitude, longitude) 
        VALUES (?, ?, ?, ?);
    ");
    $statement->execute(array($city, $zipcode, $cityLat, $cityLong));
};

// Puis ajouter le POI dans la BDD
$statement = $pdo->prepare("
    INSERT INTO points_of_interest (
        city_id,
        title,
        description,
        website,
        address,
        latitude,
        longitude,
        category_id,
        photo,
        contributor_id
    )
    VALUES (
        (SELECT id FROM cities WHERE zipcode = :zipcode), 
        :title, 
        :description, 
        :website, 
        :address, 
        :latitude, 
        :longitude, 
        :category_id, 
        :photo, 
        :contributor_id
    );
");

$statement->execute(array(
    'zipcode' => $zipcode, 
    'title' => $title, 
    'description' => $description,
    'website' => $website,
    'address' => $address,
    'latitude' => $lat,
    'longitude' => $long,
    'category_id' => $category_id, 
    'photo' => $fileDestination, 
    'contributor_id' => $contributor_id
));

// Enfin, augmenter de 1 le number_of_posts du contributeur
$statement = $pdo->prepare("
   UPDATE contributors
   SET number_of_posts = number_of_posts + 1
   WHERE id = ?;
");

$statement->execute(array($contributor_id));

$pdo = null;