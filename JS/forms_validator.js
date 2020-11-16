'use strict';

let JSerrors = document.getElementsByClassName('JSerrors');
let PHPerrors = document.getElementsByClassName('PHPerrors');
let password = document.getElementById('password');
let passwordConfirmation = document.getElementById('passwordConfirmation');
let copyright = document.getElementById('copyright');
let photo = document.querySelectorAll('input[name=img]');
let newTitle = document.getElementById('newTitle');
let newDescription = document.getElementById('newDescription');
let newAddress = document.getElementById('newAddress');
let inputs = document.querySelectorAll(
    '#registrationForm input, ' +
    '#submitLogin input, ' +
    '#myProfile input, ' +
    '#createCard input, ' +
    '#updateCard input, ' +
    '#contactForm input'
);


/*** Vérification en temps réel des formulaire ***/
function checkTyping() {
     this.style.borderBottomColor = 'lime'; 
}

function checkForm() {
    if(this.value == '') {
        this.style.borderBottomColor = 'red';
    } else {
        this.style.borderBottomColor = 'lime';
    }
}

/*** Vérifications finales des formulaires ***/
function checkIfEmptyInputs(e) {
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value == '') {
            e.preventDefault();
            JSerrors[0].innerHTML = 
                'Erreur : vous devez compléter tous les champs';
            inputs[i].style.borderBottomColor = 'red';
        }
    }
}

/*** Vérification finale du formulaire de connexion et des messages ***/
function preventSendForm(e) {
    JSerrors[0].textContent = '';
    PHPerrors[0].textContent = '';
    
    checkIfEmptyInputs(e);
}

/*** Vérification finale du formulaire d'inscription ***/
function preventSendRegistrationForm(e) {
    JSerrors[0].textContent = '';
    PHPerrors[0].textContent = '';
    
    checkIfEmptyInputs(e);
    checkNamePattern(e);
    checkIfPasswordNotEmpty(e);
    checkIfPasswordAreSame(e);
    checkPasswordPattern(e);
}

function checkNamePattern(e) {
    let pattern_name = RegExp('^[a-zA-ZÀ-ú-\' ]+$');
    let first_name = document.getElementById('first_name');
    let last_name = document.getElementById('last_name');
    
    if (
        (first_name.value != '') && 
        (pattern_name.test(first_name.value) == false)
    ) {
        e.preventDefault(); 
        JSerrors[0].innerHTML = 'Le champ Prénom ne peut contenir que ' +
        'des lettres, des tirets ou des espaces.';
        first_name.style.borderBottomColor = 'red';
    }
    
    if (
        (last_name.value != '') && 
        (pattern_name.test(last_name.value) == false)
    ) {
        e.preventDefault(); 
        JSerrors[0].innerHTML = 'Le champ Nom ne peut contenir que ' +
        'des lettres, des tirets ou des espaces.';
        last_name.style.borderBottomColor = 'red';
    }
}

function checkIfPasswordNotEmpty(e) {
    if (
        (password.value == '' && passwordConfirmation.value != '') ||
        (password.value != '' && passwordConfirmation.value == '')
    ) {
        e.preventDefault();
        
        JSerrors[0].innerHTML = 'Erreur : vous devez compléter les champs ' +
            '"Mot de passe" et "Confirmez le mot de passe".';
        password.style.borderBottomColor = 'red';
        passwordConfirmation.style.borderBottomColor = 'red';
    }
}

function checkIfPasswordAreSame(e) {
    if(password.value !== passwordConfirmation.value) {
        e.preventDefault(); 
        JSerrors[0].innerHTML = 'Les deux mots de passe ne sont pas identiques.';
        password.style.borderBottomColor = 'red';
        passwordConfirmation.style.borderBottomColor = 'red';
    }
}

function checkPasswordPattern(e) {
    let pattern_password = RegExp('^[a-zA-ZÀ-ú0-9-\'!#$%@&?\-_"]{10,}$');
    if (
        (password.value != '') && 
        (pattern_password.test(password.value) == false)
    ) {
        e.preventDefault(); 
        JSerrors[0].innerHTML = 'Le mot de passe doit contenir ' +
            'au moins 10 caractères et une majuscule. ' +
            'Sont autorisés les accents ainsi que ' +
            'les caractère spéciaux suivants: \' ! # $ % & @ ? . - _ " ';
        password.style.borderBottomColor = 'red';
    }
}

