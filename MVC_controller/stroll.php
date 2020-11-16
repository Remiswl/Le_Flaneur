<?php

session_start();

require('../MVC_model/list_of_cities.php');
$cities = getCities();

require('../MVC_view/stroll.phtml');