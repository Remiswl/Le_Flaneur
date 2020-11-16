'use strict';

let selectedId;
let cardsAdmin;
let idToCompare;
let div0;
let displayInfo = document.getElementById('displayInfo');
let li = Array.from(document.getElementsByTagName('li'));            
let messages = document.getElementById('messages');


/******  Gestion de l'affichage ******/
function changeStyle() {
    displayInfo.innerHTML = '';

    for (let i = 0; i < li.length; i++) {
        if (this.dataset.index == i) {
            li[i].style.backgroundColor='var(--main-color-mustard)';
        } else {
            li[i].style.backgroundColor='var(--main-color-white)';
        }
    }
}

/******  Gestion des statistiques ******/
function displayStatistics() {
    let url = '../MVC_model/AJAX/statistics.php'; 
    $.get(url, ajaxLoaded6);
}

function ajaxLoaded6(statistics){
    let statisticsContainer = document.createElement('div');
    statisticsContainer.setAttribute('id', 'statisticsContainer');
    displayInfo.appendChild(statisticsContainer);
    
    let p1 = document.createElement('p');
    p1.innerHTML = 'Nombre de points d\'intérêt : ';
    p1.innerHTML += statistics[0][0]['nbrPoi'];
    statisticsContainer.appendChild(p1);
    
    let p2 = document.createElement('p');
    p2.innerHTML = 'Nombre de villes : ';
    p2.innerHTML += statistics[2][0]['nbrCities'];
    statisticsContainer.appendChild(p2);
    
    let p3 = document.createElement('p');
    p3.innerHTML = 'Nombre de catégories : ';
    p3.innerHTML += statistics[3][0]['nbrCategories'];
    statisticsContainer.appendChild(p3);
    
    let p4 = document.createElement('p');
    p4.innerHTML = 'Nombre de contributeurs : ';
    p4.innerHTML += statistics[1][0]['nbrContributors'];
    statisticsContainer.appendChild(p4);
    
    let p5 = document.createElement('p');
    p5.innerHTML = 'Nombre de trajets effectués : ';
    p5.innerHTML += statistics[4][0]['nbrStroll'];
    statisticsContainer.appendChild(p5);
}

/******  Gestion des messages ******/
function displayMessages() {
    // Afficher les options de tri des messages
    let div = document.createElement('div');
    div.setAttribute('id', 'sortMessages');
    displayInfo.appendChild(div);
    
        let label = document.createElement('label');
        label.setAttribute('for', 'sortMessages');
        label.innerHTML = 'Afficher les messages ';
        div.appendChild(label);
    
        let input1 = document.createElement('input');
        input1.setAttribute('type', 'checkbox');
        input1.setAttribute('name', 'read');
        input1.setAttribute('checked', 'checked');
        div.appendChild(input1);
        
        let option1 = document.createElement('option');
        option1.setAttribute('value', 'read');
        option1.innerHTML = ' lus ';
        div.appendChild(option1);
        
        let input2 = document.createElement('input');
        input2.setAttribute('type', 'checkbox');
        input2.setAttribute('name', 'unread');
        input2.setAttribute('checked', 'checked');
        div.appendChild(input2);
        
        let option2 = document.createElement('option');
        option2.setAttribute('value', 'unread');
        option2.innerHTML = ' non lus';
        div.appendChild(option2);
        
        let url = '../MVC_model/AJAX/list_of_messages.php';
        $.get(url, displayAllMessages);
    }
        
