"use strict";


/* ==========================
   CONFIGURAÇÃO RESPONSIVA
========================== */

const mobileNavigation = window.matchMedia(
    "(max-width: 900px)"
);


/* ==========================
   ELEMENTOS DA NAVBAR
========================== */

const header = document.querySelector(".header");

const logoLink = document.querySelector(
    ".navbar > .logo"
);

const navToggle = document.querySelector(
    ".nav-toggle"
);

const navMenu = document.querySelector(
    ".nav-menu"
);

const dropdown = document.querySelector(
    ".nav-item-dropdown"
);

const dropdownTrigger = document.querySelector(
    ".nav-dropdown-trigger"
);


/* ==========================
   VERIFICAR ESTADOS
========================== */

function isMobileNavigation() {
    return mobileNavigation.matches;
}


function isMobileMenuOpen() {
    return (
        header?.classList.contains("nav-open")
        ?? false
    );
}


function isSubmenuOpen() {
    return (
        dropdown?.classList.contains(
            "submenu-open"
        )
        ?? false
    );
}


/* ==========================
   CONTROLAR SUBMENU
========================== */

function setSubmenuState(isOpen) {

    if (!dropdown || !dropdownTrigger) {
        return;
    }


    dropdown.classList.toggle(
        "submenu-open",
        isOpen
    );


    dropdownTrigger.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

}


/* ==========================
   CONTROLAR MENU MOBILE
========================== */

function setMobileMenuState(
    isOpen,
    restoreToggleFocus = false
) {

    if (!header || !navToggle || !navMenu) {
        return;
    }


    /*
       O menu só pode permanecer aberto
       enquanto a navegação for mobile.
    */

    const shouldOpen =
        isOpen && isMobileNavigation();


    header.classList.toggle(
        "nav-open",
        shouldOpen
    );


    document.body.classList.toggle(
        "menu-open",
        shouldOpen
    );


    navToggle.setAttribute(
        "aria-expanded",
        String(shouldOpen)
    );


    navToggle.setAttribute(
        "aria-label",
        shouldOpen
            ? "Fechar menu"
            : "Abrir menu"
    );


    /*
       Ao fechar o menu principal,
       o submenu também é fechado.
    */

    if (!shouldOpen) {
        setSubmenuState(false);
    }


    /*
       Usado principalmente quando
       o menu é fechado pela tecla Esc.
    */

    if (
        restoreToggleFocus
        && !shouldOpen
    ) {
        navToggle.focus();
    }

}


/* ==========================
   ALTERNAR MENU MOBILE
========================== */

function toggleMobileMenu() {

    if (!isMobileNavigation()) {
        return;
    }


    setMobileMenuState(
        !isMobileMenuOpen()
    );

}


/* ==========================
   BOTÃO HAMBÚRGUER
========================== */

navToggle?.addEventListener(
    "click",
    toggleMobileMenu
);


/* ==========================
   SUBMENU PORTFÓLIO
========================== */

dropdownTrigger?.addEventListener(
    "click",
    () => {

        /*
           No desktop, o submenu continua
           controlado pelo hover e pelo foco
           definidos no CSS.
        */

        if (!isMobileNavigation()) {
            return;
        }


        setSubmenuState(
            !isSubmenuOpen()
        );

    }
);


/* ==========================
   FECHAR AO ESCOLHER UM LINK
========================== */

navMenu
    ?.querySelectorAll("a")
    .forEach((link) => {

        link.addEventListener(
            "click",
            () => {

                setMobileMenuState(false);

            }
        );

    });


/* ==========================
   FECHAR AO CLICAR NO LOGO
========================== */

logoLink?.addEventListener(
    "click",
    () => {

        setMobileMenuState(false);

    }
);


/* ==========================
   FECHAR AO CLICAR FORA
========================== */

document.addEventListener(
    "click",
    (event) => {

        if (!isMobileNavigation()) {
            return;
        }


        if (!isMobileMenuOpen()) {
            return;
        }


        if (!header) {
            return;
        }


        const clickedElement = event.target;


        if (!(clickedElement instanceof Node)) {
            return;
        }


        const clickedInsideHeader =
            header.contains(clickedElement);


        if (!clickedInsideHeader) {
            setMobileMenuState(false);
        }

    }
);


/* ==========================
   FECHAR COM A TECLA ESC
========================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key !== "Escape") {
            return;
        }


        if (
            isMobileNavigation()
            && isMobileMenuOpen()
        ) {

            setMobileMenuState(
                false,
                true
            );

            return;
        }


        /*
           Garante que qualquer estado
           interno antigo seja removido.
        */

        setSubmenuState(false);

    }
);


/* ==========================
   ALTERAÇÃO DE TAMANHO
========================== */

function handleNavigationChange() {

    /*
       Sempre que a navegação muda
       entre desktop e mobile, todos os
       estados anteriores são removidos.
    */

    setMobileMenuState(false);

}


/*
   Compatibilidade com navegadores
   modernos e versões anteriores.
*/

if (
    typeof mobileNavigation.addEventListener
    === "function"
) {

    mobileNavigation.addEventListener(
        "change",
        handleNavigationChange
    );

} else {

    mobileNavigation.addListener(
        handleNavigationChange
    );

}


/* ==========================
   ESTADO INICIAL
========================== */

setMobileMenuState(false);

setSubmenuState(false);