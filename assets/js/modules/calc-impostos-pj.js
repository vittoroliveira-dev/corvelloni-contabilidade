const form=document.querySelector('[data-calc="impostos-pj"]');
if(form){
  let faixas;
  fetch('/data/simples-faixas.json').then(r=>r.json()).then(j=>faixas=j);
  const res=form.querySelector('[data-result]');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const anexo=form.anexo.value;
    const rbt12=parseFloat(form.rbt12.value)||0;
    const faturamento=parseFloat(form.faturamento.value)||0;
    const f=faixas[anexo][0];
    const efetiva=(rbt12*f.aliq - f.pd)/rbt12;
    const das=faturamento*efetiva;
    res.textContent=`Alíquota efetiva: ${(efetiva*100).toFixed(2)}% | DAS mensal: R$ ${das.toFixed(2)}`;
  });
}