function displayAllMessages(messages) {
    let divMsg = document.createElement('div');
    divMsg.setAttribute('id', 'displayMessages');
    displayInfo.appendChild(divMsg);
    
    // Afficher les messages
    for (let message of messages) {
        let table = document.createElement('table');
        table.classList.add('listOfMessages');
        divMsg.appendChild(table);
        
        let tr1 = document.createElement('tr');
        table.appendChild(tr1);
        
        let td1 = document.createElement('td');
        td1.innerHTML = 'De : ' + message['name'] + '';
        tr1.appendChild(td1);
        
        let td2 = document.createElement('td');
        td2.innerHTML = 'Reçu le : ' + message['date'] + '';
        tr1.appendChild(td2);
        
        let td3 = document.createElement('td');
        tr1.appendChild(td3);
        let td31 = document.createElement('a'); 
        td31.setAttribute('href', 'mailto:' + message['email']);
        td31.innerHTML = 'Répondre';
        td3.appendChild(td31);
        
        let tr2 = document.createElement('tr');
        table.appendChild(tr2);
        
        let td4 = document.createElement('td');
        td4.setAttribute('colspan', '2');
        td4.setAttribute('rowspan', '2');
        td4.innerHTML = message['message'];
        tr2.appendChild(td4);
        
        let td5 = document.createElement('td');
        td5.classList.add('markAsRead');
        td5.style.color = 'white';
        td5.setAttribute('data-index', message['id']);
        td5.setAttribute('data-status', message['status']);
        if(message['status'] == 'unread') {
            td5.innerHTML = 'Non lu - Marquer comme lu';
            td5.style.backgroundColor = 'red';
        } else {
            td5.innerHTML = 'Lu - Marquer comme non lu';
            td5.style.backgroundColor = 'green';
        }
        tr2.appendChild(td5);
            
        let tr3 = document.createElement('tr');
        table.appendChild(tr3);   
            
        let td6 = document.createElement('td');
        td6.classList.add('deleteMessage');
        td6.setAttribute('data-index', message['id']);
        td6.innerHTML = 'Supprimer le message';
        tr3.appendChild(td6);
    }
    
    // Changer le status
    let markAsRead = document.getElementsByClassName('markAsRead');
    for (let i = 0; i < markAsRead.length; i++) {
        markAsRead[i].addEventListener('click', modifyStatus);
    }
    
    // Supprimer un message
    let deleteMessage = document.getElementsByClassName('deleteMessage');
    for (let i = 0; i < deleteMessage.length; i++) {
        deleteMessage[i].addEventListener('click', deleteAMessage);
    }
    
    // Afficher les messages lus et/ou non lus
    let allInputs = document.querySelectorAll('input');
    for (let i = 0; i < allInputs.length; i++) {
       allInputs[i].addEventListener('click', sortMessages);
    }
}
        
function modifyStatus(){
    let markAsRead = {
        id : parseInt(this.dataset.index, 10), 
        status: this.dataset.status
    };
    let url = '../MVC_model/AJAX/update_message.php';
    $.post(url, markAsRead, backToMsgAdmin);
}

function deleteAMessage(){
    let deleteTheMessage = {id : this.dataset.index};
    let url = '../MVC_model/AJAX/delete_message.php';
    $.post(url, deleteTheMessage, backToMsgAdmin);
}

function backToMsgAdmin() {
    displayMessages();
}

function sortMessages() {
    let checkedBoxes = document.querySelectorAll('input:checked');
    
    // Effacer la div affichant les messages
    let msgToDisplay = document.getElementById('displayMessages');
    displayInfo.removeChild(msgToDisplay);
    
    // Si les deux checkboxes sont sélectionnées, 
    // alors on affiche tous les messages
    if (checkedBoxes.length == 2) {
        let url = '../MVC_model/AJAX/list_of_messages.php';
        $.get(url, displayAllMessages);
    }
    // Si seule la checkbox 'lus' est sélectionnée, 
    // alors on n'affiche que les messages lus
    else if (
        (checkedBoxes.length == 1) && 
        (checkedBoxes[0].name == 'read')
    ) {
        // Demander à la BDD les messages lus
        let status = {status : checkedBoxes[0].name};
        let url = '../MVC_model/AJAX/list_of_messages-status.php';
        $.post(url, status, displayAllMessages);
    }
    // Si seule la checkbox 'non lus' est sélectionnée, 
    // alors on n'affiche que les messages non lus
    else if (
        (checkedBoxes.length == 1) && 
        (checkedBoxes[0].name == 'unread')
    ) {
        let status = {status : checkedBoxes[0].name};
        let url = '../MVC_model/AJAX/list_of_messages-status.php';
        $.post(url, status, displayAllMessages);  
    }
    // Si aucune des checkbox n'est sélectionnée, 
    // alors on on crée une div vide
    else {
        let divMsg = document.createElement('div');
        divMsg.setAttribute('id', 'displayMessages');
        divMsg.innerHTML = '';
        displayInfo.appendChild(divMsg);
    }
}
    
