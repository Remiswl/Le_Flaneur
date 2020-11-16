'use strict';

import {
    displayCards,
    getDistance
} from './cards.js'; 

import { 
    access_token
} from './access_token.js';

let startCityLat;
let startCityLong;
let startDetails;
let arrivalDetails;
let start_address;
let arrival_address;
let selectedZipCode;
let routeStartPointLong;
let routeStartPointLat;
let strollDuration;
let strollDistance;
let markersToDisplay = [];
let strollData = {}; 
let startPointNewAddress = document.getElementById('startPointNewAddress');
let arrivalPointNewAddress = document.getElementById('arrivalPointNewAddress');
let selectACity = document.getElementById('selectACity');
let strollMap = document.getElementById('strollMap');
let strollInfo = document.getElementById('strollInfo');
let cards = document.getElementById('cards');
let JSerrors = document.getElementsByClassName('JSerrors');


/***  1. Choisir une ville ***/
// A partir du city_id, récupérer le zipcode et les coordonnées
function setCityIdToLocalStorage() {
    if(isNaN(selectACity.value) == false) {
        // vider le local storage 
        // (qui aurait pu rester lors de manipulation précédentes interrompues)
        localStorage.removeItem('strollCityData');
        localStorage.removeItem('strollStartData');
        localStorage.removeItem('strollArrivalData');
    
        let selectedCityId = {cityId : selectACity.value};
        let url = '../MVC_model/AJAX/list_of_cities-id.php';
        $.post(url, selectedCityId, getCityDetails);
    }
}

//Stocker toutes ces données dans le local storage
function getCityDetails(data) {
    startCityLat = parseFloat(data['latitude'], 10);
    startCityLong = parseFloat(data['longitude'], 10);
    
    let cityId = parseInt(selectACity.value, 10);
    let cityZipcode;
    
    for(let i = 0; i < selectACity.length; i++) {
        if(selectACity[i].value == selectACity.value) {
            cityZipcode = selectACity[i].getAttribute('data-zipcode');
        }
    }
    
    let userCityChoice = {
        city_id : cityId,
        city_zipcode : cityZipcode
    };
    
    let cityData = JSON.parse(localStorage.getItem('strollCityData')) || [];
    cityData.push(userCityChoice);
    localStorage.setItem('strollCityData', JSON.stringify(cityData));
    
    // On demande à l'utilisateur l'adresse de départ --> 2.
    let askForACity = document.getElementById('askForACity');
    askForACity.classList.add('hide');
    
    let startingPoint = document.getElementById('startingPoint');
    startingPoint.classList.remove('hide');
}

/***  2. Entrer une adresse de départ ***/
function displayStartCityInput() {
    let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    url += startPointNewAddress.value;
    url += '.json?autocomplete';
    url += '&limit=' + '25';
    url += '&country=' + 'FR';
    url += '&proximity=';
    url += startCityLong + ',' + startCityLat;
    url += '&access_token=' + access_token;
    $.get(url, askForStartAddress);
}

function askForStartAddress(data) {
    let list = [];
    selectedZipCode = JSON.parse(localStorage.getItem('strollCityData')); 
    
    for (let i = 0; i < data['features'].length; i++) {
        if(
            parseInt(data['features'][i]['context'][1]['text'], 10) == 
            selectedZipCode[0]['city_zipcode']
        ) {
            list.push(data['features'][i]['place_name']);
        }
    }
   
   $(function() {
        var availableTags = list;
        $('#startPointNewAddress').autocomplete({
            source: availableTags
        });
    });
    
    // Récupérer les infos de la ville
    let selectStartAddress = document.getElementById('selectStartAddress');
    selectStartAddress.addEventListener(
        'click', 
        displayStartingAddressDetails
    );
}

function displayStartingAddressDetails() {
    startDetails = startPointNewAddress.value;
    let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    url += startDetails;
    url += '.json?access_token=' + access_token;
    $.get(url, getStartAddressDetails);
}   

