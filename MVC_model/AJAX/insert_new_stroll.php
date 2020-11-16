<?php

session_start ();

if(isset($_SESSION['id'])) {
    $travelerId = $_SESSION['id'];
}

$city_id = htmlspecialchars($_POST['city_id']);
$start_address = htmlspecialchars($_POST['start_address']);
$arrival_address = htmlspecialchars($_POST['arrival_address']);
$start_point_latitude = htmlspecialchars($_POST['start_point_latitude']);
$start_point_longitude = htmlspecialchars($_POST['start_point_longitude']);
$arrival_point_latitude = htmlspecialchars($_POST['arrival_point_latitude']);
$arrival_point_longitude = htmlspecialchars($_POST['arrival_point_longitude']);

include('../database_connexion.php');

$statement = $pdo->prepare("
    INSERT INTO strolls (
        city_id,
        start_address,
        start_point_latitude,
        start_point_longitude,
        arrival_address,
        arrival_point_latitude,
        arrival_point_longitude,
        traveler_id
    )
    VALUES ( 
        :city_id,
        :start_address,
        :start_point_latitude,
        :start_point_longitude,
        :arrival_address,
        :arrival_point_latitude,
        :arrival_point_longitude,
        :traveler_id
    );
");

$statement->execute(array(
    'city_id' => $city_id,
    'start_address' => $start_address,
    'start_point_latitude' => $start_point_latitude,
    'start_point_longitude' => $start_point_longitude,
    'arrival_address' => $arrival_address,
    'arrival_point_latitude' => $arrival_point_latitude,
    'arrival_point_longitude' => $arrival_point_longitude,
    'traveler_id' => $travelerId
));

$statement->execute(array($contributor_id));

$pdo = null;