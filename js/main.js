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

/* ==========================
   COOKIES E GOOGLE ANALYTICS
========================== */

const GA_MEASUREMENT_ID = "G-DVXXTFLW2";

const COOKIE_CONSENT_KEY =
    "413-cookie-consent";

let analyticsConfigured = false;


/* ==========================
   GUARDAR E LER PREFERÊNCIA
========================== */

function getCookieConsent() {

    try {
        return localStorage.getItem(
            COOKIE_CONSENT_KEY
        );
    } catch {
        return null;
    }

}


function saveCookieConsent(value) {

    try {
        localStorage.setItem(
            COOKIE_CONSENT_KEY,
            value
        );
    } catch {
        /*
           O site continua funcionando caso
           o navegador bloqueie o localStorage.
        */
    }

}


/* ==========================
   ATUALIZAR CONSENTIMENTO
========================== */

function updateGoogleConsent(isAccepted) {

    if (typeof window.gtag !== "function") {
        return;
    }

    window.gtag(
        "consent",
        "update",
        {
            analytics_storage:
                isAccepted
                    ? "granted"
                    : "denied",

            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied"
        }
    );

}


/* ==========================
   CARREGAR GOOGLE ANALYTICS
========================== */

function loadGoogleAnalytics() {

    if (
        document.querySelector(
            "[data-google-analytics]"
        )
    ) {
        return;
    }

    const googleTag =
        document.createElement("script");

    googleTag.async = true;

    googleTag.src =
        `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

    googleTag.dataset.googleAnalytics =
        "true";

    document.head.appendChild(googleTag);

}


function startGoogleAnalytics() {

    updateGoogleConsent(true);

    loadGoogleAnalytics();

    if (
        typeof window.gtag !== "function"
        || analyticsConfigured
    ) {
        return;
    }

    window.gtag(
        "js",
        new Date()
    );

    window.gtag(
        "config",
        GA_MEASUREMENT_ID
    );

    analyticsConfigured = true;

}


/* ==========================
   REMOVER COOKIES ANALYTICS
========================== */

function removeAnalyticsCookies() {

    document.cookie
        .split(";")
        .forEach((cookie) => {

            const cookieName =
                cookie
                    .split("=")[0]
                    .trim();

            if (
                !cookieName.startsWith("_ga")
            ) {
                return;
            }

            document.cookie =
                `${cookieName}=; Max-Age=0; path=/; SameSite=Lax`;

        });

}


/* ==========================
   CRIAR BANNER
========================== */

function createCookieBanner() {

    const banner =
        document.createElement("section");

    banner.className = "cookie-banner";

    banner.id = "cookie-banner";

    banner.setAttribute(
        "role",
        "dialog"
    );

    banner.setAttribute(
        "aria-label",
        "Preferências de cookies"
    );

    banner.setAttribute(
        "aria-live",
        "polite"
    );

    banner.hidden = true;

    banner.innerHTML = `
        <div class="cookie-banner__content">

            <div class="cookie-banner__text">

                <strong>
                    Cookies e privacidade
                </strong>

                <p>
                    Utilizamos cookies opcionais do
                    Google Analytics para compreender
                    as visitas ao site. Pode aceitar
                    ou recusar estes cookies.
                </p>

            </div>

            <div class="cookie-banner__actions">

                <button
                    type="button"
                    class="cookie-button cookie-button--secondary"
                    data-cookie-reject
                >
                    Recusar
                </button>

                <button
                    type="button"
                    class="cookie-button cookie-button--primary"
                    data-cookie-accept
                >
                    Aceitar
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(banner);


    const acceptButton =
        banner.querySelector(
            "[data-cookie-accept]"
        );

    const rejectButton =
        banner.querySelector(
            "[data-cookie-reject]"
        );


    /* BOTÃO NO RODAPÉ */

    const footerBottom =
        document.querySelector(
            ".footer-bottom"
        );

    const settingsButton =
        document.createElement("button");

    settingsButton.type = "button";

    settingsButton.className =
        "footer-cookie-settings";

    settingsButton.textContent =
        "Gerir cookies";

    footerBottom?.appendChild(
        settingsButton
    );


    /* ESTADO GUARDADO */

    const savedConsent =
        getCookieConsent();

    if (savedConsent === "accepted") {

        startGoogleAnalytics();

    } else if (
        savedConsent === "rejected"
    ) {

        updateGoogleConsent(false);
        removeAnalyticsCookies();

    } else {

        banner.hidden = false;

    }


    /* ACEITAR */

    acceptButton?.addEventListener(
        "click",
        () => {

            saveCookieConsent(
                "accepted"
            );

            startGoogleAnalytics();

            banner.hidden = true;

        }
    );


    /* RECUSAR */

    rejectButton?.addEventListener(
        "click",
        () => {

            saveCookieConsent(
                "rejected"
            );

            updateGoogleConsent(false);

            removeAnalyticsCookies();

            banner.hidden = true;

        }
    );


    /* REABRIR PREFERÊNCIAS */

    settingsButton.addEventListener(
        "click",
        () => {

            banner.hidden = false;

            acceptButton?.focus();

        }
    );

}


createCookieBanner();