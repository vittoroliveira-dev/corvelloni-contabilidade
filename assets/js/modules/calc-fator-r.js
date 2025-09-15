const form=document.querySelector('[data-calc="fator-r"]');
if(form){
  form.addEventListener('input',()=>{
    const folha=parseFloat(form.folha12.value)||0;
    const receita=parseFloat(form.receita12.value)||0;
    const res=form.querySelector('[data-result]');
    if(folha>0 && receita>0){
      const fator=folha/receita;
      const anexo=fator>=0.28?'Anexo III':'Anexo V';
      res.textContent=`Fator R: ${(fator*100).toFixed(2)}% - ${anexo}`;
    }else{res.textContent='';}
  });
}
