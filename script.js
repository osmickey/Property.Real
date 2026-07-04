// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-menu');

toggle?.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

menu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open menu');
  });
});

// Header scroll state
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 60);
}, { passive: true });

// Scroll reveal
const revealEls = document.querySelectorAll('.property-card, .trust__item, .gallery__item, .split__content, .split__media, .form-wrap__copy, .lead-form');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Stagger property cards
document.querySelectorAll('.property-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.12}s`;
});

// Form validation + submit
const form = document.getElementById('lead-form');
const status = document.getElementById('form-status');

function clearFieldErrors() {
  form?.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = '';
  status.className = 'form-note';
  clearFieldErrors();

  const data = Object.fromEntries(new FormData(form));
  let hasError = false;

  if (!data.name?.trim()) {
    form.querySelector('#name')?.classList.add('is-invalid');
    hasError = true;
  }
  if (!data.email?.trim() || !validateEmail(data.email)) {
    form.querySelector('#email')?.classList.add('is-invalid');
    hasError = true;
  }
  if (!data.phone?.trim()) {
    form.querySelector('#phone')?.classList.add('is-invalid');
    hasError = true;
  }
  if (!data.interest) {
    form.querySelector('#interest')?.classList.add('is-invalid');
    hasError = true;
  }

  if (hasError) {
    status.textContent = 'Please check the highlighted fields and try again.';
    status.classList.add('error');
    return;
  }

  try {
    // await fetch('/api/enquiry', { method: 'POST', body: JSON.stringify(data) });
    status.textContent = 'Thank you! Our team will contact you within 48 hours.';
    status.classList.add('success');
    form.reset();
  } catch {
    status.textContent = 'Something went wrong. Please try again or call us directly.';
    status.classList.add('error');
  }
});

form?.querySelectorAll('input, select').forEach(field => {
  field.addEventListener('input', () => field.classList.remove('is-invalid'));
});
