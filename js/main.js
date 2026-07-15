const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
    const SCROLL_THRESHOLD = 40;

    const updateHeaderState = () => {
        siteHeader.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
}
