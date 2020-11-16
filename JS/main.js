'use strict';

function displayMenu () {
    let menu = document.getElementById('responsivemenu');
    
    if (menu.style.display == "none") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}

function backToIndex(e) {
    e.preventDefault;
    window.location.href = '../index.php';
}
    
document.addEventListener('DOMContentLoaded', function() {
    // Vue mobile - Afficher le menu
    let menuIcon = document.getElementById('responsivemenu-icon');
    menuIcon.addEventListener('click', displayMenu);

    // boutons Annuler
    let cancelButton = document.getElementsByClassName('cancel');
    for(let i = 0; i < cancelButton.length; i++) {
        cancelButton[i].addEventListener('click', backToIndex);
    }
});