function getStartAddressDetails(data) {
    // Si l'utilisateur a entré une adresse de départ fantaisiste,
    // Alors renvoyer une erreur
        // Si Mapbox n'a trouvé aucune adresse...
    if (data['features'].length == 0) {
        JSerrors[0].innerHTML = 'Erreur : l\'adresse que vous avez entré ' +
            'n\'est pas reconnue';
    }
        // ...ou si Mapbox a trouvé des adresse 
        // en dehors de la ville recherchée...
    else if (
        parseInt(data['features'][0]['context'][1]['text'], 10) != 
        selectedZipCode[0]['city_zipcode']
    ) {
        JSerrors[0].innerHTML = 'Erreur : l\'adresse ne se trouve pas ' +
            'dans la ville sélectionnée.';
    }
        // ...ou si Mapbox a trouvé des adresse 
        // dont la 'relevance' est différente de 1
    else if (data['features'][0]['relevance'] != 1) {
        JSerrors[0].innerHTML = 'Erreur : l\'adresse que vous avez entré ' +
            'n\'est pas reconnue';
    } 
        // ... sinon on ajoute l'adresse au local storage
    else {
        let startPointLat = data['features'][0]['center'][1];
        let startPointLong = data['features'][0]['center'][0];
        // Ajouter les détails de l'adresse dans un objet
        // Ajouter l'objet dans le local storage
        let userStartChoice = {
            start_address : startDetails,
            start_point_latitude : startPointLat,
            start_point_longitude : startPointLong
        };
        
        let startData = 
            JSON.parse(localStorage.getItem('strollStartData')) || 
            [];
        startData.push(userStartChoice);
        localStorage.setItem('strollStartData', JSON.stringify(startData));
        
        JSerrors[0].innerHTML = '';
        
        // On demande à l'utilisateur l'adresse d'arrivée --> 3.
        let startingPoint = document.getElementById('startingPoint');
        startingPoint.classList.add('hide');
       
        let arrivalPoint = document.getElementById('arrivalPoint');
        arrivalPoint.classList.remove('hide');
    }
}

/***  3. Entrer une adresse d'arrivée ***/
function displayArrivalCityInput() { 
    let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    url += arrivalPointNewAddress.value;
    url += '.json?autocomplete';
    url += '&limit=' + '25';
    url += '&country=' + 'FR';
    url += '&proximity=';
    url += startCityLong + ',' + startCityLat;
    url += '&access_token=' + access_token; 
    $.get(url, askForArrivalAddress);
}

function askForArrivalAddress(data) {
    let list = [];
    let selectedZipCode = JSON.parse(localStorage.getItem('strollCityData')); 
    
    for (let i = 0; i < data['features'].length; i++) {
        if(
            parseInt(data['features'][i]['context'][1]['text'], 10) == 
            selectedZipCode[0]['city_zipcode']
        ) {
            list.push(data['features'][i]['place_name']);
        }
    }

   $(function() {
        var availableTags = list;
        $('#arrivalPointNewAddress').autocomplete({
            source: availableTags
        });
    });
    
    let confirmStroll = document.getElementById('confirmStroll');
    confirmStroll.addEventListener('click', displayArrivingAddressDetails);
}

function displayArrivingAddressDetails(e) {
    e.preventDefault();
    arrivalDetails = arrivalPointNewAddress.value;
    let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    url += arrivalDetails;
    url += '.json?access_token=' + access_token; 
    $.get(url, getArrivalAddressDetails);
}       
    
