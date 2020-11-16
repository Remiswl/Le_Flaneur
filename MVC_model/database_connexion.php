<?php

try {
    $pdo = new PDO(
        'mysql:host=***:3307;dbname=***',
        '***',
        '***',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
}
catch(Exception $e) {
    die('Erreur : '.$e->getMessage());
}

$pdo->exec('set names utf8');