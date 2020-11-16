<?php

include ('verify_forms.php');

// Vérifier si l'email n'est pas déjà enregistré
require('../MVC_model/list_of_contributors.php');
$isEmailLoginExists = getContributors();

for ($index = 0; $index < sizeof($isEmailLoginExists); $index++) {
    if(
        (!empty($email)) && 
        ($email == $isEmailLoginExists[$index]['email'])
    ){
        array_push($errors, 'L\'email est déjà enregistré.');
    } else if (
        (!empty($login)) && 
        ($login == $isEmailLoginExists[$index]['login'])
    ){
        array_push($errors, 'Le login est déjà enregistré.');
    }     
}

if(count($errors) !== 0) {
    include('../MVC_view/registration.phtml');
} else {
// Insersion des informations dans la BDD et connexion
    include('../MVC_model/insert_new_contributor.php');
    
	session_start ();

	$_SESSION['id'] = $userData['id'];
	$_SESSION['first_name'] = $userData['first_name'];
	$_SESSION['last_name'] = $userData['last_name'];
	$_SESSION['email'] = $userData['email'];
	$_SESSION['login'] = $userData['login'];
	$_SESSION['rights'] = $userData['rights'];
	$_SESSION['logged_in'] = true;
    
    // créer un cookie pour 6 heures
    $cookie_name = 'isLoggedIn';
    $nbrHours = 6;
    setcookie($cookie_name, '', time() - 3600);
    setcookie($cookie_name, 'true', time() + ($nbrHours * 3600 * 30), "/");

    header('Location: ../MVC_view/success_registration.phtml');
}