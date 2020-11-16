'use strict';

// Gestion des interactions des pages 'Je participe' et 'Modifier un POI'

import {
    getPOIFromCityId
} from './around_me.js'; 

import { 
    access_token
} from './access_token.js';

let newAddress = document.getElementById('newAddress');
let selectedCityLat = document.getElementById('selectedCityLat');
let selectedCityLong = document.getElementById('selectedCityLong');
let newZipcode = document.getElementById('newZipcode');
let selectedZipcode = document.getElementById('selectedZipcode');
let newAddressButton = document.getElementById('newAddressButton');


/*** Gestion des interactions de la page "Je participe" ***/
// Recherche par zipcode
function displayCityInput() {
    let zipCode = newZipcode.value;

    // Une fois que l'utilisateur a entré 5 chiffres
    if (newZipcode.value.length == 5) {
        // vérifier s'il s'agit bien d'un nombre
        let JSerrors = document.getElementsByClassName('JSerrors');
        
        if (isNaN(newZipcode.value) == true) {
            JSerrors[0].innerHTML = 
                'Veuillez entrer un code postal valide à cinq chiffres';
        } else {
            JSerrors[0].innerHTML = '';
            // Si c'est le cas, afficher l'input ville
            let cityUl = document.getElementById('hiddenCity');
            cityUl.classList.remove('hide');
            
            // Récupérer les coordonnées GPS de la ville
            getCityCoordinates(zipCode);
            
            // Afficher l'input adresse
            let addressUl = document.getElementById('hiddenAddress');
            addressUl.classList.remove('hide');
            
            // Autocomplétion
            // Récupérer les données de la ville
            if (newAddress != null) {
                newAddress.addEventListener('keydown', displayAddressList);
            }
        }
        
        // si l'utilisateur supprime un caractère pour corriger le zipcode
        // Alors on vide les champs Ville et Adresse
        newZipcode.addEventListener("keypress", displayCityInput);
    }
}    

function getCityIdFromZipcode(cityZipcode) {    
    // A partir du zipcode, on récupère le City Id
    // Puis on l'envoie dans la BDD pour récupérer les POI de la ville 
    let selectedCityZipCode = {cityZipcode : cityZipcode};
    let url = '../MVC_model/AJAX/list_of_cities-zipcode.php';
    $.post(url, selectedCityZipCode, getPOIFromCityId);
}

function getCityCoordinates(zipcode) {
    let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    url += zipcode;
    url += '.json?country=FR&';
    url += 'access_token=' + access_token;
    $.get(url, importCityCoordinates);
}

function importCityCoordinates(data){
    // Récupérer le nom de la ville 
    // puis permettre l'autocomplétion du champ Adresse 
    // (attention aux cas où les adresses sont plus ou moins détaillées)
    if (data['features'] == 0) {
        window.alert(
            'Le code postal que vous avez entré n\'est pas reconnu. ' +
            'Merci d\'en entrer un autre.'
        );
    }
    
    let newCity = document.getElementById('newCity');
    
    for (let i = 0; i < data['features'][0]['context'].length; i++) {
        if (data['features'][0]['context'][i]['id'].startsWith('place')) {
            newCity.setAttribute(
                'value', 
                data['features'][0]['context'][i]['text']
            );
        }
    }
    
    // Autocompléter les cases selectedCityLat et selectedCityLong
    let cityLat = 
        (data['features'][0]['bbox'][1] + data['features'][0]['bbox'][3]) / 2;
    let cityLong = 
        (data['features'][0]['bbox'][0] + data['features'][0]['bbox'][2]) / 2;
    
    selectedCityLat.setAttribute('value', cityLat);
    selectedCityLong.setAttribute('value', cityLong);

    // S'il y a une carte à afficher (Autour de moi)
    // Alors on envoie les données vers Mapbox
    let mapArea = document.getElementById('map');
    let zipcode = selectedZipcode.value;
    if (mapArea != null) {
        getCityIdFromZipcode(zipcode);
    }
}   

