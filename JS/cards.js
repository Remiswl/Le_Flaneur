'use strict';

let like = document.getElementsByClassName('like');

/*** Affichage de la card ***/
function displayCards(poi) {
    let cards = document.getElementById('cards');
    
    let cardContainer = document.createElement('div');
    cardContainer.classList.add('cardContainer');
    cards.appendChild(cardContainer);
    
    let container = document.createElement('div');
    container.classList.add('card');
    cardContainer.appendChild(container);
    
    // Front
    let front = document.createElement('div');
    front.classList.add('front');
    container.appendChild(front);
    
    let imgContainer = document.createElement('div');
    imgContainer.classList.add('imgContainer');
    front.appendChild(imgContainer);
    
    let img = document.createElement('img');
    img.setAttribute('src', '../' + poi['photo']);
    img.setAttribute('alt', poi['title']);
    imgContainer.appendChild(img);
    
    let distance;
    let distanceArea = document.createElement('p');
    distanceArea.classList.add('distance');
    distanceArea.innerHTML = '<i class="fas fa-walking"></i>' + distance + ' m';
    front.appendChild(distanceArea);
    
    let div1 = document.createElement('div');
    div1.classList.add('textLeft');
    front.appendChild(div1);
    
    let h2 = document.createElement('h2');
    h2.innerHTML = poi['title'];
    div1.appendChild(h2);
    
    let p2 = document.createElement('p');
    p2.classList.add('category');
    p2.innerHTML = poi['category'];
    div1.appendChild(p2);
    
    let p3 = document.createElement('p');
    p3.innerHTML = poi['address'] + ', ';
    p3.innerHTML += poi['zipcode'] + ' ';
    p3.innerHTML += poi['city'];
    div1.appendChild(p3);
    
    let p5 = document.createElement('p');
    div1.appendChild(p5);
    let p51 = document.createElement('a');
    p51.setAttribute('href', poi['website']),
    p51.setAttribute('target', '_blank');
    p51.innerHTML = poi['website'].substr(0, 39);
    p5.appendChild(p51);
    
    let div2 = document.createElement('div');
    front.appendChild(div2);
    
    let form = document.createElement('form');
    form.setAttribute('POI', poi['id']);
    form.classList.add('like');
    front.appendChild(form);
    
    let submit = document.createElement('button');
	submit.setAttribute('type', 'submit');
	submit.setAttribute('name', 'like');
	submit.setAttribute('value', '0');
	submit.innerHTML = '<i class="far fa-thumbs-up" class="like"></i> ';
	submit.innerHTML += poi['likes'];
	form.appendChild(submit);
    
    let button1 = document.createElement('button');
	button1.classList.add('turnCard');
	button1.setAttribute('data-index', poi['id']);
	front.appendChild(button1);
	let button11 = document.createElement('i');
	button11.setAttribute('class', 'fas fa-plus-circle');
	button11.setAttribute('id', poi['id']);
	button1.appendChild(button11);
	
    // Back
    let back = document.createElement('div');
    back.classList.add('back');
    container.appendChild(back);
    
	let p4 = document.createElement('p');
    p4.classList.add('article');
    p4.innerHTML = poi['description'].replace(/\n/g, '<br />');
    back.appendChild(p4);
    
    let form2 = document.createElement('form');
    form2.setAttribute('POI', poi['id']);
    form2.classList.add('report');
    back.appendChild(form2);
    
    let submit2 = document.createElement('button');
	submit2.setAttribute('type', 'submit');
	submit2.setAttribute('name', 'report');
	submit2.setAttribute('value', '0');
	submit2.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
	submit2.innerHTML += 'Signaler ce point d\'intérêt';
	form2.appendChild(submit2);
    
	let button2 = document.createElement('button');
	button2.classList.add('turnCard');
	button2.setAttribute('data-index', poi['id']);
	back.appendChild(button2);
	let button21 = document.createElement('i');
	button21.setAttribute('class', 'fas fa-plus-circle');
	button21.setAttribute('id', poi['id']);
	button2.appendChild(button21);
	
    // Gestion de l'animation des cards
    let turnButton = document.getElementsByClassName('turnCard');
    for (let i = 0; i < turnButton.length; i++) { 
        turnButton[i].addEventListener('click', turnCard);
    }
    
    // Gestion du signalement
    let reportButton = document.getElementsByClassName('report');
    for (let i = 0; i < reportButton.length; i++) { 
        reportButton[i].addEventListener('click', reportCard);
    }
    
    // Récupérer les données du POI
	// Et les ajouter dans un tableau
    let data = [
        poi['title'], 
        poi['latitude'], 
        poi['longitude'], 
        poi['photo'], 
        poi['id'], 
        poi['address']
    ];
    return data;
}

