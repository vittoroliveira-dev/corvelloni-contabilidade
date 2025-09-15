const form=document.querySelector('[data-calc="rescisao"]');
if(form){
  const res=form.querySelector('[data-result]');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const salario=parseFloat(form.salario.value)||0;
    const meses=parseFloat(form.meses.value)||0;
    const dias=parseFloat(form.dias.value)||0;
    const temFerias=form.ferias.checked;
    const fgts=parseFloat(form.fgts.value)||0;
    let saldo=(salario/30)*dias;
    let decimo=(salario/12)*meses;
    let feriasProp=(salario/12)*meses;
    if(temFerias) feriasProp+=salario;
    feriasProp*=1.3333;
    const multa=fgts*0.4;
    const total=saldo+decimo+feriasProp+multa;
    res.textContent=`Total da rescisão: R$ ${total.toFixed(2)}`;
  });
}
