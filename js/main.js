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

// ---------------------------------------------------------------------
// Sticky mobile "Call Now" button: stays out of the way while the page
// banner (which has its own Call Now button) or the footer (its own call
// button and phone number) is on screen, so it never covers either.
// CSS only shows it below 768px.
// ---------------------------------------------------------------------
const mobileCallBar = document.querySelector('.mobile-call-bar');
const callBarBlockers = [...document.querySelectorAll('.hero, .page-hero, footer')];

if (mobileCallBar && callBarBlockers.length) {
    // A blocker counts as "on screen" once it reaches into the bottom 80px
    // band where the button sits, or anywhere above it.
    const updateCallBar = () => {
        const limit = window.innerHeight - 80;
        const blocked = callBarBlockers.some((el) => {
            const r = el.getBoundingClientRect();
            return r.bottom > 0 && r.top < limit;
        });
        mobileCallBar.classList.toggle('is-hidden', blocked);
    };

    let callBarTicking = false;
    const onCallBarScroll = () => {
        if (callBarTicking) return;
        callBarTicking = true;
        requestAnimationFrame(() => {
            updateCallBar();
            callBarTicking = false;
        });
    };

    updateCallBar();
    window.addEventListener('scroll', onCallBarScroll, { passive: true });
    window.addEventListener('resize', onCallBarScroll, { passive: true });
}

// ---------------------------------------------------------------------------
// Wrapped section headings: shrink each one to its longest line so the
// coloured bar underneath matches the text instead of the full column width
// ---------------------------------------------------------------------------
const barHeadings = [...document.querySelectorAll('.section-heading h2, .about-story-copy h2')];
if (barHeadings.length) {
    const fitHeading = (h) => {
        h.style.width = '';
        // Boxes for every piece of the heading: plain text, plus whole
        // highlight spans (their padding counts toward the line width)
        const rects = [];
        for (const node of h.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const range = document.createRange();
                range.selectNodeContents(node);
                rects.push(...range.getClientRects());
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                rects.push(...node.getClientRects());
            }
        }
        // Group into visual lines: boxes whose vertical centres share a line
        const lines = [];
        for (const r of rects) {
            if (!r.width) continue;
            const mid = (r.top + r.bottom) / 2;
            const line = lines.find((l) => mid > l.top && mid < l.bottom);
            if (line) {
                line.left = Math.min(line.left, r.left);
                line.right = Math.max(line.right, r.right);
                line.top = Math.min(line.top, r.top);
                line.bottom = Math.max(line.bottom, r.bottom);
            } else {
                lines.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
            }
        }
        if (lines.length < 2) return; // single-line headings already fit their text
        const widest = Math.max(...lines.map((l) => l.right - l.left));
        h.style.width = `${Math.ceil(widest) + 4}px`;
    };
    const fitAll = () => barHeadings.forEach(fitHeading);
    let fitTimer;
    window.addEventListener('resize', () => {
        clearTimeout(fitTimer);
        fitTimer = setTimeout(fitAll, 120);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
    fitAll();
}
