'use strict';

import {
    displayCards, 
    getDistance,
    manageLikes,
    readCookies
} from './cards.js'; 

import {
    displayCityInput
} from './poi.js'; 

import { 
    access_token
} from './access_token.js';


let latitude;
let longitude;
let mymap;
let allMarkers;
let marker;
let positionMarker;
let listOfMarkers;
let markerPosition;
let markersToDisplay = [];
let selectACity = document.getElementById('selectACity');
let cards = document.getElementById('cards');
let newZipcode = document.getElementById('newZipcode');


// Géolocalisation
function askForGeopositioning() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function success(position) {
                latitude = parseFloat(position.coords['latitude']);
                longitude = parseFloat(position.coords['longitude']);
                
                // Si pertinent:
                // Pour récupérer les cards correspondants 
                // à la ville géolocalisée
                if (cards != null) {
                    getCityZipcodeFromCoords(latitude, longitude);
                }
            }
        );
    } else {
        window.alert('La géolocation n\'est pas supportée sur votre apparaeil');
    }
}
    
// A partir des coordonnées de la position, on récupére le zipcode de la ville
// Envoyer les coordonnées à l'API mapbox
function getCityZipcodeFromCoords(latitude, longitude){
    let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    url += longitude + ',' + latitude;
    url += '.json?types=postcode&';
    url += 'access_token=' + access_token;
    $.get(url, importCityZipcode);
}

function importCityZipcode(data) {
    // On récupère le zipcode de la ville 
    // en fonction des coordonnées de géolocalisation
    let cityZipcode = parseInt(data['features'][0]['text'], 10);
    // A partir du zipcode, on récupère le City Id
    // Puis on l'envoie dans la BDD pour récupérer les POI de la ville 
    let selectedCityZipCode = { cityZipcode : cityZipcode };
    let url = '../MVC_model/AJAX/list_of_cities-zipcode.php';
    $.post(url, selectedCityZipCode, getPOIFromCityId);
}

// A partir du City ID, on récupère les POI
function getPOIFromCityId (data) {
    // Si les data retourne 'false'
    // Alors la ville n'est pas dans la BDD
    // Si l'utilisateur est connecté, lui proposer de créer un POI
    readCookies();
    
    let selectedZipcode = document.getElementById('selectedZipcode');
    
    if (
        (data == false) && 
        (selectedZipcode.value !== '') && 
        (readCookies() == 'true')
    ) {
        let message = window.alert('Aucun point d\'intérêt n\'a été ' +
            'identifié à proximité de votre adresse. ' +
            'Voulez-vous en proposer un ?');  
        if (message == true) {
            document.location.href = 
                'https://remis00.sites.3wa.io/Alpha_project/ ' +
                'MVC_controller/insert_poi.php';
        }
    }
    // Si l'utilisateur n'est pas connecté, 
    // alors lui demander d'entrer une nouvelle adresse
    else if (
        (data == false) && 
        (selectedZipcode.value !== '') && 
        (readCookies() == 'false')
    ) {
        window.alert('Aucun point d\'intérêt n\'a été ' +
            'identifié à proximité de votre adresse. ' +
            'Veuillez entrer une autre adresse.');  
    }
    // ou si la géolocalisation renvoie à une ville non répertoriée
    else if ((data == false) && (newZipcode.value == '')) {
        window.alert(
            'Vous n\'avez pas été géolocalisé ' +
            'dans une des villes répertoriées. ' +
            'Veuillez entrer une adresse.');  
    }
    
    // Si on passe par la géolocalisation, alors tout va bien
    // Mais si on a rentré une adresse, 
    // alors on n'a plus les coordonnées de l'adresse
    // Il faut donc les redéfinir
    if(
        (document.getElementById('selectedLat').value != '') && 
        (document.getElementById('selectedLong').value != '')
    ){
        latitude = parseFloat(document.getElementById('selectedLat').value, 10);
        longitude = parseFloat(document.getElementById('selectedLong').value, 10);
    }
    
    let id = data['id'];
    // On envoie le city ID dans la BDD pour récupérer les POI de la ville
    let selectedCityId = {id : id};
    let url = '../MVC_model/AJAX/list_of_poi-city_id.php';
    $.post(url, selectedCityId, displayPOIOfSelectedCity);
} 

function displayPOIOfSelectedCity(pois) {
    cards.innerHTML = '';
    markersToDisplay = [];
    for (let poi of pois) {
        markersToDisplay.push(displayCards(poi));
    }
    
    // Gestion des likes
    manageLikes();
    
    // Une fois qu'on a les POI, on affiche la carte
    displayMap(latitude, longitude);
}