function getArrivalAddressDetails(data) {
    if (data['features'].length == 0) {
        JSerrors[0].innerHTML = 
            'Erreur : l\'adresse que vous avez entré n\'est pas reconnue';
    } else if (
        parseInt(data['features'][0]['context'][1]['text'], 10) != 
        selectedZipCode[0]['city_zipcode']
    ) {
        JSerrors[0].innerHTML = 'Erreur : l\'adresse ' +
            'ne se trouve pas dans la ville sélectionnée.';
    } else if (data['features'][0]['relevance'] != 1) {
        JSerrors[0].innerHTML = 'Erreur : l\'adresse ' +
            'que vous avez entré n\'est pas reconnue';
    } else {
        let arrivalPointLat = data['features'][0]['center'][1];
        let arrivalPointLong = data['features'][0]['center'][0];
    
        // Ajouter les détails de l'adresse d'arrivée dans un objet
        // puis ajouter l'objet dans le local storage
        let userArrivalChoice = {
            arrival_address : arrivalDetails,
            arrival_point_latitude : arrivalPointLat,
            arrival_point_longitude : arrivalPointLong
        };
        
        let arrivalInfo = 
            JSON.parse(localStorage.getItem('strollArrivalData')) || 
            [];
        arrivalInfo.push(userArrivalChoice);
        localStorage.setItem(
            'strollArrivalData', 
            JSON.stringify(arrivalInfo)
        );
        
        JSerrors[0].innerHTML = '';
        
        // c. ajouter les 3 partie du local storage dans la BDD
        let cityData = JSON.parse(localStorage.getItem('strollCityData'));
        let startData = JSON.parse(localStorage.getItem('strollStartData'));
        let arrivalData = JSON.parse(localStorage.getItem('strollArrivalData'));
        
        let city_id = cityData[0]['city_id'];
        start_address = startData[0]['start_address'];
        let start_point_latitude = startData[0]['start_point_latitude'];
        let start_point_longitude = startData[0]['start_point_longitude'];
        arrival_address = arrivalData[0]['arrival_address'];
        let arrival_point_latitude = arrivalData[0]['arrival_point_latitude'];
        let arrival_point_longitude = arrivalData[0]['arrival_point_longitude'];
        
        strollData = {
            city_id : city_id,
            start_address : start_address,
            start_point_latitude : start_point_latitude,
            start_point_longitude : start_point_longitude,
            arrival_address : arrival_address,
            arrival_point_latitude : arrival_point_latitude,
            arrival_point_longitude : arrival_point_longitude,
        };
        
        let url = '../MVC_model/AJAX/insert_new_stroll.php';
        $.post(url, strollData);

        // d. effacer le local storage
        localStorage.removeItem('strollCityData');
        localStorage.removeItem('strollStartData');
        localStorage.removeItem('strollArrivalData');
        
        // e. On masque le formulaire d'adresse d'arrivée
        let startingAndArrivalPoint = 
            document.getElementById('startingAndArrivalPoint');
        startingAndArrivalPoint.classList.add('hide');
       
        // f. afficher la carte et les POI
        strollMap.classList.remove('hide');
        strollInfo.classList.remove('hide');
        cards.classList.remove('hide');
        
        getPOIFromCityId(strollData);
    }
}

/***  4. afficher la carte ***/
// Récupérer les coordonnées des POI de la ville
function getPOIFromCityId (strollData) {
    let cityId = strollData['city_id'];
    let selectedCityId = {id : cityId};
    let url = '../MVC_model/AJAX/list_of_poi-city_id.php';
    $.post(url, selectedCityId, displayMap);
}

