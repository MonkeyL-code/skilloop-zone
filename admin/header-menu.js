'use strict';
(() => {
  const toggle=document.querySelector('#header-menu-toggle');
  const panel=document.querySelector('#header-menu-panel');
  const wrapper=toggle.closest('.header-menu');
  function setOpen(open,restoreFocus=false){
    panel.hidden=!open;
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'关闭账号与设置菜单':'打开账号与设置菜单');
    if(restoreFocus)toggle.focus();
  }
  toggle.addEventListener('click',()=>setOpen(panel.hidden));
  panel.addEventListener('click',event=>{
    const button=event.target.closest('button');
    if(!button||button.disabled)return;
    setOpen(false,true);
    if(button.dataset.act==='header-settings'){
      const dialog=modal({title:'设置',body:'<div class="settings-shortcuts"><button class="button" data-setting="seo">SEO</button><button class="button" data-setting="cookie">Cookie</button><button class="button" data-setting="privacy">隐私与安全</button></div>'});
      dialog.el.querySelectorAll('[data-setting]').forEach(item=>item.onclick=()=>{dialog.close();navigate(item.dataset.setting);});
    }
  });
  document.addEventListener('click',event=>{if(!wrapper.contains(event.target))setOpen(false);});
  wrapper.addEventListener('focusout',event=>{if(!wrapper.contains(event.relatedTarget))setOpen(false);});
  wrapper.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!panel.hidden){event.preventDefault();event.stopPropagation();setOpen(false,true);}
    if(event.key==='ArrowDown'&&event.target===toggle){event.preventDefault();setOpen(true);panel.querySelector('button:not(:disabled)').focus();}
  });
})();
