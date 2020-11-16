<?php

session_start();

require('../MVC_model/list_of_cities.php');
$cities = getCities();

require('../MVC_view/around_me.phtml');