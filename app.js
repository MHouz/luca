/* ==========================================================================
   INTERACTIVE SCRIPT - GROUPE LUCA CENTER
   Cabinet de Comptabilité & de Gestion - Ali El Alaoui
   Aesthetics: Ultra-responsive, smooth scroll, elegant numbers & reveals (2026 Style)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Frosted Header ---
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    const isDarkPage = navbarWrapper ? navbarWrapper.classList.contains('on-dark-page') : false;
    
    const handleScroll = () => {
        if (window.scrollY > 40) {
            if (isDarkPage) {
                navbarWrapper.classList.add('scrolled-dark');
            } else {
                navbarWrapper.classList.add('scrolled');
            }
        } else {
            if (isDarkPage) {
                navbarWrapper.classList.remove('scrolled-dark');
            } else {
                navbarWrapper.classList.remove('scrolled');
            }
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case user loads page scrolled down
    
    
    // --- 2. Mobile Drawer Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close menu on click outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Escape key support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        });
    }
    
    function openMobileMenu() {
        hamburger.classList.add('open');
        navMenu.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock scrolling behind menu
        hamburger.setAttribute('aria-expanded', 'true');
    }
    
    function closeMobileMenu() {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = ''; // Unlock scrolling
        hamburger.setAttribute('aria-expanded', 'false');
    }
    
    
    // --- 3. Scroll Reveal Elements (IntersectionObserver) ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Trigger once
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }
    
    
    // --- 4. Statistic Numbers Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateStatNumber = (element) => {
        const target = parseFloat(element.getAttribute('data-target'));
        const duration = 2000; // ms
        const startTime = performance.now();
        const startValue = 0;
        
        const updateNumber = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // EaseOutQuad function for smooth deceleration
            const easeProgress = progress * (2 - progress);
            const currentValue = startValue + easeProgress * (target - startValue);
            
            // Format number based on decimals needed
            if (Number.isInteger(target)) {
                element.textContent = Math.floor(currentValue).toString();
            } else {
                element.textContent = currentValue.toFixed(1);
            }
            
            // Append visual characters if provided
            const suffix = element.getAttribute('data-suffix') || '';
            element.textContent += suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target + suffix; // Guarantee absolute final target value
            }
        };
        
        requestAnimationFrame(updateNumber);
    };
    
    if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStatNumber(entry.target);
                    observer.unobserve(entry.target); // Animate once
                }
            });
        }, {
            threshold: 0.5
        });
        
        statNumbers.forEach(stat => {
            statsObserver.observe(stat);
        });
    } else {
        // Fallback
        statNumbers.forEach(stat => {
            const target = stat.getAttribute('data-target');
            const suffix = stat.getAttribute('data-suffix') || '';
            stat.textContent = target + suffix;
        });
    }
    
    
    // --- 5. Interactive Premium Contact Form Handler ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Select and validate inputs
            const nomInput = document.getElementById('nom');
            const emailInput = document.getElementById('email');
            const telephoneInput = document.getElementById('telephone');
            const serviceInput = document.getElementById('service');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            
            // Quick Validation Helper
            const validateField = (input, condition, errorMessage) => {
                const group = input.closest('.form-group');
                let feedback = group.querySelector('.form-feedback');
                
                if (!condition) {
                    isValid = false;
                    input.style.borderColor = '#E02424'; // Red error border
                    input.style.boxShadow = '0 0 0 4px rgba(224, 36, 36, 0.1)';
                    
                    if (!feedback) {
                        feedback = document.createElement('span');
                        feedback.className = 'form-feedback';
                        feedback.style.color = '#E02424';
                        feedback.style.fontSize = '0.8rem';
                        feedback.style.marginTop = '0.4rem';
                        feedback.style.display = 'block';
                        group.appendChild(feedback);
                    }
                    feedback.textContent = errorMessage;
                } else {
                    input.style.borderColor = ''; // Reset
                    input.style.boxShadow = '';
                    if (feedback) {
                        feedback.remove();
                    }
                }
            };
            
            // Name Check
            validateField(nomInput, nomInput.value.trim().length >= 2, "Veuillez saisir au moins 2 caractères.");
            
            // Email Check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            validateField(emailInput, emailRegex.test(emailInput.value.trim()), "Veuillez saisir une adresse e-mail valide.");
            
            // Message Check
            validateField(messageInput, messageInput.value.trim().length >= 10, "Votre message doit contenir au moins 10 caractères.");
            
            if (isValid) {
                // Change submit button state to animate
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg class="spinner" viewBox="0 0 50 50" style="width: 1.25rem; height: 1.25rem; animation: spin 1s linear infinite; margin-right: 0.5rem; display: inline-block;">
                        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-dasharray="80, 200" style="stroke: #FFFFFF;"></circle>
                    </svg>
                    Envoi en cours...
                `;
                
                // Add keyframes for spinner on-the-fly if not already defined
                if (!document.getElementById('spinner-keyframes')) {
                    const style = document.createElement('style');
                    style.id = 'spinner-keyframes';
                    style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
                    document.head.appendChild(style);
                }
                
                // Simulate elegant server call
                setTimeout(() => {
                    // Replace form content with success state
                    const formCard = contactForm.closest('.contact-form-card');
                    formCard.style.transition = 'all 0.5s ease';
                    formCard.style.opacity = '0';
                    
                    setTimeout(() => {
                        formCard.innerHTML = `
                            <div style="text-align: center; padding: 2rem 0;">
                                <div style="width: 4.5rem; height: 4.5rem; background: var(--bg-purple-gradient); color: var(--text-light); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 2rem; box-shadow: var(--shadow-primary); animation: scaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <h3 style="margin-bottom: 1rem; color: var(--deep-navy);">Message Envoyé avec Succès !</h3>
                                <p style="color: var(--text-muted); max-width: 420px; margin: 0 auto 2.5rem auto; font-size: 1rem;">
                                    Merci, <strong>${nomInput.value.trim()}</strong>. Ali El Alaoui ou un conseiller du cabinet Groupe Luca Center vous contactera sous 24 heures ouvrées.
                                </p>
                                <button onclick="window.location.reload();" class="btn btn-primary" style="padding: 0.75rem 1.75rem; font-size: 0.9rem;">
                                    Envoyer un autre message
                                </button>
                            </div>
                        `;
                        formCard.style.opacity = '1';
                        
                        // Scroll slightly to success header if needed
                        formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 500);
                    
                }, 1800);
            }
        });
    }
});
