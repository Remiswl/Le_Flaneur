<?php

include('database_connexion.php');

// Si l'utilisateur choisi de ne pas modifier son mot de passe
// i.e il n'a rempli aucune des deux champs Password
if ((empty($newPassword) && empty($newPasswordConfirmation))) {
    $statement = $pdo->prepare("
        UPDATE contributors
        SET 
            first_name = ?, 
            last_name = ?,
            email = ?, 
            login = ?
        WHERE id = ?;
    ");
    
    $statement->execute(array(
        $newFirstName, 
        $newLastName,
        $newEmail, 
        $newLogin,
        $idToModify
    ));
} 
// Si au contraire il modifie son mot de passse
else if ((!empty($newPassword) && !empty($newPasswordConfirmation))) {
    $newPassword = password_hash($newPassword, PASSWORD_BCRYPT);
    
    $statement = $pdo->prepare("
        UPDATE contributors
        SET 
            first_name = ?, 
            last_name = ?,
            email = ?, 
            login = ?,
            password = ?
        WHERE id = ?;
    ");
    
    $statement->execute(array(
        $newFirstName, 
        $newLastName,
        $newEmail, 
        $newLogin,
        $newPassword,
        $idToModify
    ));
}

$pdo = null;