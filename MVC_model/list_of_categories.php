<?php 

function getCategories() {
    include('database_connexion.php');
    
    $statement = $pdo->prepare("
        SELECT DISTINCT name, id 
        FROM categories 
        ORDER BY name;
    ");
    $statement->execute();
    $categories = $statement->fetchAll(PDO::FETCH_ASSOC);
    
    $pdo = null;
    
    return $categories;
}