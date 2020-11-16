<?php

$city_id = htmlspecialchars($_POST['cityId']);

include('../database_connexion.php');

$statement = $pdo->prepare("
    SELECT id, name, zipcode, latitude, longitude 
    FROM cities 
    WHERE id = ?;
");
$statement->execute(array($city_id));
$city = $statement->fetch(PDO::FETCH_ASSOC);

$pdo = null;

header("Content-Type: Application/json");
echo $json = json_encode($city);