/****** Gestion des poi ******/
// Afficher tous les POI
function displayPOIdiv() {
    // Afficher les options de tri des POI par status lu/non lu
    div0 = document.createElement('div');
    div0.setAttribute('id', 'sortPOI');
    displayInfo.appendChild(div0);
    
    let div1 = document.createElement('div');
    div1.setAttribute('id', 'sortPOIByStatus');
    div0.appendChild(div1);
    
    let label = document.createElement('label');
    label.setAttribute('for', 'sortPOIByStatus');
    label.innerHTML = 'Afficher les points d\'intérêt ';
    div1.appendChild(label);

    let input1 = document.createElement('input');
    input1.setAttribute('type', 'checkbox');
    input1.setAttribute('name', 'proposed');
    input1.setAttribute('checked', 'checked');
    div1.appendChild(input1);
    
    let option1 = document.createElement('option');
    option1.setAttribute('value', 'proposed');
    option1.innerHTML = ' non validés ';
    div1.appendChild(option1);
    
    let input2 = document.createElement('input');
    input2.setAttribute('type', 'checkbox');
    input2.setAttribute('name', 'approved');
    input2.setAttribute('checked', 'checked');
    div1.appendChild(input2);
    
    let option2 = document.createElement('option');
    option2.setAttribute('value', 'approved');
    option2.innerHTML = ' validés ';
    div1.appendChild(option2);
    
    let input3 = document.createElement('input');
    input3.setAttribute('type', 'checkbox');
    input3.setAttribute('name', 'reported');
    input3.setAttribute('checked', 'checked');
    div1.appendChild(input3);
    
    let option3 = document.createElement('option');
    option3.setAttribute('value', 'reported');
    option3.innerHTML = ' signalés';
    div1.appendChild(option3);
    
    displayPOI();
}

function displayPOI(){
    let url = '../MVC_model/AJAX/list_of_poi.php';
    $.get(url, ajaxLoaded2);
}

function ajaxLoaded2(pois) {
    // Créer un card container
    cardsAdmin = document.createElement('div');
    cardsAdmin.setAttribute('id', 'cards');
    displayInfo.appendChild(cardsAdmin);
    
    // Afficher chacune des cards
    for (let poi of pois) {
        // Afficher les infos issues de la BDD
        let container = document.createElement('div');
        container.classList.add('card');
        cardsAdmin.appendChild(container);
        
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
        
        let p6 = document.createElement('p');
        div1.appendChild(p6);
        let p61 = document.createElement('a');
        p61.setAttribute('href', poi['website']); 
        p61.setAttribute('target', '_blank'); 
        p61.innerHTML += poi['website'].substr(0, 39);
        p6.appendChild(p61);
        
        let div2 = document.createElement('div');
        front.appendChild(div2);
        
        let form = document.createElement('form');
        form.setAttribute('method', 'POST');
        form.setAttribute('action', 'likes_recorder.php?id=' + poi['id']);
        form.classList.add('like');
        front.appendChild(form);

        // Back
        let back = document.createElement('div');
        back.classList.add('back');
        container.appendChild(back);
        
		let p4 = document.createElement('p');
        p4.classList.add('article');
        p4.innerHTML = poi['description'].replace(/\n/g, '<br />');
        back.appendChild(p4);

		// Afficher des boutons d'interaction
		let divCont = document.createElement('div');
        divCont.classList.add('interactionButton');
        divCont.setAttribute('data-index', poi['id']);
        divCont.setAttribute('data-status', poi['status']);
        container.appendChild(divCont);

        // Un bouton pour les POI signalés
        if(poi['status'] === 'reported') {
            let button4 = document.createElement('p');
            button4.classList.add('readReport');
            button4.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
            divCont.appendChild(button4);
        }
        
        // Un bouton pour marquer le POI comme validé/proposé
        let button2 = document.createElement('p');
        button2.classList.add('confirmPOI');
        if(
            (poi['status'] === 'proposed') || 
            (poi['status'] === 'reported')
        ){
            button2.innerHTML = '<i class="fas fa-times"></i> Non validé';
        } else {
            button2.innerHTML = '<i class="fas fa-check"></i> Validé';
        }
        divCont.appendChild(button2);
        
        // Un bouton pour modifier
        let button1 = document.createElement('p');
        button1.classList.add('modifyPOI');
        button1.innerHTML = '<i class="fas fa-edit"></i>';
        divCont.appendChild(button1);
        
        // Un bouton pour supprimer
        let button3 = document.createElement('p');
        button3.classList.add('deletePOI');
        button3.innerHTML = '<i class="fas fa-trash-alt"></i>';
        divCont.appendChild(button3);
    }
    
    // interactions du bouton Signaler
    let readReport = document.getElementsByClassName('readReport');
    for(let i = 0; i < readReport.length; i++) {
        readReport[i].addEventListener('click', readPoiReport);
    }
    
    // interactions du bouton Modifier
    let modifyPOI = document.getElementsByClassName('modifyPOI');
    for(let i = 0; i < modifyPOI.length; i++) {
        modifyPOI[i].addEventListener('click', updatePOI);
    }

    // interactions du bouton Valider
    let confirmPOI = document.getElementsByClassName('confirmPOI');
    for(let i = 0; i < confirmPOI.length; i++) {
        confirmPOI[i].addEventListener('click', changePOIStatus);
    }

    // interactions du bouton Supprimer
    let deletePOI = document.getElementsByClassName('deletePOI');
    for(let i = 0; i < deletePOI.length; i++) {
        deletePOI[i].addEventListener('click', deleteSelectedPOI);
    }
    
    // Trier les messages par status proposés/validés
    let allInputs = document.querySelectorAll('input');
    for (let i = 0; i < allInputs.length; i++) {
       allInputs[i].addEventListener('click', sortStatus);
    }
}

