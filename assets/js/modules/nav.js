const nav=document.querySelector('.c-nav');
const toggle=nav?.querySelector('.c-nav__toggle');
const menu=nav?.querySelector('.c-nav__menu');
if(nav && toggle && menu){
  toggle.addEventListener('click',()=>{
    const open=nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded',open);
  });
  document.addEventListener('click',e=>{
    if(!nav.contains(e.target)){
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded','false');
    }
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded','false');
    }
  });
}

document.querySelectorAll('.c-dropdown').forEach(dd=>{
  const btn=dd.querySelector('.c-nav__link');
  const drop=dd.querySelector('.c-dropdown__menu');
  if(btn && drop){
    btn.addEventListener('click',()=>{
      const hidden=drop.hasAttribute('hidden');
      drop.toggleAttribute('hidden',!hidden);
      btn.setAttribute('aria-expanded',hidden);
    });
    document.addEventListener('click',e=>{
      if(!dd.contains(e.target)){
        drop.setAttribute('hidden','');
        btn.setAttribute('aria-expanded','false');
      }
    });
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'){
        drop.setAttribute('hidden','');
        btn.setAttribute('aria-expanded','false');
      }
    });
  }
});