/*** 5. afficher les POI sur le trajet  ***/
function displayMap(pois){
    // Récupérer les POI
    // Mais ne garder que ceux contenu dans un rectangle virtuel 
    // délimité par le point de départ et le point d'arrivée
    let stopsCoord = [];
    
    // Définissons un rectangle virtuel 
    // dont les bords sont constitués des longitudes +/- paddingLong 
    // et latitude +/- paddingLat des points de départ et d'arrivée
    // Le POI doit se trouver à l'intérieur de ce rectangle
    let paddingLat = 0;
    let paddingLong = 0;
    
    let maxLatitude = Math.max(
        Math.abs(strollData['start_point_latitude'] + paddingLat), 
        Math.abs(strollData['arrival_point_latitude'] + paddingLat)
    );
    let minLatitude = Math.min(
        Math.abs(strollData['start_point_latitude'] - paddingLat), 
        Math.abs(strollData['arrival_point_latitude'] - paddingLat)
    );
    let maxLongitude = Math.max(
        Math.abs(strollData['start_point_longitude'] + paddingLong), 
        Math.abs(strollData['arrival_point_longitude'] + paddingLong)
    );
    let minLongitude = Math.min(
        Math.abs(strollData['start_point_longitude'] - paddingLong), 
        Math.abs(strollData['arrival_point_longitude'] - paddingLong)
    );
    
    // la latitude/longitude du POI doit être inférieure 
    // à la latitude/longitude la plus élevée (en valeur absolue)
    // entre le point de départ et le point d'arrivée
    // et supérieure à la latitude/longitude la plus basse (en valeur absolue)
    for (let poi of pois) {
        if(
            (parseFloat(poi['latitude']) < maxLatitude) &&
            (parseFloat(poi['latitude']) > minLatitude) &&
            (parseFloat(poi['longitude']) < maxLongitude) &&
            (parseFloat(poi['longitude']) > minLongitude)
        ) {
            stopsCoord.push([
                parseFloat(poi['longitude']), 
                parseFloat(poi['latitude'])
            ]);
            
            markersToDisplay.push(displayCards(poi));
        }
    }

    // si stopsCoord n'est pas vide,
    // i.e. il y a des POI dans le rectangle 
    // alors on met toutes ces coordonnées dans un tableau 
    // qui sera lisible par l'url générant le trajet
    let stops;
    let indexOfArrivalPoint;
    
    if (stopsCoord.length != 0) {
        stops = stopsCoord[0][0] + ',' + stopsCoord[0][1];
    
        for (let i = 1; i < stopsCoord.length ; i++) {
            stops += ';' + stopsCoord[i][0] + ',' + stopsCoord[i][1];
        }
        
        indexOfArrivalPoint = stopsCoord.length + 1 ;
    } 
    // sinon (i.e. il n'y a pas de POI dans le rectangle)
    // On prévient l'utilisateur 
    // et on met le point d'arrivée dans stops 
    // (pour ne pas rendre invalide l'url générant le trajet) 
    else {
        window.alert('Aucun point d\'intérêt ne se trouve sur votre trajet.'); 
        stops = strollData['arrival_point_longitude'] + ',';
        stops += strollData['arrival_point_latitude'];
        indexOfArrivalPoint = 2 ;
    }
    
    // Récupérer les données du trajet
    let startingPoint = [
        strollData['start_point_longitude'],
        strollData['start_point_latitude']
    ];
    let arrivalPoint = [
        strollData['arrival_point_longitude'],
        strollData['arrival_point_latitude']
    ];
    
    // Générer la carte (Mapbox Direction API) 
    strollMap = L.map('strollMap').setView(
        [startingPoint[1], 
        startingPoint[0]], 
        45
    );
    
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?' +
        'access_token=' + access_token, 
    {
        attribution: 'Map data &copy; <a href="https://' +
            'www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + 
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">' +
            'CC-BY-SA</a>, Imagery © ' +
            '<a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 17,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: access_token 
    }).addTo(strollMap);
    
    let profile = 'walking';
    let walking_speed_km_h = 4;
    let walking_speed_m_s = (walking_speed_km_h * 10)/36;
    
    // Générer le trajet
    let url = 'https://api.mapbox.com/directions/v5/mapbox/';
    url += profile + '/';
    url += startingPoint + ';' + stops + ';' + arrivalPoint;
    url += '?waypoints=0;';
    url += indexOfArrivalPoint;
    url += '&overview=full&geometries=geojson';
    url += '&access_token=' + access_token;
    url += '&walking_speed=' + walking_speed_m_s;
    $.get(url, getRoute);
}

function getRoute(data) {
    // Afficher le trajet
    L.geoJson(data.routes[0].geometry).addTo(strollMap);
    
    // Afficher le marqueur du point de départ
    displayStartMarker(data);

    // Afficher les marqueurs des POI qui se trouvent sur la trajet
    displayStopsMarkers(data, routeStartPointLong, routeStartPointLat);
	
	// Afficher le marqueur du point d'arrivée
    displayArrivalMarker(data);
	
	// Ajouter les adresses de départ et d'arrivée sous la carte
	let displayStrollStartAddress = document.createElement('div');
    displayStrollStartAddress.innerHTML = 
        'Adresse de départ : ' + start_address;
    strollInfo.appendChild(displayStrollStartAddress);
    
    let displayStrollArrivalAddress = document.createElement('div');
    displayStrollArrivalAddress.innerHTML = 
        'Adresse d\'arrivée : ' + arrival_address;
    strollInfo.appendChild(displayStrollArrivalAddress);
	
    // Ajouter la distance et la durée sous la carte
    let displayStrollDistance = document.createElement('div');
    displayStrollDistance.innerHTML = 
        'Longueur du trajet : ' + strollDistance + ' km';
    strollInfo.appendChild(displayStrollDistance);
    
    let displayStrollDuration = document.createElement('div');
    displayStrollDuration.innerHTML = 
        'Durée estimée du trajet : ' + strollDuration + ' min';
    strollInfo.appendChild(displayStrollDuration);
}