/*** Vérification finale de 'Mon profil' ***/
function preventSendProfilChanges(e) {
    JSerrors[0].textContent = '';
    PHPerrors[0].textContent = '';

    // Si les 4 premiers champs sont vides:
    for (let i = 0; i < inputs.length - 3; i++) {
        if (inputs[i].value == '') {
            e.preventDefault();
            JSerrors[0].innerHTML = 'Erreur : les champs "Prénom", "Nom", ' +
                '"Email" et "Login" ne peuvent pas être vides.';
            inputs[i].style.borderBottomColor = 'red';
        }
    }
    
    checkNamePattern(e);
    // Vérification des mots de passe 
    // si l'utilisateur décide d'en créer un nouveau
    // Sinon n'empêche pas la modification
    checkIfPasswordNotEmpty(e);
    checkIfPasswordAreSame(e);
    checkPasswordPattern(e);
}

/*** Vérification finale de l'insertion d'un point d'intérêt ***/
function preventSendPOI(e) {
    JSerrors[0].textContent = '';
    PHPerrors[0].textContent = '';
    
    if (
        (newTitle.value == '') || 
        (newDescription.value == '') || 
        (newAddress.value == '')
    ) {    
        e.preventDefault();
        JSerrors[0].innerHTML = 'Erreur : vous devez compléter ' +
            'les champs Titre, Description et Adresse.';
    }
    
    checkCategoryValue(e);
    checkPhoto(e);
    checkPhotoCopyright(e);
}

function checkCategoryValue(e) {
    let newCat = document.getElementById('category');
    if (newCat.value == 'chooseCategory') {
        e.preventDefault();
        JSerrors[0].innerHTML = 'Veuillez sélectionner une catégorie.';
    }
}

function checkPhoto(e){
    if (photo[0].value == '') {
        e.preventDefault();
        JSerrors[0].innerHTML = 'Veuillez choisir une photo.';
    }
}

function checkPhotoCopyright(e) {
    if(copyright.checked == false) {
        e.preventDefault();
        copyright.style.boxShadow = '1px 1px 5px 1px var(--main-color-red)';
        JSerrors[0].innerHTML = 'Erreur : vous devez confirmer que ' +
            'la photo proposée est libre de droits.';
    }
}

/*** Vérification finale de la mise à jour d'un point d'intérêt ***/
function preventSendPOIChanges(e) {
    JSerrors[0].textContent = '';
    PHPerrors[0].textContent = '';
    
    let registeredAddress = document.getElementById('registeredAddress');
    
    if (
        // si le champ Titre ou Description est vide
        (newTitle.value == '') ||
        (newDescription.value == '') ||
        // ou le champ Adresse 
        // ET le champ Nouvelle Adresse sont tous les deux vides 
        ((registeredAddress.value == '') && (newAddress.value == ''))
    ) {    
        e.preventDefault();
        JSerrors[0].innerHTML = 'Erreur : vous devez compléter ' +
            'les champs Titre, Description et Adresse.';
    }
    
    checkCategoryValue(e);
    
    // La photo n'est pas obligatoire
    // Mais si l'utilisateur décide de la changer,
    // vérifier qu'il ait bien coché la case concernant les droits de la photo
    if(photo[0].value != '') {
        checkPhotoCopyright(e);
    }
}

/*** DOMContentLoaded ***/         
document.addEventListener('DOMContentLoaded', function() {
    // Vérification en temps réel des formulaires
    for (let i = 0; i < inputs.length - 1; i++) {
        inputs[i].addEventListener('input', checkTyping);
        inputs[i].addEventListener('blur', checkForm);
    }
    
    // Vérification finale des formulaires
    // S'inscrire
    let submitRegistrationForm = document.getElementById('confirmRegistration');
    if (submitRegistrationForm != null) {
        submitRegistrationForm.addEventListener(
             'click', 
             preventSendRegistrationForm
        );
    }
    
    // Mon profil
    let submitProfileModif = document.getElementById('submitProfileModif');
    if (submitProfileModif != null) {
         submitProfileModif.addEventListener('click', preventSendProfilChanges);
    }
    
    // Envoyer un message
    let submitMessage = document.getElementById('confirmMessage');
    if (submitMessage != null) {
         submitMessage.addEventListener('click', preventSendForm);
    }
    
    // Se connecter
    let submitLogin = document.getElementById('confirmLogin');
    if (submitLogin != null) {
         submitLogin.addEventListener('click', preventSendForm);
    }
    
    // Enregister un POI
    let confirmCardCreation = document.getElementById('confirmCardCreation');
    if (confirmCardCreation != null) {
        confirmCardCreation.addEventListener('click', preventSendPOI);
    }
    
    // Mise à jour des POI
    let confirmChanges = document.getElementById('confirmChanges');
    if (confirmChanges != null) {
        confirmChanges.addEventListener('click', preventSendPOIChanges);
    }
}); 