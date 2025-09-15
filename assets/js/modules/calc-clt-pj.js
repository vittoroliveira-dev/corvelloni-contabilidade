const form=document.querySelector('[data-calc="clt-pj"]');
if(form){
  let faixas;
  fetch('/data/simples-faixas.json').then(r=>r.json()).then(j=>faixas=j);
  const res=form.querySelector('[data-result]');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const salario=parseFloat(form.salario.value)||0;
    const faturamento=parseFloat(form.faturamento.value)||0;
    const anexo=form.anexo.value;
    const rbt12=parseFloat(form.rbt12.value)||0;
    const f=faixas[anexo][0];
    const efetiva=(rbt12*f.aliq - f.pd)/rbt12;
    const pj=faturamento*(1-efetiva)-salario*0.11;
    const clt=salario*0.8;
    res.textContent=`CLT: R$ ${clt.toFixed(2)} | PJ: R$ ${pj.toFixed(2)}`;
  });
}
