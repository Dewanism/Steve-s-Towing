const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
    const SCROLL_THRESHOLD = 40;

    const updateHeaderState = () => {
        siteHeader.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    };

    let scrollTicking = false;
    const onScroll = () => {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
            updateHeaderState();
            scrollTicking = false;
        });
    };

    updateHeaderState();
    window.addEventListener('scroll', onScroll, { passive: true });
}

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.main-nav .nav-links');

if (navToggle && navLinks) {
    const closeNav = () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
        document.body.classList.remove('nav-open');
        navLinks.querySelectorAll('.has-dropdown.dropdown-open').forEach((li) => {
            li.classList.remove('dropdown-open');
        });
    };

    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('nav-open', isOpen);
    });

    navLinks.querySelectorAll('.has-dropdown > a').forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
            if (!window.matchMedia('(max-width: 768px)').matches) return;
            e.preventDefault();
            trigger.parentElement.classList.toggle('dropdown-open');
        });
    });

    navLinks.querySelectorAll('li:not(.has-dropdown) > a, .dropdown-menu a').forEach((link) => {
        link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', (e) => {
        if (!navLinks.classList.contains('is-open')) return;
        if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
        closeNav();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
            closeNav();
            navToggle.focus();
        }
    });
}

const lightboxTriggers = document.querySelectorAll('[data-lightbox-target]');

if (lightboxTriggers.length) {
    let activeModal = null;
    let lastTrigger = null;

    const closeModal = () => {
        if (!activeModal) return;
        activeModal.hidden = true;
        document.body.classList.remove('lightbox-open');
        if (lastTrigger) lastTrigger.focus();
        activeModal = null;
        lastTrigger = null;
    };

    const openModal = (modal, trigger) => {
        activeModal = modal;
        lastTrigger = trigger;
        modal.hidden = false;
        document.body.classList.add('lightbox-open');
        const closeBtn = modal.querySelector('.lightbox-close');
        if (closeBtn) closeBtn.focus();
    };

    lightboxTriggers.forEach((trigger) => {
        const modal = document.getElementById(trigger.dataset.lightboxTarget);
        if (!modal) return;

        trigger.addEventListener('click', () => openModal(modal, trigger));

        modal.querySelectorAll('[data-lightbox-close]').forEach((el) => {
            el.addEventListener('click', closeModal);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeModal) closeModal();
    });
}
