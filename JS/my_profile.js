'use strict';

let deleteAccount = document.getElementById('deleteAccount');

function requestAccountRemoval(){
    let askForConfirmation = window.confirm(
        'Voulez-vous vraiment supprimer votre compte ?'
    );
    if (askForConfirmation == true) {
        deleteMyAccount();
    }
}

function deleteMyAccount(){
    let deleteThisId = {id : deleteAccount.dataset.index};
    let url = '../MVC_model/AJAX/delete_my_profile.php';
    $.post(url, deleteThisId, logOut);
}

function logOut() {
    window.location.href = '../MVC_controller/logout.php';
}

document.addEventListener('DOMContentLoaded', function() {
    if (deleteAccount != null) {
        deleteAccount.addEventListener('click', requestAccountRemoval);
    }
});