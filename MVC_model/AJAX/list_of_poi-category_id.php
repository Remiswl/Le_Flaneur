<?php

$category_id_to_compare = intval(htmlspecialchars($_POST['id']));

include('../database_connexion.php');

$statement = $pdo->prepare("
    SELECT COUNT(*)
    FROM points_of_interest
    WHERE category_id = ?;
");
$statement->execute(array($category_id_to_compare));
$allPois = $statement->fetchAll(PDO::FETCH_ASSOC);

$pdo = null;

header("Content-Type: Application/json");
echo $json = json_encode($allPois);