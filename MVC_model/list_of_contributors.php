<?php

function getContributors() {
    include('database_connexion.php');
    
    $statement = $pdo->prepare("
        SELECT 
            id,
            first_name,
            last_name,
            CONCAT(first_name, ' ', last_name) AS name, 
            email,
            login,
            password,
            rights
        FROM contributors
    ");
    $statement->execute();
    $users = $statement->fetchAll(PDO::FETCH_ASSOC);
    
    $pdo = null;
    
    return $users;
}

function getContributorsById($userId) {
    include('database_connexion.php');

    $statement = $pdo->prepare("
        SELECT 
           c.first_name,
           c.last_name,
           c.email,
           c.login,
           c.number_of_posts,
           COUNT(s.traveler_id) AS number_of_strolls
        FROM contributors AS c
        INNER JOIN strolls AS s ON s.traveler_id = c.id
        WHERE c.id = ?;
    ");
    $statement->execute(array($userId));
    $users = $statement->fetchAll(PDO::FETCH_ASSOC);
    
    $pdo = null;
    
    return $users;
}