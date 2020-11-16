<?php 

if(session_id() == '') {
    session_start();
}

if (!empty($_SESSION)){
    $userId = $_SESSION['id'];
    
    // Récupération des infos du user
    require('../MVC_model/list_of_contributors.php');
    $users = getContributorsById($userId);

    // Récupération de l'historique des trajets du user
    require('../MVC_model/list_of_strolls.php');
    $userStrolls = getStrollsByUserId($userId);

    require('../MVC_view/my_profile.phtml');
} else {
    header('Location: ../index.php');
}