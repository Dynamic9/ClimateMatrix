/* ============================================
   Dynamic 9 — Main JavaScript
   ============================================ */

(function () {
    'use strict';

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');

    function handleScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- Mobile navigation toggle ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
            mobileToggle.classList.toggle('active');
        });

        // Close mobile nav when a link is clicked
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                mobileToggle.classList.remove('active');
            });
        });
    }

    // --- Animated stat counters ---
    function animateCounters() {
        var counters = document.querySelectorAll('.stat-number[data-target]');
        counters.forEach(function (counter) {
            if (counter.dataset.animated) return;

            var target = parseInt(counter.dataset.target, 10);
            var duration = 1500;
            var start = 0;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                counter.textContent = Math.floor(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.textContent = target;
                }
            }

            counter.dataset.animated = 'true';
            requestAnimationFrame(step);
        });
    }

    // Use IntersectionObserver if available
    var statsSection = document.querySelector('.hero-stats');
    if (statsSection && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    } else if (statsSection) {
        animateCounters();
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var offset = navbar.offsetHeight + 20;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // --- Contact form handling ---
    var contactForm = document.getElementById('contactForm');
    var formSuccess = document.getElementById('formSuccess');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Collect form data
            var formData = new FormData(contactForm);
            var data = {};
            formData.forEach(function (value, key) {
                data[key] = value;
            });

            // For now, simulate submission (replace with real endpoint later)
            console.log('Form submitted:', data);

            // Show success message
            contactForm.style.display = 'none';
            formSuccess.classList.add('visible');
        });
    }

    // --- Fade-in on scroll ---
    function setupScrollAnimations() {
        var elements = document.querySelectorAll(
            '.service-card, .process-step, .tool-card, .tool-preview, ' +
            '.value-card, .expertise-card, .contact-info-card'
        );

        if (!('IntersectionObserver' in window)) {
            elements.forEach(function (el) { el.style.opacity = '1'; });
            return;
        }

        elements.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        var fadeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Stagger animations within the same parent
                    var parent = entry.target.parentElement;
                    var siblings = Array.from(parent.children);
                    var index = siblings.indexOf(entry.target);
                    var delay = index * 80;

                    setTimeout(function () {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);

                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        elements.forEach(function (el) {
            fadeObserver.observe(el);
        });
    }

    setupScrollAnimations();

})();