// A partir des coordonnées (de la ville, de la position ou de l'adresse), 
// on affiche la carte 
function displayMap(latitude, longitude) {
    // Si la carte est créée pour la première fois
    if (mymap == null) {
        mymap = L.map('map').setView([latitude, longitude], 45);
                
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?' + 
        'access_token=' + access_token, {
            attribution: 
                'Map data &copy; <a href="https://www.openstreetmap.org/">' +
                'OpenStreetMap</a> contributors, <a href="https://' +
                'creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 17,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: access_token 
        }).addTo(mymap);
        
        showMarkers(mymap, latitude, longitude);
    } 
    // Si la carte est juste mise à jour
    else {
        // Effacer le marker de la position
        mymap.removeLayer(positionMarker);
        
        // Effacer le marqueur de la position précédente
        mymap.removeLayer(allMarkers);
        
        // générer une nouvelle carte
        mymap.panTo([latitude, longitude]); 
        marker.setLatLng([latitude, longitude]);
        showMarkers(mymap, latitude, longitude);
    }
}

// A partir des coordonnées (de la ville, de la position ou de l'adresse), 
// on calcule les distances à la position
function showMarkers(mymap, latitude, longitude) {
    listOfMarkers = [];

    // Afficher le marqueur correspondant à la position de l'utilisateur
    let myPosition = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/' +
            'leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/' +
            'leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
            
    positionMarker = L.marker(
        [latitude, longitude], 
        {icon: myPosition}
    );
    positionMarker.addTo(mymap);
    positionMarker.bindPopup('Ma position');

    // Afficher les marqueurs des POI autour de l'utilisateur
    for (let i = 0; i < markersToDisplay.length; i++) {
		marker = new L.marker([markersToDisplay[i][1],markersToDisplay[i][2]]);
        marker.bindPopup('<p>' + markersToDisplay[i][0] + '</p>' 
            + '<img src="../' + markersToDisplay[i][3] 
            + '" class="markerIcon" alt="' + markersToDisplay[i][0] 
            + '"/><p>' + markersToDisplay[i][5] + '</p>');
        
		// Calculer la distance entre chacun des POI 
		// et la position de l'utilisateur (ou de la position de la ville)
		markerPosition = [markersToDisplay[i][1],markersToDisplay[i][2]];
		// Puis afficher les distances
		let distance = parseInt(
		    getDistance([latitude, longitude], markerPosition), 
		    10
		);
		let distanceArea = document.getElementsByClassName('distance')[i];
		if(distanceArea != null){
		    distanceArea.innerHTML = '<i class="fas fa-walking"></i>' + 
		        distance + 
		        ' m';
		}
		
		listOfMarkers.push(marker);
	}
	
	allMarkers = L.layerGroup(listOfMarkers);
	allMarkers.addTo(mymap);
}   

// On récupérer l'id de la ville quand l'utilisateur utilise le menu déroulant
function getCityCoords() {
    let selectedCityId = {cityId : selectACity.value};
    let url = '../MVC_model/AJAX/list_of_cities-id.php';
    $.post(url, selectedCityId, getCityPOI);
}

function getCityPOI(data) {
    latitude = parseFloat(data['latitude'], 10);
    longitude = parseFloat(data['longitude'], 10);
    let id = data['id'];
    let selectedCityId = {id : id};
    // On récupère le zipcode de la ville en fonction de l'id
    let url = '../MVC_model/AJAX/list_of_poi-city_id.php';
    $.post(url, selectedCityId, displayPOIOfSelectedCity);
} 

/*** Nouvelle recherche ***/
function resetSearch() {
    document.location.href = 'https://remis00.sites.3wa.io/Alpha_project/' +
        'MVC_controller/around_me.php'; 
}
    
/*** DOMContentLoaded ***/
document.addEventListener('DOMContentLoaded', function() {
    // On remet la class hide aux champs ville et adresse 
    // s'ils ont été retirés 
    // lorsque l'utilisateur est passé par la page 'Je participe'
    if (selectACity != null) {
        let cityUl = document.getElementById('hiddenCity');
        let addressUl = document.getElementById('hiddenAddress');
        
        cityUl.classList.add('hide');
        addressUl.classList.add('hide');
    }
    
    // Soit l'utilisateur permet la géolocalisation
    let aroundMe = document.getElementById('aroundMe');
    if (aroundMe != null) {
        askForGeopositioning();
    }
        
    // Soit il choisit une ville 
    if (selectACity != null) {
        selectACity.addEventListener('change', getCityCoords);
    }   
    
    // Soit il entre une adresse (autocompletion)
    if (newZipcode != null) {
         displayCityInput;
     }
    
    // Nouvelle recherche
    let newSearch = document.getElementById('newSearch');
    if (newSearch != null) {
        newSearch.addEventListener('click', resetSearch);
    }
});

/*** Exportation des fonctions ***/    
export { 
    getPOIFromCityId
};