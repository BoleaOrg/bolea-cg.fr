window.addEventListener('load', (event) => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    const mobileMenuLinks = document.getElementsByClassName('mobile-menu-link');
    for (mobileMenuLink of mobileMenuLinks) {
        mobileMenuLink.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});