<?php

function getStrollsByUserId($userId) {
    include('database_connexion.php');
    
    $statement = $pdo->prepare("
        SELECT
            s.start_address,
            s.arrival_address,
            DATE_FORMAT(s.stroll_date, '%d %M %Y') AS date
        FROM strolls AS s
        WHERE traveler_id = ?
        ORDER BY s.stroll_date DESC
        LIMIT 30;
    ");
    $statement->execute(array($userId));
    $userStrolls = $statement->fetchAll(PDO::FETCH_ASSOC);

    $pdo = null;
    
    return $userStrolls;
}