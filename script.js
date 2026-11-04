document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const navbar = document.getElementById('navbar');
  const typingTarget = document.querySelector('.typing-text');
  const contactForm = document.getElementById('contact-form');
  const submitButton = document.getElementById('button');

  // Mobile navigation with null guards and accessible expanded state.
  if (menuToggle && navLinks) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('active', open);
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // One theme mechanism only; retain the stylesheet's body.light-mode contract.
  const applyTheme = theme => {
    const light = theme === 'light';
    document.body.classList.toggle('light-mode', light);
    if (themeIcon) {
      themeIcon.classList.toggle('fa-sun', light);
      themeIcon.classList.toggle('fa-moon', !light);
    }
    if (themeToggle) themeToggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  };
  applyTheme(localStorage.getItem('theme') || 'dark');
  if (themeToggle) themeToggle.addEventListener('click', () => {
    const next = document.body.classList.contains('light-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });

  // Scroll-aware navbar.
  const updateNavbar = () => { if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50); };
  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  // Typing headline.
  if (typingTarget) {
    const roles = ['a Software Developer', 'Data Analyst', 'AI Enthusiast', 'Digital Marketer', 'Cybersecurity Enthusiast', 'Networking Specialist'];
    let roleIndex = 0, charIndex = 0, deleting = false;
    const type = () => {
      const role = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      typingTarget.textContent = role.substring(0, charIndex);
      let delay = deleting ? 55 : 110;
      if (!deleting && charIndex === role.length) { deleting = true; delay = 1700; }
      else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 350; }
      window.setTimeout(type, delay);
    };
    type();
  }

  // Reveal animations, with graceful fallback for browsers without IntersectionObserver.
  const revealItems = document.querySelectorAll('section > .section-container > h2, .glass-card, .highlight-card, .about-text, .hero-text, .hero-photo, .contact-column, .contact-form');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(el => { el.classList.add('fade-in'); observer.observe(el); });
  } else revealItems.forEach(el => el.classList.add('visible'));

  // EmailJS: restore the button after both successful and failed submissions.
  if (contactForm) contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!window.emailjs || typeof window.emailjs.sendForm !== 'function') {
      showToast('Contact service unavailable. Please email me directly.');
      return;
    }
    const original = submitButton ? submitButton.innerHTML : 'Send Message';
    if (submitButton) { submitButton.disabled = true; submitButton.textContent = 'Sending…'; }
    try {
      await window.emailjs.sendForm('service_ecenk1r', 'template_sfeek07', contactForm);
      showToast('Thank you! Your message has been sent.');
      contactForm.reset();
    } catch (error) {
      console.error('EmailJS error:', error);
      showToast('Message could not be sent. Please try again or email me directly.');
    } finally {
      if (submitButton) { submitButton.disabled = false; submitButton.innerHTML = original; }
    }
  });
});

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  window.setTimeout(() => {
    toast.classList.remove('show');
    window.setTimeout(() => toast.remove(), 500);
  }, 3500);
}
