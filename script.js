document.documentElement.classList.add('js');

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const searchButton = document.querySelector('[data-search-toggle]');
const searchPanel = document.querySelector('[data-search-panel]');
const searchInput = document.querySelector('[data-search-input]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setHeaderState = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.sr-only').textContent = 'Open menu';
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

function closeSearch() {
  searchButton.setAttribute('aria-expanded', 'false');
  searchButton.setAttribute('aria-label', 'Open search');
  searchPanel.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  closeSearch();
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
  nav.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});

searchButton.addEventListener('click', () => {
  const open = searchButton.getAttribute('aria-expanded') !== 'true';
  closeMenu();
  searchButton.setAttribute('aria-expanded', String(open));
  searchButton.setAttribute('aria-label', open ? 'Close search' : 'Open search');
  searchPanel.classList.toggle('is-open', open);
  if (open) setTimeout(() => searchInput.focus(), 180);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
    closeSearch();
  }
});

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim().toLowerCase();
  let target = '#stories';
  if (/wedding|family|couple|portfolio|gallery/.test(query)) target = '#work';
  if (/price|service|package/.test(query)) target = '#services';
  if (/about|mara|photographer/.test(query)) target = '#about';
  if (/contact|book|inquir/.test(query)) target = '#contact';
  closeSearch();
  document.querySelector(target).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
});

const reveals = document.querySelectorAll('.reveal');
if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -25px' });
  reveals.forEach((item) => observer.observe(item));
} else {
  reveals.forEach((item) => item.classList.add('is-visible'));
}

const inquiryForm = document.querySelector('[data-inquiry-form]');
inquiryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(inquiryForm);
  const firstName = data.get('firstName').trim();
  const subject = encodeURIComponent(`${data.get('session')} inquiry from ${firstName}`);
  const body = encodeURIComponent([
    `Name: ${firstName}`,
    `Email: ${data.get('email')}`,
    `Experience: ${data.get('session')}`,
    `Preferred date: ${data.get('date') || 'Not specified'}`,
    '',
    data.get('message')
  ].join('\n'));
  inquiryForm.querySelector('.form-status').textContent = `Thanks, ${firstName}. Opening your email app to finish sending…`;
  window.location.href = `mailto:hello@maranoel.ca?subject=${subject}&body=${body}`;
});

const newsletterForm = document.querySelector('[data-newsletter-form]');
newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('.newsletter-status').textContent = 'Thanks! Connect this form to your mailing platform before launch.';
  newsletterForm.reset();
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
document.querySelector('[data-back-top]').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});
