// enhance.js
const root = document.documentElement;
root.classList.remove('no-js'); root.classList.add('js');

const els = document.querySelectorAll('[data-animate]');
if (!els.length) return;

const reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
if (reduce || !('IntersectionObserver' in window)) {
  els.forEach(el => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    }
  }, { rootMargin: '0px 0px -10% 0px' });
  els.forEach(el => io.observe(el));
}
