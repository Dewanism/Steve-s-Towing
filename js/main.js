const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
    const SCROLL_THRESHOLD = 40;

    const updateHeaderState = () => {
        siteHeader.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
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
