document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            history.replaceState(null, '', this.getAttribute('href'));
        });
    });

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenuButton || !mobileMenu) return;

    const setMenuOpen = (open) => {
        mobileMenu.classList.toggle('hidden', !open);
        mobileMenuButton.setAttribute('aria-expanded', String(open));
    };

    mobileMenuButton.addEventListener('click', () => {
        setMenuOpen(mobileMenu.classList.contains('hidden'));
    });

    for (const link of document.getElementsByClassName('mobile-menu-link')) {
        link.addEventListener('click', () => setMenuOpen(false));
    }
});