function readPoiReport() {
    // 1. Récupérer les message du POI sur lequel on clique
    let idToRetrive = {id : parseInt(this.parentElement.dataset.index, 10)};
    let url = '../MVC_model/AJAX/list_of_report_messages.php';
    $.post(url, idToRetrive, getMessages);
}

function getMessages(data) {
    // 2. Afficher le message transmis par l'utilisateur dans une fenêtre
    let message = window.confirm(data['message']);
    // 3. Si l'admin valide le message
    if (message == true ) {
        // 3.a changer le status
        // 3.b supprimer le message de la BDD (report_messages)
        let markAsApproved = {
            id : parseInt(this['data'].match(/(\d+)/)[0], 10),
            newStatus : 'approved'
        };
        let url = '../MVC_model/AJAX/delete_report_message.php';
        $.post(url, markAsApproved, backToPOIAdmin);
    }
}

function updatePOI() {
    document.location.href = 
        '../MVC_controller/update_poi.php?id=' +
        this.parentElement.dataset.index;
}

function changePOIStatus(){
    let markAsApproved = {
        id : parseInt(this.parentElement.dataset.index, 10), 
        status: this.parentElement.dataset.status
    };
    let url = '../MVC_model/AJAX/update_poi_status.php';
    $.post(url, markAsApproved, backToPOIAdmin);
}

function deleteSelectedPOI(){
    let deletePOI = {id : parseInt(this.parentElement.dataset.index, 10)};
    let url = '../MVC_model/AJAX/delete_poi.php';
    $.post(url, deletePOI, backToPOIAdmin);
}

function backToPOIAdmin() {
    displayPOIdiv();
}

function sortStatus() {
    let checkedBoxes = document.querySelectorAll('input:checked');
    
    // Effacer le contenu de la div affichant les POI
    let cards = document.getElementById('cards');
    if (cards != null) {
        displayInfo.removeChild(cards);
    }
    // Si les trois checkboxes sont sélectionnées, 
    // alors on affiche tous les POI
    if (checkedBoxes.length == 3) {
        let url = '../MVC_model/AJAX/list_of_poi.php';
        $.get(url, displayPOI);
    }
    // Si deux checkbox sont sélectionnées 
    else if (checkedBoxes.length == 2) {
        let status = {
            status1 : checkedBoxes[0].name, 
            status2 : checkedBoxes[1].name
        };
        let url = '../MVC_model/AJAX/list_of_poi-status.php';
        $.post(url, status, ajaxLoaded2);
    }
    // Si une seule checkbox est sélectionnée
    else if (checkedBoxes.length == 1) {
        let status = {status : checkedBoxes[0].name};
        let url = '../MVC_model/AJAX/list_of_poi-status.php';
        $.post(url, status, ajaxLoaded2);  
    }
    // Si aucune des checkbox n'est sélectionnée, 
    // alors on crée une div vide
    else {
        let divPOI = document.createElement('div');
        divPOI.setAttribute('id', 'displayPOI');
        divPOI.innerHTML = '';
        displayInfo.appendChild(divPOI);
    }
}

