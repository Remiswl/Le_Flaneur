<?php

session_start();

if ((!empty($_SESSION)) && ($_SESSION['rights'] == 'admin')){
    
    $idToModify = htmlspecialchars($_GET['id']);
    
    // Récupération de la liste des catégories
    require('../MVC_model/list_of_categories.php');
    $categories = getCategories();
    
    // Récupération des données du POI
    require('../MVC_model/list_of_poi.php');
    $POIData = getPoiById($idToModify);
    
    require('../MVC_view/update_poi.phtml');
} else {
    header('Location: index.php');
}