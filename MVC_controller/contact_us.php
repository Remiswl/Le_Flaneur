<?php

include ('verify_forms.php');

if(count($errors) !== 0) {
    include('../MVC_view/contact_us.phtml');
} else {
    include('../MVC_model/insert_new_message.php');
    
    header('Location: ../MVC_view/success_message.phtml');
}