// This file contains JavaScript functions that implement various user interface effects, such as hover effects, transitions, and dynamic content updates.

document.addEventListener('DOMContentLoaded', () => {
    // Hover effects for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('transform', 'scale-105', 'transition-transform', 'duration-300');
        });
        button.addEventListener('mouseleave', () => {
            button.classList.remove('transform', 'scale-105', 'transition-transform', 'duration-300');
        });
    });

    // Dynamic content updates for widget cards
    const widgetCards = document.querySelectorAll('.widget-card');
    widgetCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('bg-blue-100');
            const content = card.querySelector('.card-content');
            content.classList.toggle('hidden');
        });
    });

    // Modal open and close effects
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            modal.classList.remove('hidden');
            modal.classList.add('fade-in');
        });
    });

    modals.forEach(modal => {
        const closeButton = modal.querySelector('.close-modal');
        closeButton.addEventListener('click', () => {
            modal.classList.add('fade-out');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('fade-out');
            }, 300);
        });
    });

    // Add animations to elements on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const options = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
});