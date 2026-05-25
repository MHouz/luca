document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // STICKY HEADER & MOBILE NAV TOGGLE
  // ==========================================================================
  const header = document.querySelector('.header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // Set active link based on current page path
  const currentPath = window.location.pathname;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath.includes(href) && href !== 'index.html') {
      link.classList.add('active');
    } else if (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('index.html') || currentPath === '')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ==========================================================================
  // INTERSECTION OBSERVER FOR SCROLL REVEAL
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed to keep page performance high
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================================================
  // ANIMATED STATS COUNTER
  // ==========================================================================
  const statsSection = document.querySelector('.stats');
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statsSection && statNumbers.length > 0) {
    let countTriggered = false;

    const countUp = (element) => {
      const target = parseInt(element.getAttribute('data-target'), 10);
      const suffix = element.getAttribute('data-suffix') || '';
      let count = 0;
      const duration = 2000; // 2 seconds
      const speed = duration / target;

      const updateCount = () => {
        const increment = Math.ceil(target / 40); // divide target into chunks
        if (count < target) {
          count += increment;
          if (count > target) count = target;
          element.textContent = count + suffix;
          setTimeout(updateCount, 40);
        } else {
          element.textContent = target + suffix;
        }
      };

      updateCount();
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countTriggered) {
          countTriggered = true;
          statNumbers.forEach(statNumber => countUp(statNumber));
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    statsObserver.observe(statsSection);
  }

  // ==========================================================================
  // CONTACT FORM HANDLER WITH TOAST NOTIFICATION
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic field validation
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (!name || !email || !message) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
      }

      // Animate submit button
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" style="animation: spin 1s linear infinite; width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2;" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Envoi en cours...
      `;

      // CSS for spinner inside JS if not defined
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);

      // Simulate API call
      setTimeout(() => {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Show Toast Notification
        showToast('Votre message a été envoyé avec succès ! Nous vous recontacterons rapidement.');

        // Reset form
        contactForm.reset();
      }, 1500);
    });
  }

  // Toast Functionality
  function showToast(message) {
    // Check if toast already exists
    let toast = document.getElementById('toast');
    
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <svg style="width: 24px; height: 24px; fill: none; stroke: var(--success); stroke-width: 2;" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${message}</span>
    `;

    // Trigger reveal
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    // Hide after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
});
