<?php

session_start();

$contributor_id = $_SESSION['id'];
$point_of_interest_id = $_POST['POI'];

// Commençons par vérifier si le visiteur n'a pas déjà voté
// On récupère la liste des POI likés par l'utilisateur
include('../database_connexion.php');
    
$statement = $pdo->prepare("
    SELECT point_of_interest_id 
    FROM likes 
    WHERE contributor_id = ?
;");
$statement->execute(array($contributor_id));
$likesrecorder = $statement->fetchAll(PDO::FETCH_ASSOC);

$pdo = null;

$checkPaire = [];

for ($index = 0; $index < sizeof($likesrecorder); $index++) {
    if ($likesrecorder[$index]['point_of_interest_id'] == $point_of_interest_id) {
        array_push($checkPaire, 'paireFound');
    }        
}

// Si c'est le cas, l'utilisateur ne peut plus revoter;
if(sizeof($checkPaire) != 0) {
    $answer=['already liked', 0];
}
// Si ce n'est pas le cas...
else {
    include('../database_connexion.php');
    
    // ...augmenter le nombre de likes de 1 dans la table POI...
    $statement = $pdo->prepare("
        UPDATE points_of_interest
        SET likes = likes + 1
        WHERE id = ?;
    ");
    $statement->execute(array($point_of_interest_id));
    
    // ...et enregistrer le like dans la table Likes
    $statement = $pdo->prepare("
        INSERT INTO likes (contributor_id, point_of_interest_id)
        VALUES (?, ?);
    ");
    $statement->execute(array($contributor_id, $point_of_interest_id));
    
    $pdo = null;
    $answer = ['not already liked', $point_of_interest_id];
}

header("Content-Type: Application/json");
echo $json = json_encode($answer);