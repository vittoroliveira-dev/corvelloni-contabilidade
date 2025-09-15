const input=document.querySelector('[data-search]');
const results=document.querySelector('[data-results]');
if(input&&results){
  let data=[];
  fetch('/duvidas/index.json').then(r=>r.json()).then(j=>data=j);
  input.addEventListener('input',()=>{
    const q=input.value.toLowerCase();
    results.innerHTML='';
    data.filter(i=>i.title.toLowerCase().includes(q) || i.tags.some(t=>t.toLowerCase().includes(q))).forEach(i=>{
      const li=document.createElement('li');
      li.innerHTML=`<a href="${i.url}">${i.title}</a>`;
      results.append(li);
    });
  });
}
