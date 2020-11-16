<?php

$idToDelete = intval(htmlspecialchars($_POST['id']));

include('../database_connexion.php');

$statement = $pdo->prepare("
    DELETE FROM categories 
    WHERE id = ?;
");
$statement->execute(array($idToDelete));

$pdo = null;

header('Location: ../../MVC_view/admin.phtml');