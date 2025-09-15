const form=document.querySelector('[data-calc="custo-cnpj"]');
if(form){
  let data;
  fetch('/data/custos-abertura.json').then(r=>r.json()).then(j=>data=j);
  const res=form.querySelector('[data-result]');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const uf=form.uf.value;
    const natureza=form.natureza.value;
    const porte=form.porte.value;
    const item=data.find(i=>i.uf===uf && i.natureza===natureza && i.porte===porte);
    if(item){
      const total=item.taxas+item.servicos;
      res.textContent=`Custo: R$ ${total.toFixed(2)} | Prazo médio: ${item.prazo} dias`;
    }
  });
}