/*** Gestion des likes ***/
function manageLikes() {
    for (let i = 0; i < like.length; i++) {
        like[i].addEventListener('click', increaseLike);
    }
}

function increaseLike(e) {
    e.preventDefault();
    readCookies();

    if (readCookies() == 'true') {
        let selectedPoi = {POI : this.getAttribute('poi')};
        let url = '../MVC_model/AJAX/likes.php';
        $.post(url, selectedPoi, ajaxLoaded8);
    } else {
        window.alert('Vous devez être connecté pour pouvoir voter.');
    }
}

function ajaxLoaded8(answer) {
    if(answer[0] == 'already liked') {
        window.alert('Vous avez déjà aimé ce point d\'intérêt.');
    } else {
        let poi_id =  {poi_id : answer[1]};
        let url = '../MVC_model/AJAX/list_of_poi-id.php';
        $.post(url, poi_id, updateNumberOfLikes);
    }
}

function updateNumberOfLikes(data){
    for (let i = 0; i < like.length; i++) {
        if(like[i].getAttribute('poi') == data['id']) {
            let newNumberOfLikes = parseInt(data['likes'], 10);
            like[i].firstChild.innerHTML = 
                '<i class="far fa-thumbs-up" class="like"></i> ';
            like[i].firstChild.innerHTML += newNumberOfLikes;
        }
    }
}

function readCookies(){
    let all_cookies = document.cookie.split(';');
    for(let i = 0; i < all_cookies.length; i++) {
        all_cookies[i] = all_cookies[i].trim();
        if(all_cookies[i].startsWith('isLoggedIn')) {
            let cookie_value = all_cookies[i].substring(11);
            return cookie_value;
        }
    }
}
  
/*** Gestion du retournement des cartes ***/
function turnCard() {
    this.parentElement.parentElement.parentElement.classList.toggle('hover');
}
  
/*** Gestion du signalement ***/
function reportCard(e) {
    e.preventDefault();
    
    let reportMessage = window.prompt('Indiquez nous pouquoi ' +
        'vous signalez ce point d\'intérêt.');
    let reportACard = {
        id : parseInt(this.getAttribute('poi'), 10), 
        newStatus : 'reported',
        message : reportMessage
    };
    let url = '../MVC_model/AJAX/report_poi.php';
    $.post(url, reportACard, confirmReport);
}

function confirmReport() {
    window.alert('Merci d\'avoir signalé ce point d\'intérêt. ' +
        'Nos équipes traiteront ce signalement dans les plus brefs délais.');
}

/*** Calcul de la distance entre la position de l'utilisateur et les POI ***/
function getDistance(origin, destination) {
    let lon1 = toRadian(origin[1]);
    let lat1 = toRadian(origin[0]);
    let lon2 = toRadian(destination[1]);
    let lat2 = toRadian(destination[0]);

    let deltaLat = lat2 - lat1;
    let deltaLon = lon2 - lon1;

    let a = 
        Math.pow(Math.sin(deltaLat/2), 2) + 
        Math.cos(lat1) * 
        Math.cos(lat2) * 
        Math.pow(Math.sin(deltaLon/2), 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    let EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
}

function toRadian(degree) {
    return degree*Math.PI/180;
}

/*** Exportation des fonctions ***/
export {
    displayCards,
    getDistance,
    manageLikes,
    readCookies
};