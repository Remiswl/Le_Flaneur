# Le Flaneur/The Stroller - Tours generator

## Introduction
Welcome to Le Flâneur's website that will allow you to discover a city through two options:
* generate a trip based on a departure and an arrival address. The site will generate trips so that you can visit a maximum of points of interest
* either display the points of interest around your address or in your city

These two main functions are freely accessible.

However, once registered, the user will be able to:
* manage his data (add, modify, delete)
* submit points of interest
* consult his trip history
* delete his account

Finally, only administrators have access to the admin page, and will be able to:
* consult the website's statistics
* view the messages send from the 'Contact us' page
* edit and delete points of interest
* manage categories (modification / deletion)
* manage user rights (visitor / admin)
* delete a user

The site was made to end my training in 3W Academy and get my Certification as Web developper.

## Technologies
* Front-end: __HTML5__, __CSS3__, __JavaScript ES6__
* Back-end: __PHP7__, __SQL__
* API: __Leaflet__
* Mapping: __Mapbox__, __OpenStreetMap__

## Launch
To launch the site, open 'index.php'.

To run the site, you will have to enter:
1. a Mapbox' access token in 'JS/access_token.js'
2. the server's data in 'MVC_model/database_connexion.js'

## Comments
* the website is responsive (mobile first)
* it is conform to the W3C standards
* it uses an __MVC model__ 

### Possible improvments
* its comments are currently all in French
* for the moment, only French cities are available
* addresses search tool could be improved
