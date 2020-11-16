<?php

session_start();

$idToModify = [];
$newRights = [];
$errors = [];

foreach($_POST as $key => $value) {
    array_push($idToModify, $key);
    array_push($newRights, $value);
}

// Vérifier qu'il y ait au moins un administrateur
if (in_array('admin', $newRights) == false) {
    $errorMessage = 
        'Erreur: il faut au moins un administrateur. ' .
        'Les modifications n\'ont pas été prises en compte.';
    array_push($errors, $errorMessage);
}

if(count($errors) !== 0) {
     $_SESSION['errors'] = $errors;
     header('Location: ../../MVC_view/admin.phtml');
} else {
    for ($index = 0; $index < sizeof($_POST); $index++) {
        include('../database_connexion.php');
        
        $statement = $pdo->prepare("
            UPDATE contributors
            SET rights = ?
            WHERE id = ?;
        ");
        $statement->execute(array($newRights[$index], $idToModify[$index]));
        
        $pdo = null; 
        
        header('Location: ../../MVC_view/admin.phtml');
    }
}