function displayStartMarker(data){ 
    let myStartPosition = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/' +
            'leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    
    routeStartPointLong = data['waypoints'][0]['location'][0];
    routeStartPointLat = data['waypoints'][0]['location'][1];
    
    let startMarker = L.marker(
        [routeStartPointLat, routeStartPointLong], 
        {icon: myStartPosition}
    );
    startMarker.addTo(strollMap);
    startMarker.bindPopup('Départ');
    
    return routeStartPointLong, routeStartPointLat;
}

function displayStopsMarkers(data, routeStartPointLong, routeStartPointLat) {
    let listOfMarkers = [];
    
    for (let i = 1; i < data['waypoints'].length - 1; i++) {
        let markerLong = data['waypoints'][i]['location'][0];
        let markerLat = data['waypoints'][i]['location'][1];
        
        let marker = new L.marker([markerLat,markerLong]);
        
        marker.addTo(strollMap);

		// Calculer la distance entre chacun des POI 
		let markerPosition = [markerLong,markerLat];
		
		let distance = parseInt(
		       getDistance(
		           [routeStartPointLong, routeStartPointLat], 
		           markerPosition
		       ), 10
	    );
		let distanceArea = document.getElementsByClassName('distance')[i - 1];
		distanceArea.innerHTML = 
		    '<i class="fas fa-walking"></i>' + distance + ' m';

		// Ajouter les description sur les markers (bindpopup)
		marker.bindPopup(
		    '<p>' + markersToDisplay[i - 1][0] + '</p>' + 
		    '<img src="../' + markersToDisplay[i - 1][3] + 
		    '" class="markerIcon" alt="' + markersToDisplay[i - 1][0] + '"/>'
		    + '<p>' + markersToDisplay[i - 1][5] + '</p>'
		);
		
		listOfMarkers.push(marker);
	}
}

function displayArrivalMarker(data) {
    let myFinalPosition = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/' +
            'leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/' +
            'leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    
    let routeArrivalPointLong = 
        data['waypoints'][data['waypoints'].length - 1]['location'][0];
    let routeArrivalPointLat = 
        data['waypoints'][data['waypoints'].length - 1]['location'][1];

    let arrivalMarker = L.marker(
        [routeArrivalPointLat, routeArrivalPointLong], 
        {icon: myFinalPosition}
    );
    arrivalMarker.addTo(strollMap);
    arrivalMarker.bindPopup('Arrivée');

	strollDistance = 
	    parseFloat(data['routes'][0]['distance'] / 1000, 10).toFixed(2);
	strollDuration = parseInt(data['routes'][0]['duration'] / 60, 10);
	
	return strollDistance, strollDuration;
}

/*** Autres ***/
function resetSearch() {
    localStorage.removeItem('strollCityData');
    localStorage.removeItem('strollStartData');
    localStorage.removeItem('strollArrivalData');
        
    document.location.href = 'https://remis00.sites.3wa.io/Alpha_project/' +
        'MVC_controller/stroll.php'; 
}


/*** DOMContentLoaded ***/
document.addEventListener('DOMContentLoaded', function() {
    //cards.innerHTML = '';
    
    //  1. Choisir une ville
    let selectCity = document.getElementById('selectCity');
    selectCity.addEventListener('click', setCityIdToLocalStorage);
    
    //  2. Entrer une adresse de départ
    startPointNewAddress.addEventListener('keyup', displayStartCityInput);
    
    //  3. Entrer une adresse d'arrivée
    arrivalPointNewAddress.addEventListener('keyup', displayArrivalCityInput);
    
    // Nouvelle recherche
    let newSearch = document.getElementById('newSearch');
    newSearch.addEventListener('click', resetSearch);

    // Annuler la recherche
    let cancelStroll = document.getElementById('cancelStroll');
    cancelStroll.addEventListener('click', resetSearch);
});