/****** Gestion des catégories ******/
function displayListOfCategories() {
    let form = document.createElement('form');
    displayInfo.appendChild(form);
    
    let table = document.createElement('table');
    table.classList.add('listOfCategories');
    form.appendChild(table);
    
    let thead = document.createElement('thead');
    table.appendChild(thead); 
    
    let tr = document.createElement('tr');
    tr.innerHTML += '<td>Nom</td><td>Modifier</td><td>Supprimer</td>';
    thead.appendChild(tr);
    
    let tbody = document.createElement('tbody');
    tbody.setAttribute('id', 'tbody');
    table.appendChild(tbody);
    
    // Insersion des informations
    let url = '../MVC_model/AJAX/list_of_categories.php';
    $.get(url, ajaxLoaded4);
}

function ajaxLoaded4(categories) {
    for (let category of categories) {
        let tbody = document.getElementById('tbody');
        
        let tr = document.createElement('tr');
        tbody.appendChild(tr);
    
        let td = document.createElement('td');
        td.classList.add('modifyCategory');
        td.setAttribute('data-index', category['id']);
        td.innerHTML = category['name'];
        tr.appendChild(td);
        
        td = document.createElement('td');
        td.classList.add('modifyTheCategory');
        td.setAttribute('data-index', category['id']);
        td.innerHTML = '<i class="fas fa-edit"></i>';
        tr.appendChild(td);
        
        td = document.createElement('td');
        td.classList.add('deleteTheCategory');
        td.setAttribute('data-index', category['id']);
        td.innerHTML = '<i class="fas fa-trash-alt"></i>';
        tr.appendChild(td);
    }
    
    // Modification d'une catégorie
    let modifyTheCategory = 
        document.getElementsByClassName('modifyTheCategory');
    for (let i = 0; i < modifyTheCategory.length; i++) {
         modifyTheCategory[i].addEventListener('click', modifyACategory);
    }
    
    // Suppression d'une catégorie
    let deleteTheCategory = 
        document.getElementsByClassName('deleteTheCategory');
    for (let i = 0; i < deleteTheCategory.length; i++) {
         deleteTheCategory[i].addEventListener('click', deleteCategory);
    }

    // Permettre l'ajout de catégories
    let button = document.createElement('button');
    button.setAttribute('id', 'addACategory');
    button.setAttribute('type', 'button');
    button.innerHTML = 'Ajouter une catégorie';
    displayInfo.appendChild(button);
    
    let addACategory = document.getElementById('addACategory');
    addACategory.addEventListener('click', registerNewCategory);
}

// Ajout d'une nouvelle catégorie
function registerNewCategory() {
    //Afficher une popup pour demander d'entrer la nouvelle catégorie
    let newCat = window.prompt('Entrez une nouvelle catégorie');
    // Si l'utilisateur a bien entré une valeur
    // Enregistrer la catégorie dans la BDD
    if (newCat.value != '') {
        let newCategory = {newCat : newCat};
        let url = '../MVC_model/AJAX/insert_new_category.php';
        $.post(url, newCategory, backToCatAdmin);
    }
}

