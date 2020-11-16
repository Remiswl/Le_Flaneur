<?php

if(session_id() == '') {
    session_start();
}

if (
    (!empty($_SESSION) && (
        ($_SESSION['rights'] == 'admin') || 
        ($_SESSION['rights'] == 'visitor'))
    )
){
    require('../MVC_model/list_of_categories.php');
    $categories = getCategories();

    require('../MVC_view/insert_poi.phtml');
} else {
    header('Location: ../index.php');
}