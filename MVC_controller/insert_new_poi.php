<?php

session_start ();

$errors = [];

$title = htmlspecialchars(ucfirst($_POST['newTitle']));
$description = htmlspecialchars($_POST['newDescription']);
$description = nl2br($description);
$website = htmlspecialchars($_POST['newWebsite']);
$address = htmlspecialchars($_POST['selectedNumberStreet']);
$zipcode = htmlspecialchars($_POST['selectedZipcode']);
$city = htmlspecialchars($_POST['selectedCity']);
$lat = floatval(htmlspecialchars($_POST['selectedLat'])); 
$long = floatval(htmlspecialchars($_POST['selectedLong']));
$cityLat = floatval(htmlspecialchars($_POST['selectedCityLat']));
$cityLong = floatval(htmlspecialchars($_POST['selectedCityLong']));
$category_id = htmlspecialchars(ucfirst($_POST['category']));
$contributor_id = intval($_SESSION['id']);

if (isset($_SESSION['errors'])) {
    unset($_SESSION['errors']);
}

// Seul le site internet n'est pas obligatoire
if (
    empty($title) ||
    empty($description) ||
    empty($address) ||
    empty($zipcode) ||
    empty($city) ||
    empty($lat) ||
    empty($long) ||
    empty($cityLat) ||
    empty($cityLong)
) {
    array_push($errors, 'Veuillez compléter tous les champs.');
}

// Si la checkbox concernant les droits de la photo n'a pas été validée 
if(!isset($_POST['copyright'])) {
    $errorMessage = 'Veuillez confirmer que la photo est libre de droits.';
    array_push($errors, $errorMessage);
}

// Si aucune photo n'a été choisie
if($_FILES['img'] == '') {
    array_push($errors, 'Veuillez sélectionner une photo.');
}

// Si aucune catégorie n'a été choisi
if(htmlspecialchars($_POST['category']) == 'chooseCategory') {
    array_push($errors, 'Veuillez sélectionner une catégorie.');
}

// Si l'url du site internet n'a pas le bon format
if((!empty($website)) && (substr($website, 0, 4) !== 'http')) {
    $errorMessage = 'L\'url proposée n\'a pas le bon format. ex: http://www.monsite.fr';
    array_push($errors, $errorMessage);
}

// Gestion de l'image
include('verify_photo.php');
    
if(count($errors) !== 0) {
    $_SESSION['errors'] = $errors;
    header('Location: ../MVC_controller/insert_poi.php');
} else {
    include('../MVC_model/insert_new_poi.php');
    header('Location: ../MVC_view/success_insert_poi.phtml'); 
}