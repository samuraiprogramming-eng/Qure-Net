document.querySelector('.main-header__responsive-icon').addEventListener('click', function () {
    document.querySelector('.main-header').classList.toggle('main-header--open');
});

document.querySelector('.main-header__overlay').addEventListener('click', function () {
    document.querySelector('.main-header').classList.toggle('main-header--open');
});

// // dialog function 

// var dialog = document.getElementById("dialog"),
//     dialogContent = document.getElementById("dialog__content");

// // open dialog

// function openDialogPop() {
//     dialog.classList.add("dialog--open");
//     dialogContent.classList.add("dialog__content--open");
// }

// // close dialog 

// function closeDialogPop() {
//     dialog.classList.remove("dialog--open");
//     dialogContent.classList.remove("dialog__content--open");
// }

// for (var i = 0; i < dialogContent.length; i++) {
//     dialogContent[i].addEventListener('click', closeDialogPop);
// }

// document.onkeydown = function (evt) {
//     evt = evt || window.event;
//     if (evt.keyCode == 27) {
//         closeDialogPop();
//     }
// };

/**
*Exampe from https://kottenator.github.io/jquery-circle-progress/
*/