function displayAddressList() {
    let numberOfAdresses = 10;
    let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    url += newAddress.value;
    url += '.json?autocomplete';
    url += '&limit=' + numberOfAdresses;
    url += '&country=' + 'FR';
    url += '&proximity=';
    url += selectedCityLong.value + ',' + selectedCityLat.value;
    url += '&access_token=' + access_token;
    $.get(url, importData);
}

function importData(addresses) {
   let list = [];
  
   for (let i = 0; i < addresses['features'].length; i++) {
       list.push(addresses['features'][i]['place_name']);
   }

    $('#newAddress').autocomplete({
        source: list,
        select: displayAddressDetails
    });
}

// Récupérer les données de la ville
function displayAddressDetails(){
    newAddress.addEventListener('blur', sendAdress);
}

function sendAdress(){
    let details = newAddress.value;
    let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    url += details;
    url += '.json?access_token=' + access_token;
    $.get(url, importDetailsToDb);
}

function importDetailsToDb(data) {
    let addressFound = [];
    
    for (let i = 0; i < data['features'].length; i++) {
        if (data['features'][i]['relevance'] == 1) {
            // Si l'utilisateur a sélectionné une rue 
            // et non une adresse complète
            // Alors le numéro est considéré comme 'undefined'
            let number;
            
            if(data['features'][i]['address'] != undefined){
                number = data['features'][i]['address'];
            } else {
                number = '';
            }
            
            let street = data['features'][i]['text'];
            let selectedNumberStreet = 
                document.getElementById('selectedNumberStreet');
            selectedNumberStreet.setAttribute('value', number + ' ' + street);
            
            let selectedCity = document.getElementById('selectedCity');
            
            for (let j = 0; j < data['features'][i]['context'].length; j++) {
                if (data['features'][i]['context'][j]['id'].startsWith('postcode')) {
                    selectedZipcode.setAttribute(
                        'value', 
                        data['features'][i]['context'][j].text
                    );
                    newZipcode.value = data['features'][i]['context'][j].text;
                }
                
                if (data['features'][i]['context'][j]['id'].startsWith('place')) {
                    selectedCity.setAttribute(
                        'value', 
                        data['features'][i]['context'][j].text
                    );
                }
            }
            
            let selectedLat = document.getElementById('selectedLat');
            selectedLat.setAttribute(
                'value', 
                data['features'][i]['geometry']['coordinates'][1]
            );
            
            let selectedLong = document.getElementById('selectedLong');
            selectedLong.setAttribute(
                'value', 
                data['features'][i]['geometry']['coordinates'][0]
            );
        
            getCityCoordinates(selectedZipcode.value);

            addressFound.push('found');
        }
    }
    
    if (addressFound.length == 0) {
        newAddress.value = '';
        window.alert(
            'L\'adresse que vous avez entré n\'est pas assez précise. ' +
            'Merci d\'en entrer une autre. ' +
            'Avez-vous pensé à mettre un numéro ?');
    }
}

/*** Gestion des interactions de la page "Modifier un POI" ***/    
function modifyAddress(e) {
    e.preventDefault();
    
    let registeredAddress = document.getElementById('registeredAddress');
    
    newAddressButton.parentElement.parentElement.classList.add('hide');
    registeredAddress.parentElement.parentElement.classList.add('hide');
    newZipcode.parentElement.parentElement.classList.remove('hide');
}


/*** DOMContentLoaded ***/
document.addEventListener('DOMContentLoaded', function() {
    // récupérer le zipcode entré par l'utilisateur
    // et in fine récupérer l'adresse saisie 
    
        // 'Je participe'
    if (newZipcode != null) {
        newZipcode.addEventListener('keyup', displayCityInput);
    }
    
        // 'Mise à jour des POI'
    if (newAddressButton != null) {
        newAddressButton.addEventListener('click', modifyAddress);
    }
});


/*** Exportation des fonctions ***/ 
export {
    displayCityInput
};