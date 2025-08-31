// This file contains the main JavaScript functionality for the Crazy UI website.
// It initializes the website's features, sets up event listeners, and manages DOM interactions.

document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
    initializeModals();
    initializeWidgetCards();
    setupCrazyEffects();
});

function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggleButton = document.querySelector('.navbar-toggle');

    toggleButton.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.navbar-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    });
}

function initializeModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            modal.classList.add('active');
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.classList.remove('active');
            });
        });
    });
}

function initializeWidgetCards() {
    const cards = document.querySelectorAll('.widget-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hovered');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
        });
    });
}

function setupCrazyEffects() {
    const elements = document.querySelectorAll('.crazy-effect');
    elements.forEach(element => {
        element.addEventListener('click', () => {
            element.classList.toggle('crazy-active');
        });
    });
}