function modifyACategory() {
    selectedId = this.getAttribute('data-index');
    
    //Afficher une popup pour demander à entrer le nouveau nom
    let newCat = window.prompt(
        'Entrez un nouveau nom pour la catégorie "' +
        this.previousSibling.innerHTML + '".', 
        this.previousSibling.innerHTML
    );
    
    // Si l'utilisateur a bien entré une valeur:
    if ((newCat != null) && (newCat.length != 0) && (isNaN(newCat))) {
        let similarities = [];
        let categoryToModify = 
            document.getElementsByClassName('modifyCategory');
        
        for (let i = 0; i < categoryToModify.length; i++) { 
            if (newCat ===  categoryToModify[i].innerText) {
                similarities.push(newCat);
            }
        }
        
        // 1. si similarities est vide
        // i.e. si la catégorie entrée par l'utilisateur n'existe pas encore
        // alors modifie le nom de la catégorie 
        // sur laquelle l'utilisateur a cliqué
        if (similarities.length == 0) {
            let updatedCategory = {
                newCatName : newCat, 
                idToModify : selectedId
            };
            let url = '../MVC_model/AJAX/update_categories.php';
            $.post(url, updatedCategory, displayListOfCategories);
        }
        // 2. sinon, si similarities n'est pas vide
        // i.e. il y a djà une catégorie qui porte déjà ce nom
        else {
            window.alert('Cette catégorie existe déjà. ' +
            'Veuillez choisir un autre nom.');
        }
    }
}

function deleteCategory() {
    let confirm = window.confirm(
        'Voulez-vous vraiment supprimer cette catégorie ?'
    );
    
    if(confirm == true) {
        idToCompare = {id : parseInt(this.getAttribute('data-index'), 10)};
        let url = '../MVC_model/AJAX/list_of_poi-category_id.php';
        $.post(url, idToCompare, ajaxLoaded5);
    }
}

function ajaxLoaded5(data) {
    if(data[0]['COUNT(*)'] != 0) {
        window.alert('Impossible de supprimer la catégorie. '
        + 'Un ou plusieurs points d\'intérêt l\'utilisent encore.');
    } else {
        let idToDelete = {id : idToCompare['id']};
        let url = '../MVC_model/AJAX/delete_category.php';
        $.post(url, idToDelete, backToCatAdmin);
    }
}

function backToCatAdmin() {
    displayListOfCategories();
}

/****** Gestion des droits ******/
function displayListOfUsers() {
    let form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute(
        'action', 
        '../MVC_model/AJAX/update_contributor_rights.php'
    );
    form.setAttribute('id', 'form');
    displayInfo.appendChild(form);
    
    let table = document.createElement('table');
    table.classList.add('listOfUsers');
    form.appendChild(table);
    
    let thead = document.createElement('thead');
    table.appendChild(thead); 
    
    let tr = document.createElement('tr');
    tr.innerHTML += '<td>Nom</td><td>Login</td><td>Droits</td>';
    thead.appendChild(tr);
    
    let tbody = document.createElement('tbody');
    tbody.setAttribute('id', 'tbody');
    table.appendChild(tbody);

    // Insersion des informations
    let url = '../MVC_model/AJAX/list_of_contributors.php'; 
    $.get(url, ajaxLoaded);
}

function ajaxLoaded(users) {
    let tbody = document.getElementById('tbody');
    let form = document.getElementById('form');

    for (let user of users) {
        displayUsers(user, tbody);
    }
    
    // Afficher un bouton pour valider les modifications
    let div = document.createElement('div');
    div.classList.add('button');
    form.appendChild(div);
    
    let confirmButton = document.createElement('input');
    confirmButton.classList.add('submit');
    confirmButton.setAttribute('type', 'submit');
    confirmButton.setAttribute('value', 'Valider');
    confirmButton.setAttribute('id', 'confirmRights');
    div.appendChild(confirmButton);
    
    let confirmChanges = document.getElementById('confirmRights');
    confirmChanges.addEventListener('submit', modifyRights);
}

