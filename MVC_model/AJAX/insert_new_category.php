<?php

$newCategory = ucfirst(htmlspecialchars($_POST['newCat']));

include('../database_connexion.php');

$statement = $pdo->prepare("
    INSERT INTO categories (name) 
    VALUES (?);
");
$statement->execute(array($newCategory));

$pdo = null;