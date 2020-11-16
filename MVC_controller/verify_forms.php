<?php

/* Vérification de chacun des champs transmis par l'utilisateur 
Valable pour les pages 
    - registration.php
    - contact_us.php
    - update_contributor.php 
*/

$errors = [];

$pattern_name = '#^[a-zA-ZÀ-ú\-\s\']{3,30}+$#';
$pattern_password = '#^(?=.*[A-Z])[0-9A-Za-z\'!\#\$%&@?.\-_]{10,}$#';

if(isset($_POST['message'])) {
    $message = htmlspecialchars($_POST['message']);
    
    if(empty($message)){
        $errorMessage = 'Le champ Message est requis.';
        array_push($errors, $errorMessage);
    }
}

if(isset($_POST['first_name'])) {
    $first_name = htmlspecialchars(ucfirst($_POST['first_name']));
    
    if(empty($first_name)){
        $errorMessage = 'Le champ Prénom est requis.';
        array_push($errors, $errorMessage);
    }
    
    if ((!empty($first_name)) && (preg_match($pattern_name, $first_name) == 0)){
        $errorMessage = 'Le champ Prénom ne peut contenir que des lettres, des tirets ou des espaces.';
        array_push($errors, $errorMessage);
    }
}

if(isset($_POST['last_name'])) {
    $last_name = htmlspecialchars(ucfirst($_POST['last_name']));
    
    if(empty($last_name)){
        $errorMessage = 'Le champ Nom est requis.';
        array_push($errors, $errorMessage);
    }
    
    if ((!empty($last_name)) && (preg_match($pattern_name, $last_name) == 0)){
        $errorMessage = 'Le champ Nom ne peut contenir que des lettres, des tirets ou des espaces.';
        array_push($errors, $errorMessage);
    }
}

if(isset($_POST['name'])) {
    $name = htmlspecialchars($_POST['name']);
    
    if(empty($name)){
        $errorMessage = 'Le champ Nom est requis.';
        array_push($errors, $errorMessage);
    }
}

if(isset($_POST['email'])) {
    $email = htmlspecialchars($_POST['email']);
    
    if(empty($email)){
        $errorMessage = 'Le champ E-mail est requis.';
        array_push($errors, $errorMessage);
    }
    
    if(
        (!empty($email)) && 
        (filter_var($email, FILTER_VALIDATE_EMAIL) == false)
    ) {
        $errorMessage = 'Le format de l\'email n\'est pas valide.';
        array_push($errors, $errorMessage);
    }
}

if(isset($_POST['login'])) {
    $login = htmlspecialchars($_POST['login']);
    
    if(empty($login)){
        $errorMessage = 'Le champ Login est requis.';
        array_push($errors, $errorMessage);
    }
}

if(isset($_POST['password'])) {
    $password = password_hash(
        htmlspecialchars($_POST['password']), 
        PASSWORD_BCRYPT
    );
    
    if(empty($password)){
        $errorMessage = 'Le champ Mot de passe est requis.';
        array_push($errors, $errorMessage);
    }
    
    if(!empty($password) && (strlen($_POST['password']) < 10)) {
        $errorMessage = 'Le mot de passe doit contenir au moins 10 caractères et au moins une majuscule.';
        array_push($errors, $errorMessage);
    }
    
    if(
        (!empty($password) && 
        (strlen($_POST['password']) >= 10) && 
        (preg_match($pattern_password, $_POST['password'])) == 0)
    ) {
        $errorMessage = 'Le mot de passe doit contenir au moins une majuscule.';
        array_push($errors, $errorMessage); 
    }
}

if(isset($_POST['passwordConfirmation'])) {
    $passwordConfirmation = htmlspecialchars($_POST['passwordConfirmation']);
    
    if(empty($passwordConfirmation)){
        $errorMessage = 'Vous devez confirmer votre mot de passe.';
        array_push($errors, $errorMessage);
    }
    
    if(
        (!empty($passwordConfirmation)) && 
        (!empty($passwordConfirmation)) && 
        ($passwordConfirmation !== $_POST['password'])
    ){
        $errorMessage = 'Les deux mots de passe ne sont pas identiques.';
        array_push($errors, $errorMessage);
    }
}

// Mise à jour du mot de passe (my_profile)
if((isset($_POST['newPassword'])) && (isset($_POST['newPasswordConfirmation']))) {
    $newPassword = htmlspecialchars($_POST['newPassword']);
    $newPasswordConfirmation = htmlspecialchars($_POST['newPasswordConfirmation']);
    
    if(!empty($newPassword) && (strlen($newPassword) < 10)) {
        $errorMessage = 'Le mot de passe doit contenir au moins 10 caractères et au moins une majuscule.';
        array_push($errors, $errorMessage);
    }
    
    if(
        (!empty($newPassword) && 
        (strlen($newPassword) >= 10) && 
        (preg_match($pattern_password, $newPassword)) == 0)
    ) {
        $errorMessage = 'Le mot de passe doit contenir au moins une majuscule.';
        array_push($errors, $errorMessage); 
    }

    if(
        (!empty($newPassword)) && (empty($newPasswordConfirmation)) ||
        (empty($newPassword)) && (!empty($newPasswordConfirmation))
    ){
        $errorMessage = 'Vous devez remplir les cases \'Nouveau mot de passe\' et \'Confirmez le nouveau mot de passe\'.';
        array_push($errors, $errorMessage);
    }
    
    if(
        (!empty($newPasswordConfirmation)) && 
        (!empty($newPassword)) && 
        ($newPasswordConfirmation != $newPassword)
    ){
        $errorMessage = 'Les deux mots de passe ne sont pas identiques.';
        array_push($errors, $errorMessage);
    }
}