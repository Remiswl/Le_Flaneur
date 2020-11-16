<?php

session_start();

if ((empty($_SESSION) || ($_SESSION['rights']) !== 'admin')){
    header('Location: ../../index.php');
}

include('../database_connexion.php');

// Récupération du nombre de POI
$statement = $pdo->prepare("SELECT COUNT(*) AS nbrPoi FROM points_of_interest;");
$statement->execute();
$nbrPoi = $statement->fetchAll(PDO::FETCH_ASSOC);

// Récupération du nombre de contributeurs
$statement = $pdo->prepare("SELECT COUNT(*) AS nbrContributors FROM contributors;");
$statement->execute();
$nbrContributors = $statement->fetchAll(PDO::FETCH_ASSOC);

// Récupération du nombre de villes
$statement = $pdo->prepare("SELECT COUNT(*) AS nbrCities FROM cities;");
$statement->execute();
$nbrCities = $statement->fetchAll(PDO::FETCH_ASSOC);

// Récupération du nombre de catégories
$statement = $pdo->prepare("SELECT COUNT(*) AS nbrCategories FROM categories;");
$statement->execute();
$nbrCategories = $statement->fetchAll(PDO::FETCH_ASSOC);

// Récupération du nombre de trajets
$statement = $pdo->prepare("SELECT COUNT(*) AS nbrStroll FROM strolls;");
$statement->execute();
$nbrStroll = $statement->fetchAll(PDO::FETCH_ASSOC);

$pdo = null;

$statistics = [$nbrPoi, $nbrContributors, $nbrCities, $nbrCategories, $nbrStroll];

header("Content-Type: Application/json");
echo $json = json_encode($statistics);