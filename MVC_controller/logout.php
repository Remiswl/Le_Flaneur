<?php

session_start ();

session_destroy ();

$cookie_name = 'isLoggedIn';
setcookie($cookie_name, '', time() - 3600);
setcookie($cookie_name, 'false');

header ('location: ../index.php');