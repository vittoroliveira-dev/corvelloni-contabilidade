const form=document.querySelector('[data-calc="salario"]');
if(form){
  let trib;
  fetch('/data/br-tributos.json').then(r=>r.json()).then(j=>trib=j);
  const res=form.querySelector('[data-result]');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const bruto=parseFloat(form.bruto.value)||0;
    const dep=parseFloat(form.dependentes.value)||0;
    const pensao=parseFloat(form.pensao.value)||0;
    const vt=parseFloat(form.vt.value)||0;
    const vr=parseFloat(form.vr.value)||0;
    const conv=parseFloat(form.convenio.value)||0;
    let inss=0,last=0;
    trib.inss.forEach(b=>{const base=Math.min(bruto,b.ceiling)-last;if(base>0){inss+=base*b.rate;last=b.ceiling;}});
    const irBase=bruto-inss-dep*trib.irrf.dependente-pensao;
    let ir=0;trib.irrf.tabela.forEach(b=>{if(irBase>b.min)ir=irBase*b.rate-b.deduction;});
    const liquido=bruto-inss-ir-vt-vr-conv;
    res.textContent=`Salário líquido: R$ ${liquido.toFixed(2)}`;
  });
}