function displayUsers(user, tbody) {
    let tr = document.createElement('tr');
    tbody.appendChild(tr);
    
    let tdName = document.createElement('td');
    tdName.innerHTML = user['name'];
    tr.appendChild(tdName);
    
    let tdLogin = document.createElement('td');
    tdLogin.innerHTML = user['login'];
    tr.appendChild(tdLogin);
    
    let tdRight = document.createElement('td');
    tdRight.classList.add('radioContainer');
    tr.appendChild(tdRight);
        
    let div1 = document.createElement('div');
    tdRight.appendChild(div1);
    
    let inputAdmin = document.createElement('input');
    inputAdmin.setAttribute('type', 'radio');
    inputAdmin.setAttribute('name', user['id']);
    inputAdmin.setAttribute('value', 'admin');
    if (user['rights'] == 'admin') {
        inputAdmin.setAttribute('checked', 'checked');
    }
    div1.appendChild(inputAdmin);
    
    let labelAdmin = document.createElement('label');
    labelAdmin.setAttribute('for', 'admin');
    labelAdmin.innerHTML = 'Admin';
    div1.appendChild(labelAdmin);
    
    let div2 = document.createElement('div');
    tdRight.appendChild(div2);
    
    let inputVisitor = document.createElement('input');
    inputVisitor.setAttribute('type', 'radio');
    inputVisitor.setAttribute('name', user['id']);
    inputVisitor.setAttribute('value', 'visitor');
    if (user['rights'] == 'visitor') {
        inputVisitor.setAttribute('checked', 'checked');
    }
    div2.appendChild(inputVisitor);
    
    let labelVisitor = document.createElement('label');
    labelVisitor.setAttribute('for', 'visitor');
    labelVisitor.innerHTML = 'Visitor';
    div2.appendChild(labelVisitor);
}

function modifyRights(){
    displayListOfUsers();
}

/****** Supprimer un contributeur ******/
function displayUsersToDelete() {
    let url = '../MVC_model/AJAX/list_of_contributors.php';
    $.get(url, ajaxLoaded3);
}

function ajaxLoaded3(data) {
    let listContainer = document.createElement('form');
    listContainer.setAttribute('method', 'POST');
    listContainer.setAttribute(
        'action', 
        '../MVC_model/AJAX/delete_contributor.php'
    );
    listContainer.setAttribute('id', 'listOfUsersToDelete');
    displayInfo.appendChild(listContainer);
    
    let labelList = document.createElement('label'); 
    labelList.setAttribute('for', 'users');
    labelList.innerHTML = 'Sélectionnez un utilisateur à supprimer : ';
    listContainer.appendChild(labelList);
    
    let selectList = document.createElement('select'); 
    selectList.setAttribute('name', 'users');
    listContainer.appendChild(selectList);
    
    for (let i = 0; i < data.length; i++){
        let option = document.createElement('option'); 
        option.setAttribute('value', data[i]['id']);
        option.innerHTML = data[i]['name'];
        option.setAttribute('name', 'users');
        selectList.appendChild(option);
    }
    
    let trashButton = document.createElement('button');
    trashButton.setAttribute('id', 'deleteButton');
    trashButton.style.border = 'var(--main-color-white)';
    trashButton.style.backgroundColor = 'var(--main-color-white)';
    listContainer.appendChild(trashButton);
    
    let selectTrash = document.createElement('i');
    selectTrash.classList.add('fas');
    selectTrash.classList.add('fa-trash-alt');
    selectTrash.style.color='var(--main-color-red)';
    trashButton.appendChild(selectTrash);
} 


/*** DOMContentLoaded ***/
document.addEventListener('DOMContentLoaded', function() {
    /******  Gestion de l'affichage ******/
    for (let i = 0; i < li.length; i++) {
        li[i].setAttribute('data-index', [i]);
        li[i].addEventListener('click', changeStyle);
    }
    
    /******  Gestion des statistiques ******/
    let statistics = document.getElementById('statistics');
    statistics.addEventListener('click', displayStatistics);
    
    /******  Gestion des messages ******/
    messages.addEventListener('click', displayMessages);

    /****** Gestion des poi ******/
    let managePoi = document.getElementById('managePoi');
    managePoi.addEventListener('click', displayPOIdiv);
    
    /****** Gestion des catégories ******/
    let manageCategories = document.getElementById('manageCategories');
    manageCategories.addEventListener('click', displayListOfCategories);
    
    /****** Gestion des droits ******/
    let manageRights = document.getElementById('manageRights');
    manageRights.addEventListener('click', displayListOfUsers);
    
    /****** Supprimer un contributeur ******/
    let deleteContributors = document.getElementById('deleteContributor');
    deleteContributors.addEventListener('click', displayUsersToDelete);

});