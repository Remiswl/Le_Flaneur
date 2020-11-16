<?php

session_start ();

$errors = [];

$idToModify = intval(htmlspecialchars($_POST['id']));
$title = htmlspecialchars(ucfirst($_POST['newTitle']));
$description = htmlspecialchars($_POST['newDescription']);
$website = htmlspecialchars($_POST['newWebsite']);
$address = htmlspecialchars($_POST['selectedNumberStreet']);
$zipcode = htmlspecialchars($_POST['selectedZipcode']);
$city = htmlspecialchars($_POST['selectedCity']);
$lat = floatval(htmlspecialchars($_POST['selectedLat']));
$long = floatval(htmlspecialchars($_POST['selectedLong']));
$cityLat = floatval(htmlspecialchars($_POST['selectedCityLat']));
$cityLong = floatval(htmlspecialchars($_POST['selectedCityLong']));
$category_id = intval(htmlspecialchars($_POST['category']));
$contributor_id = intval($_SESSION['id']);
    
// On commence par vider les éventuelles erreurs 
// qu'on aurait pu enregistrer auparavant
if (isset($_SESSION['errors'])) {
    unset($_SESSION['errors']);
}

// Si le titre et la description sont vides : 
if (empty($title) || empty($description)) {
    $errorMessage = 'Les champs Titre et Description ne peuvent pas être vides.';
    array_push($errors, $errorMessage);
}

// Si l'adresse est vide
if (
    empty(htmlspecialchars($_POST['address'])) && 
    empty(htmlspecialchars($_POST['newAddress']))
) {
    array_push($errors, 'Veuillez entrer une adresse valide.');
}

// Si l'url du site internet n'a pas le bon format
if((!empty($website)) && (substr($website, 0, 4) !== 'http')) {
    $errorMessage = 'L\'url proposée n\'a pas le bon format. ex: http://www.monsite.fr';
    array_push($errors, $errorMessage);
}

// Gestion de la nouvelle image
// Si l'utilisateur n'a pas sélectionné une nouvelle image (i.e. error = 4)
// Alors on récupère le nom du fichier déjà enregistré
// Sinon on enregistre la nouvelle image
if (isset($_FILES['img']) && ($_FILES['img']['error'] == 4)) {
    $fileDestination = htmlspecialchars($_POST['registeredPhoto']);
} else {
    include('verify_photo.php');
}

// Si la photo a été modifiée (i.e. un nom d'image a été envoyée à PHP) 
// mais que la checkbox n'a pas été validée 
if(
    ($_FILES['img']['error'] != 4) && 
    (!isset($_POST['copyright']))
) {
    $errorMessage = 'Veuillez confirmer que la nouvelle photo est libre de droits.';
    array_push($errors, $errorMessage);
}

if(count($errors) !== 0) {
    $_SESSION['errors'] = $errors;
    header('Location: ../MVC_controller/update_poi.php?id=' . $_POST['id']);
} else {
    include('../MVC_model/update_poi.php');
    header('Location: ../MVC_view/admin.phtml'); 
}