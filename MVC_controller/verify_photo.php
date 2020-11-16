<?php

if (isset($_FILES['img']) && ($_FILES['img']['error'] == 0)) {
    $infosfichier = pathinfo(htmlspecialchars($_FILES['img']['name']));

    $extension_upload = $infosfichier['extension'];

    $extensions_autorisees = array('jpg', 'jpeg', 'gif', 'png');
    
    if (in_array($extension_upload, $extensions_autorisees)) {
        $name = uniqid();
        
        $fileDestination = 'uploads/'.$name.'.'.$extension_upload;

        move_uploaded_file(
            htmlspecialchars($_FILES['img']['tmp_name']), 
            '../' . $fileDestination
        );
    } else {
        $errorMessage = 'Erreur: avez-vous vérifié que la photo est au bon format (jpg, jpeg, gif ou png) ?';
        array_push($errors, $errorMessage);
        $_SESSION['errors'] = $errors;
    }  
} else if (isset($_FILES['img']) && ($_FILES['img']['error'] == 2)) {
    $errorMessage = 'Erreur: avez-vous vérifié que la photo respecte la taille maximum autorisée (1MB) ?';
    array_push($errors, $errorMessage);
    $_SESSION['errors'] = $errors;
} else {
    $errorMessage = 'Erreur : votre photo n\'a pas été enregistrée.';
    array_push($errors, $errorMessage);
    $_SESSION['errors'] = $errors;
}