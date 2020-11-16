<?php

$idToDelete = intval(htmlspecialchars($_POST['users']));

include('../database_connexion.php');

// Supprimer l'utilsateur mais pas les POI qu'il a proposé
$statement = $pdo->prepare("
    DELETE FROM contributors 
    WHERE id = ?;
");
$statement->execute(array($idToDelete));

$pdo = null;

header('Location: ../../MVC_view/admin.phtml');