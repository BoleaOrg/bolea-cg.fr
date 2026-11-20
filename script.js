document.addEventListener('DOMContentLoaded', () => {
    // ---------- Mobile menu ----------
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        const setMenuOpen = (open) => {
            mobileMenu.classList.toggle('hidden', !open);
            mobileMenuButton.setAttribute('aria-expanded', String(open));
            mobileMenuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
        };
        mobileMenuButton.addEventListener('click', () => {
            setMenuOpen(mobileMenu.classList.contains('hidden'));
        });
        for (const link of document.getElementsByClassName('mobile-menu-link')) {
            link.addEventListener('click', () => setMenuOpen(false));
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                setMenuOpen(false);
                mobileMenuButton.focus();
            }
        });
        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') && !e.target.closest('.site-header')) {
                setMenuOpen(false);
            }
        });
    }

    // ---------- Menu category bar: highlight the category on screen ----------
    const navBar = document.querySelector('.menu-nav ul');
    const navLinks = new Map(
        [...document.querySelectorAll('[data-nav-link]')].map((a) => [a.dataset.navLink, a])
    );
    if (navBar && navLinks.size && 'IntersectionObserver' in window) {
        let current = null;
        const setActive = (key) => {
            if (key === current) return;
            current = key;
            navLinks.forEach((a, k) => {
                if (k === key) {
                    a.setAttribute('aria-current', 'true');
                    const left = a.offsetLeft - (navBar.clientWidth - a.offsetWidth) / 2;
                    navBar.scrollTo({ left, behavior: 'smooth' });
                } else {
                    a.removeAttribute('aria-current');
                }
            });
        };
        const visible = new Map();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    visible.set(entry.target, entry.target.getBoundingClientRect().top);
                } else {
                    visible.delete(entry.target);
                }
            });
            if (!visible.size) return;
            // The topmost visible block in reading order wins.
            const first = [...visible.keys()].sort(
                (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
            )[0];
            setActive(first.dataset.nav);
        }, { rootMargin: '-160px 0px -55% 0px' });
        document.querySelectorAll('#menu [data-nav]').forEach((el) => observer.observe(el));
    }

    // ---------- Opening hours (Europe/Paris time) ----------
    // Minutes since midnight, indexed by day (0 = Sunday).
    const HOURS = {
        0: [[720, 1320]],
        1: [[720, 840], [990, 1320]],
        2: [[720, 840], [990, 1320]],
        3: [[720, 840], [990, 1320]],
        4: [[720, 840], [990, 1320]],
        5: [[720, 1380]],
        6: [[720, 1380]],
    };
    const DAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

    const parisNow = () => {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Europe/Paris',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
        }).formatToParts(new Date());
        const get = (type) => parts.find((p) => p.type === type).value;
        const hour = Number(get('hour'));
        const minute = Number(get('minute'));
        return { day: DAY_INDEX[get('weekday')], minutes: hour * 60 + minute, hour, minute };
    };

    const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`;
    };

    const statusText = ({ day, minutes }) => {
        const today = HOURS[day];
        const current = today.find(([open, close]) => minutes >= open && minutes < close);
        if (current) {
            return { open: true, text: `Ouvert maintenant, jusqu'à ${formatTime(current[1])}` };
        }
        const later = today.find(([open]) => minutes < open);
        if (later) {
            return { open: false, text: `Fermé pour le moment, ouvre à ${formatTime(later[0])}` };
        }
        const tomorrow = HOURS[(day + 1) % 7][0];
        return { open: false, text: `Fermé pour le moment, ouvre demain à ${formatTime(tomorrow[0])}` };
    };

    const statusEls = document.querySelectorAll('[data-status]');
    const clockEl = document.querySelector('[data-clock]');

    const refresh = () => {
        const now = parisNow();
        const status = statusText(now);
        statusEls.forEach((el) => {
            el.textContent = status.text;
            el.dataset.open = String(status.open);
            el.hidden = false;
        });
        if (clockEl) {
            clockEl.textContent = `${String(now.hour).padStart(2, '0')}:${String(now.minute).padStart(2, '0')}`;
        }
        document.querySelectorAll('.board-table tr[data-days]').forEach((row) => {
            if (Number(row.dataset.days) === now.day) {
                row.setAttribute('aria-current', 'date');
            } else {
                row.removeAttribute('aria-current');
            }
        });
    };

    try {
        refresh();
        setInterval(refresh, 30000);
    } catch (e) {
        // Intl not available: the static hours table remains visible.
    }
});
