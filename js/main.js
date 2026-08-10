// ---------------------------------------------------------------------
// Sticky header: adds `.is-scrolled` once the page scrolls past the
// threshold, which CSS uses to shrink the logo and tighten padding.
// ---------------------------------------------------------------------
const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
    const SCROLL_THRESHOLD = 40;

    const updateHeaderState = () => {
        siteHeader.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    };

    // Coalesce scroll events to one DOM update per animation frame so
    // the class toggle doesn't run on every single scroll tick.
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

// ---------------------------------------------------------------------
// Mobile nav: hamburger toggle, accordion-style dropdown submenus, and
// the various ways the menu should close (link click, outside click,
// Escape key). On desktop the dropdowns open via CSS :hover instead,
// so this logic only takes over below the 768px breakpoint.
// ---------------------------------------------------------------------
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

    // Hamburger button opens/closes the whole mobile menu panel.
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('nav-open', isOpen);
    });

    // "Services" / "Service Areas" links expand their submenu in place
    // instead of navigating, but only on mobile — on desktop this same
    // link should still go to its href, so bail out above 768px.
    navLinks.querySelectorAll('.has-dropdown > a').forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
            if (!window.matchMedia('(max-width: 768px)').matches) return;
            e.preventDefault();
            trigger.parentElement.classList.toggle('dropdown-open');
        });
    });

    // Any actual navigation link (top-level or inside a submenu) should
    // close the mobile menu behind it.
    navLinks.querySelectorAll('li:not(.has-dropdown) > a, .dropdown-menu a').forEach((link) => {
        link.addEventListener('click', closeNav);
    });

    // Clicking anywhere outside the open menu (and not the toggle
    // button itself) closes it.
    document.addEventListener('click', (e) => {
        if (!navLinks.classList.contains('is-open')) return;
        if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
        closeNav();
    });

    // Escape closes the menu and returns focus to the toggle button.
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
            closeNav();
            navToggle.focus();
        }
    });
}

// ---------------------------------------------------------------------
// Award-photo lightbox: clicking a `[data-lightbox-target]` trigger
// opens the matching modal (matched by element id) as a simple, no
// third-party-library image viewer.
// ---------------------------------------------------------------------
const lightboxTriggers = document.querySelectorAll('[data-lightbox-target]');

if (lightboxTriggers.length) {
    let activeModal = null;
    let lastTrigger = null;

    const closeModal = () => {
        if (!activeModal) return;
        activeModal.hidden = true;
        document.body.classList.remove('lightbox-open');
        // Return focus to whatever opened the modal, for keyboard users.
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

    // Escape closes whichever modal is currently open.
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeModal) closeModal();
    });
}
