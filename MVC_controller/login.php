<?php

$login = htmlspecialchars($_POST['login']);
$password = htmlspecialchars($_POST['password']);

$errors = [];

if(empty($login)){
    array_push($errors, 'Le champ Login est requis.');
}

if(empty($password)){
    array_push($errors, 'Le champ Mot de passe est requis.');
}

// Si le visiteur a bien entré un login et un mot de passe...
if(count($errors) !== 0) {
    include('../MVC_view/login.phtml');
} else {
    // ... on ouvre la BDD pour consulter les clés login/password
    require('../MVC_model/list_of_contributors.php');
    $connexion = getContributors();
    
    $checkPaire = [];
    
    // Pour chacune des paires login/password de la BDD
    for ($index = 0; $index < sizeof($connexion); $index++) {
        // Si la paire entrée correspond à une des paires de la BDD: 
        if(
            ($login == $connexion[$index]['login']) && 
            (password_verify($password, $connexion[$index]['password']))
        ) {
            array_push($checkPaire, 'paireFound');
            // On démarre la session
    		session_start ();

    		// On enregistre les paramètres du visiteur comme variables de session
        	$_SESSION['id'] = $connexion[$index]['id'];
        	$_SESSION['first_name'] = $connexion[$index]['first_name'];
        	$_SESSION['last_name'] = $connexion[$index]['last_name'];
        	$_SESSION['email'] = $connexion[$index]['email'];
        	$_SESSION['login'] = $login;
        	$_SESSION['rights'] = $connexion[$index]['rights'];
        	$_SESSION['logged_in'] = true;
            
            // créer un cookie pour 6 heures
            $cookie_name = 'isLoggedIn';
            setcookie($cookie_name, '', time() - 3600);
            setcookie($cookie_name, 'true', time() + (6 * 3600 * 30), '/');
            
            if ($_SESSION['rights'] == 'admin') {
        	    header('Location: ../MVC_view/admin.phtml');
            } else {
                header('Location: ../index.php');
            }
        }
    }
    
    // Si, à la fin de la boucle, aucune paire n'est trouvée :
    if (count($checkPaire) == 0) {
        array_push($errors, 'Le login ou le mot de passe sont incorrects.');
        include('../MVC_view/login.phtml');
    }
}; 