
document.addEventListener('DOMContentLoaded', () => {

  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const navbar = document.getElementById('navbar');
  const typingTarget = document.querySelector('.typing-text');
  const contactForm = document.getElementById('contact-form');
  const submitButton = document.getElementById('button');

  // ==========================================
  // 1. MOBILE NAVIGATION
  // ==========================================

  if (menuToggle && navLinks) {

    menuToggle.setAttribute('aria-expanded', 'false');

    menuToggle.addEventListener('click', () => {

      const isOpen = navLinks.classList.toggle('open');

      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));

    });

    navLinks.querySelectorAll('a').forEach(link => {

      link.addEventListener('click', () => {

        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');

      });

    });

  }


  // ==========================================
  // 2. DARK AND LIGHT MODE
  // ==========================================

  const applyTheme = (theme) => {

    const isLight = theme === 'light';

    // Use the body.light-mode class expected by the stylesheet.
    document.body.classList.toggle('light-mode', isLight);

    if (themeIcon) {

      themeIcon.classList.toggle('fa-sun', isLight);
      themeIcon.classList.toggle('fa-moon', !isLight);

    }

    if (themeToggle) {

      themeToggle.setAttribute(
        'aria-label',
        isLight ? 'Switch to dark mode' : 'Switch to light mode'
      );

      themeToggle.setAttribute('aria-pressed', String(isLight));

    }

  };

  // Load the saved theme safely.
  let savedTheme = 'dark';

  try {

    savedTheme = localStorage.getItem('theme') || 'dark';

  } catch (error) {

    console.warn('Could not access saved theme:', error);

  }

  applyTheme(savedTheme);

  if (themeToggle) {

    themeToggle.addEventListener('click', () => {

      const newTheme = document.body.classList.contains('light-mode')
        ? 'dark'
        : 'light';

      applyTheme(newTheme);

      try {

        localStorage.setItem('theme', newTheme);

      } catch (error) {

        console.warn('Could not save theme:', error);

      }

    });

  }


  // ==========================================
  // 3. NAVBAR SCROLL EFFECT
  // ==========================================

  const updateNavbar = () => {

    if (navbar) {

      navbar.classList.toggle('scrolled', window.scrollY > 50);

    }

  };

  updateNavbar();

  window.addEventListener('scroll', updateNavbar, { passive: true });


  // ==========================================
  // 4. TYPEWRITER EFFECT
  // ==========================================

  if (typingTarget) {

    const roles = [
      'a Software Developer',
      'Data Analyst',
      'AI Enthusiast',
      'Digital Marketer',
      'Cybersecurity Enthusiast',
      'Networking Specialist'
    ];

    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = false;

    const type = () => {

      const currentRole = roles[roleIndex];

      if (deleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      typingTarget.textContent = currentRole.substring(0, charIndex);

      let delay = deleting ? 55 : 110;

      if (!deleting && charIndex === currentRole.length) {

        deleting = true;
        delay = 1700;

      } else if (deleting && charIndex === 0) {

        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 350;

      }

      window.setTimeout(type, delay);

    };

    // Allow the first role to remain visible before animation starts.
    window.setTimeout(type, 2200);

  }


  // ==========================================
  // 5. SCROLL REVEAL ANIMATIONS
  // ==========================================

  const revealItems = document.querySelectorAll(
    'section > .section-container > h2, .glass-card, .highlight-card, .about-text, .hero-text, .hero-photo, .contact-column, .contact-form'
  );

  if ('IntersectionObserver' in window) {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add('visible');
            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealItems.forEach(element => {

      element.classList.add('fade-in');
      observer.observe(element);

    });

  } else {

    revealItems.forEach(element => {

      element.classList.add('visible');

    });

  }


  // ==========================================
  // 6. CONTACT FORM - EMAILJS
  // ==========================================

  if (contactForm) {

    contactForm.addEventListener('submit', async (event) => {

      event.preventDefault();

      // Check whether EmailJS is available.
      if (
        !window.emailjs ||
        typeof window.emailjs.sendForm !== 'function'
      ) {

        showToast(
          'Contact service unavailable. Please email me directly.',
          true
        );

        return;

      }

      const originalButtonContent = submitButton
        ? submitButton.innerHTML
        : 'Send Message';

      // Prevent repeated submissions.
      if (submitButton) {

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

      }

      try {

        await window.emailjs.sendForm(
          'service_ecenk1r',
          'template_sfeek07',
          contactForm
        );

        showToast('Thank you! Your message has been sent.');

        contactForm.reset();

      } catch (error) {

        console.error('EmailJS error:', error);

        showToast(
          'Message could not be sent. Please try again or email me directly.',
          true
        );

      } finally {

        // Restore the button after success or failure.
        if (submitButton) {

          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonContent;

        }

      }

    });

  }

});


// ==========================================
// 7. TOAST NOTIFICATIONS
// ==========================================

function showToast(message, isError = false) {

  const toast = document.createElement('div');

  toast.className = 'toast-notification';

  if (isError) {
    toast.classList.add('error');
  }

  toast.setAttribute('role', isError ? 'alert' : 'status');
  toast.setAttribute('aria-live', isError ? 'assertive' : 'polite');

  toast.textContent = message;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {

    toast.classList.add('show');

  });

  window.setTimeout(() => {

    toast.classList.remove('show');

    window.setTimeout(() => {

      toast.remove();

    }, 500);

  }, 3500);

}
