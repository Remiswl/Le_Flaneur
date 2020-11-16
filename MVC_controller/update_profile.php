<?php

session_start();

include ('verify_forms.php');

$newFirstName = htmlspecialchars($_POST['first_name']);
$newLastName = htmlspecialchars($_POST['last_name']);
$newEmail = htmlspecialchars($_POST['email']);
$newLogin = htmlspecialchars($_POST['login']);
$newPassword = htmlspecialchars($_POST['newPassword']);
$newPasswordConfirmation = htmlspecialchars($_POST['newPasswordConfirmation']);

$idToModify = $_SESSION['id'];

// Vérifier si l'email n'est pas déjà enregistré
require('../MVC_model/list_of_contributors.php');
$isEmailLoginExists = getContributors();

for ($index = 0; $index < sizeof($isEmailLoginExists); $index++) {
    if(
        (!empty($email)) && 
        ($email == $isEmailLoginExists[$index]['email']) && 
        ($_SESSION['id'] != $isEmailLoginExists[$index]['id'])
    ){
        array_push($errors, 'L\'email est déjà enregistré.');
    } else if (
        (!empty($login)) && 
        ($login == $isEmailLoginExists[$index]['login']) && 
        ($_SESSION['login'] != $isEmailLoginExists[$index]['login'])
    ){
        array_push($errors, 'Le login est déjà enregistré.');
    }     
}

// Si toutes les champs (password en option) sont remplies 
// et correspondent aux patterns
// et que l'email et le login ne sont pas déjà pris
// Alors on peut prendre en compte les modifications
if (isset($_SESSION['errors'])) {
    unset($_SESSION['errors']);
}

// S'il y a des erreurs
if(count($errors) !== 0) {
    $_SESSION['errors'] = $errors;
    header('Location: ../MVC_controller/my_profile.php');
} else {
    include('../MVC_model/update_contributor.php');
    header('Location: ../MVC_controller/my_profile.php');
}