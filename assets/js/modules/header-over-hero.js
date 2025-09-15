const header=document.querySelector('.c-header');
if(header){
  const hero=document.querySelector('.c-hero');
  const onScroll=()=>{
    if(window.scrollY>(hero?.offsetHeight||0)) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll',onScroll);
}
