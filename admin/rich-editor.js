'use strict';
(() => {
 const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const button=(action,label,icon=action)=>`<button type="button" data-rich="${action}" title="${label}" aria-label="${label}"><span data-icon="${icon}"></span></button>`;
 const group=(label,contents)=>`<div class="rich-tool-group" role="group" aria-label="${label}">${contents}</div>`;
 const select=(key,label,options)=>`<select data-rich-select="${key}" title="${label}" aria-label="${label}">${options.map(([value,text])=>`<option value="${escape(value)}" ${key==='fontSize'&&value==='13px'?'selected':''}>${escape(text)}</option>`).join('')}</select>`;
 function toolbar(){
  return `<div class="rich-toolbar" role="toolbar" aria-label="正文编辑工具">
   <div class="rich-toolbar-row">${group('编辑历史',button('undo','撤销（Ctrl/⌘ Z）')+button('redo','重做（Ctrl/⌘ Shift Z）'))}
   ${group('文字样式',button('bold','加粗（Ctrl/⌘ B）')+button('italic','斜体（Ctrl/⌘ I）')+button('underline','下划线（Ctrl/⌘ U）')+button('strike','删除线'))}
   ${group('文字颜色',`<label class="rich-color" title="字体颜色"><span data-icon="textColor"></span><input type="color" value="#52627a" data-rich-color="color" aria-label="字体颜色"></label><label class="rich-color" title="文字背景色"><span data-icon="highlight"></span><input type="color" value="#fff0a8" data-rich-color="backgroundColor" aria-label="文字背景色"></label>`)}
   ${group('标题与字体',select('block','文字分级',[['p','正文'],['h1','标题 1'],['h2','标题 2'],['h3','标题 3'],['h4','标题 4'],['h5','标题 5'],['h6','标题 6']])+select('fontFamily','字体',[['inherit','默认字体'],['Arial, sans-serif','Arial'],['Georgia, serif','Georgia'],['"Times New Roman", serif','Times New Roman'],['"Microsoft YaHei", sans-serif','微软雅黑'],['SimSun, serif','宋体'],['monospace','等宽字体']])+select('fontSize','字号（像素）',[12,13,14,16,18,20,24,28,32,36,48].map(n=>[n+'px',n+' px']))) }
   ${group('段落行高',select('lineHeight','行高',[['1.9','默认行高'],['1','1 倍'],['1.25','1.25 倍'],['1.5','1.5 倍'],['1.75','1.75 倍'],['2','2 倍'],['2.5','2.5 倍'],['3','3 倍']]))}</div>
   <div class="rich-toolbar-row">${group('段落对齐',button('alignLeft','左对齐')+button('alignCenter','居中对齐')+button('alignRight','右对齐')+button('alignJustify','两端对齐'))}
   ${group('段落缩进',button('outdent','减少缩进')+button('indent','增加缩进'))}
   ${group('列表',button('orderedList','有序列表')+button('unorderedList','无序列表','list'))}
   ${group('插入内容',button('image','插入图片')+button('video','插入视频')+button('divider','插入分隔线')+button('link','插入或编辑超链接')+button('unlink','取消超链接')+button('code','插入代码块'))}
   ${group('格式工具',button('clear','清除格式')+button('painter','格式刷：复制格式后选中目标文字'))}
   <div class="rich-tool-group rich-view-tools">${button('fullscreen','全屏编辑')}</div></div>
   <div class="rich-tool-status" role="status" hidden></div>
  </div>`;
 }
 function mount({root,body,dialog,notify,onChange}){
  const doc=body.ownerDocument,win=doc.defaultView,bar=root.querySelector('.rich-toolbar'),box=body.closest('.rich-box');
  const abort=new win.AbortController(),signal=abort.signal;
  const on=(node,event,fn,options={})=>node.addEventListener(event,fn,{...options,signal});
  let savedRange=null,painter=null,composing=false,lastTyping=0,history=[],historyIndex=-1,busy=false;
  const inlineKeys=['fontWeight','fontStyle','textDecoration','fontFamily','fontSize','color','backgroundColor'];
  const blockSelector='p,h1,h2,h3,h4,h5,h6,li,blockquote,pre,div';
  const belongs=node=>node&&(node===body||body.contains(node));
  const element=node=>node?.nodeType===1?node:node?.parentElement;
  const rangeValid=r=>r&&belongs(r.startContainer)&&belongs(r.endContainer);
  function remember(){const selection=win.getSelection();if(selection.rangeCount&&rangeValid(selection.getRangeAt(0)))savedRange=selection.getRangeAt(0).cloneRange();}
  function setRange(range){const selection=win.getSelection();selection.removeAllRanges();selection.addRange(range);savedRange=range.cloneRange();}
  function restore(){
   body.focus({preventScroll:true});
   if(rangeValid(savedRange))setRange(savedRange.cloneRange());
   else{const range=doc.createRange();range.selectNodeContents(body);range.collapse(false);setRange(range);}
   return win.getSelection().getRangeAt(0);
  }
  function path(node){const parts=[];while(node&&node!==body){parts.unshift(Array.prototype.indexOf.call(node.parentNode.childNodes,node));node=node.parentNode;}return parts;}
  function bookmark(){remember();return rangeValid(savedRange)?{start:path(savedRange.startContainer),end:path(savedRange.endContainer),startOffset:savedRange.startOffset,endOffset:savedRange.endOffset}:null;}
  function recover(mark){
   if(!mark){savedRange=null;return;}
   try{const start=mark.start.reduce((node,i)=>node.childNodes[i],body),end=mark.end.reduce((node,i)=>node.childNodes[i],body),r=doc.createRange();r.setStart(start,mark.startOffset);r.setEnd(end,mark.endOffset);setRange(r);}catch(_){savedRange=null;}
  }
  function pushHistory(typing=false){
   const html=body.innerHTML,mark=bookmark(),time=Date.now();
   if(history[historyIndex]?.html===html){history[historyIndex].mark=mark;return;}
   history=history.slice(0,historyIndex+1);
   if(typing&&lastTyping&&time-lastTyping<650&&historyIndex>0)history[historyIndex]={html,mark};
   else{history.push({html,mark});if(history.length>60)history.shift();historyIndex=history.length-1;}
   lastTyping=typing?time:0;sync();
  }
  function historyMove(delta){
   const next=historyIndex+delta;if(next<0||next>=history.length)return;
   historyIndex=next;body.innerHTML=history[next].html;recover(history[next].mark);body.focus({preventScroll:true});lastTyping=0;onChange();sync();
  }
  function change(fn){
   restore();if(history[historyIndex])history[historyIndex].mark=bookmark();
   const before=body.innerHTML;busy=true;
   try{fn();}finally{busy=false;}
   remember();if(body.innerHTML!==before){pushHistory();onChange();}sync();
  }
  function selectedText(range){
   const walker=doc.createTreeWalker(body,win.NodeFilter.SHOW_TEXT),result=[];let node;
   while((node=walker.nextNode())){
    if(!range.intersectsNode(node)||!node.length)continue;
    const start=node===range.startContainer?range.startOffset:0,end=node===range.endContainer?range.endOffset:node.length;
    if(end>start)result.push({node,start,end});
   }
   return result;
  }
  function wrapText(makeNode){
   const range=restore(),pieces=selectedText(range),wrappers=[];
   if(range.collapsed){const wrapper=makeNode();wrapper.textContent='\u200b';range.insertNode(wrapper);const caret=doc.createRange();caret.setStart(wrapper.firstChild,1);caret.collapse(true);setRange(caret);return;}
   for(const {node,start,end} of pieces.reverse()){
    const part=doc.createRange();part.setStart(node,start);part.setEnd(node,end);const wrapper=makeNode();part.surroundContents(wrapper);wrappers.unshift(wrapper);
   }
   if(wrappers.length){const result=doc.createRange();result.setStartBefore(wrappers[0]);result.setEndAfter(wrappers.at(-1));setRange(result);}
  }
  function inlineStyle(node){
   const style=win.getComputedStyle(element(node)),result={};for(const key of inlineKeys)if(style[key])result[key]=style[key];
   const decorations=new Set();let current=element(node);
   while(current&&current!==body){for(const token of (win.getComputedStyle(current).textDecoration||'').split(/\s+/))if(['underline','line-through'].includes(token))decorations.add(token);current=current.parentElement;}
   result.textDecoration=[...decorations].join(' ')||'none';return result;
  }
  function inline(styles){
   const range=restore(),collapsed=range.collapsed;
   if(collapsed){const text=doc.createTextNode('\u200b');range.insertNode(text);range.selectNodeContents(text);}
   const pieces=selectedText(range),wrappers=[];
   for(const {node,start,end} of pieces.reverse()){
    const original=inlineStyle(node),link=node.parentElement.closest('a');
    const linkCopy=link?.cloneNode(false);linkCopy?.removeAttribute('id');
    if(end<node.length)node.splitText(end);const selected=start?node.splitText(start):node;
    while(selected.parentElement!==body&&/^(SPAN|B|STRONG|I|EM|U|S|STRIKE|FONT|MARK|CODE|A|SMALL)$/.test(selected.parentElement.tagName)){
     const parent=selected.parentElement,before=parent.cloneNode(false),after=parent.cloneNode(false);before.removeAttribute('id');after.removeAttribute('id');
     while(parent.firstChild!==selected)before.append(parent.firstChild);
     while(selected.nextSibling)after.append(selected.nextSibling);
     if(before.childNodes.length)parent.before(before);if(after.childNodes.length)parent.after(after);parent.replaceWith(selected);
    }
    const wrapper=doc.createElement('span');Object.assign(wrapper.style,original,styles);selected.replaceWith(wrapper);wrapper.append(selected);
    if(linkCopy){wrapper.replaceWith(linkCopy);linkCopy.append(wrapper);}wrappers.unshift(wrapper);
   }
   if(wrappers.length){const result=doc.createRange();result.setStart(wrappers[0].firstChild,collapsed?1:0);result.setEnd(wrappers.at(-1).firstChild,wrappers.at(-1).firstChild.length);if(collapsed)result.collapse(false);setRange(result);}
  }
  function selectedBlocks(){
   const range=restore();
   if(range.collapsed){const node=element(range.startContainer)?.closest(blockSelector);if(node&&node!==body&&body.contains(node))return [node];}
   const candidates=[...body.querySelectorAll(blockSelector)].filter(node=>range.intersectsNode(node));
   const leaf=candidates.filter(node=>!candidates.some(other=>node!==other&&node.contains(other)));
   if(leaf.length)return leaf;
   let top=range.startContainer;while(top!==body&&top.parentNode!==body)top=top.parentNode;
   const isBlock=node=>node.nodeType===1&&/^(P|DIV|H[1-6]|UL|OL|LI|BLOCKQUOTE|PRE|FIGURE|HR|TABLE)$/.test(node.tagName);
   if(top!==body&&!isBlock(top)){
    let first=top;while(first.previousSibling&&!isBlock(first.previousSibling))first=first.previousSibling;
    const nodes=[];for(let node=first;node&&!isBlock(node);node=node.nextSibling)nodes.push(node);
    const start=range.startContainer,startOffset=range.startOffset,end=range.endContainer,endOffset=range.endOffset;
    const p=doc.createElement('p');first.before(p);p.append(...nodes);
    const preserved=doc.createRange();preserved.setStart(start,startOffset);preserved.setEnd(end,endOffset);setRange(preserved);return [p];
   }
   const p=doc.createElement('p');const fragment=range.collapsed?null:range.extractContents();
   if(fragment)p.append(fragment);else p.append(doc.createElement('br'));range.insertNode(p);const r=doc.createRange();r.selectNodeContents(p);setRange(r);return [p];
  }
  function paragraph(styles){for(const node of selectedBlocks())Object.assign(node.style,styles);}
  function styleNode(){const range=savedRange;return !range.collapsed?(selectedText(range)[0]?.node||range.startContainer):range.startContainer;}
  function currentStyle(){restore();return win.getComputedStyle(element(styleNode())||body);}
  function inlineToggle(key,onValue,offValue,active){const current=currentStyle();const enabled=active(current);inline({[key]:enabled?offValue:onValue});}
  function decorationToggle(token){restore();const tokens=new Set(inlineStyle(styleNode()).textDecoration.split(' ').filter(value=>value!=='none'));if(tokens.has(token))tokens.delete(token);else tokens.add(token);inline({textDecoration:[...tokens].join(' ')||'none'});}
  function native(command){
   if(typeof doc.execCommand!=='function'){notify('当前浏览器暂不支持此编辑操作');return;}
   if(doc.execCommand(command,false,null)===false)notify('请先将光标放在需要编辑的段落中');
  }
  function insertBlock(node){
   const range=restore();range.deleteContents();let parent=element(range.startContainer);
   while(parent&&parent.parentElement!==body&&parent!==body)parent=parent.parentElement;
   const tail=doc.createElement('p');tail.append(doc.createElement('br'));
   if(parent&&parent!==body){
    if(/^(P|H[1-6]|DIV)$/.test(parent.tagName)&&parent.contains(range.startContainer)){
     const remainder=doc.createRange();remainder.selectNodeContents(parent);remainder.setStart(range.startContainer,range.startOffset);
     const contents=remainder.extractContents();if(contents.textContent||contents.querySelector?.('img,video')){tail.replaceChildren(contents);}
    }
    parent.after(node,tail);
   }else{range.insertNode(tail);range.insertNode(node);}
   const caret=doc.createRange();caret.setStart(tail,0);caret.collapse(true);setRange(caret);
  }
  function setFullScreen(full){
   box.classList.toggle('is-fullscreen',full);const control=bar.querySelector('[data-rich=fullscreen]');
   control.setAttribute('aria-pressed',String(full));control.setAttribute('aria-label',full?'退出全屏（Esc）':'全屏编辑');control.title=control.getAttribute('aria-label');
   control.innerHTML=`<span data-icon="${full?'minimize':'fullscreen'}"></span>`;
   body.focus({preventScroll:true});
  }
  function painterState(value){
   painter=value;bar.querySelector('[data-rich=painter]').setAttribute('aria-pressed',String(!!value));box.classList.toggle('format-painting',!!value);
   const status=bar.querySelector('.rich-tool-status');status.hidden=!value;status.textContent=value?'已复制格式，选中目标文字即可应用一次；按 Esc 取消。':'';
  }
  function copyFormat(){
   if(painter){painterState(null);return;}
   restore();const node=element(styleNode()),block=node.closest(blockSelector),styles=inlineStyle(node);
   painterState({inline:styles,block:{lineHeight:block?.style.lineHeight||'',textAlign:block?.style.textAlign||'',marginLeft:block?.style.marginLeft||''}});
  }
  function paint(){remember();if(painter&&rangeValid(savedRange)&&!savedRange.collapsed){const styles=painter;painterState(null);change(()=>{inline(styles.inline);paragraph(styles.block);});}}
  function safeURL(value,kind){
   const url=new URL(value.trim());if(!(kind==='link'?['http:','https:','mailto:']:['http:','https:']).includes(url.protocol))throw Error('请填写有效的 '+(kind==='link'?'https://、http:// 或 mailto:':'https:// 或 http://')+' 地址');return url.href;
  }
  function insertion(kind){
   remember();const selectionText=rangeValid(savedRange)?savedRange.toString():'';
   const existing=kind==='link'?element(savedRange?.startContainer)?.closest('a'):null;
   const titles={image:'插入图片',video:'插入视频',link:'插入或编辑超链接',code:'插入代码块'};
   const common=kind==='code'?`<label for="rich-insert-code">代码内容</label><textarea id="rich-insert-code" rows="9" spellcheck="false">${escape(selectionText)}</textarea>`:
    `<label for="rich-insert-url">${kind==='image'?'图片地址':kind==='video'?'视频文件地址':'链接地址'}</label><input id="rich-insert-url" type="url" placeholder="https://…" value="${escape(existing?.getAttribute('href')||'')}">`;
   const extra=kind==='image'?'<label for="rich-insert-file">或选择本地图片</label><input id="rich-insert-file" type="file" accept="image/png,image/jpeg,image/webp,image/gif"><label for="rich-insert-alt">图片说明</label><input id="rich-insert-alt" placeholder="简要描述图片内容">':kind==='link'?`<label for="rich-insert-text">显示文字</label><input id="rich-insert-text" value="${escape(existing?.textContent||selectionText)}" ${selectionText&&!existing?'readonly':''}>`:kind==='video'?'<p class="rich-insert-hint">填写可直接播放的 MP4、WebM 等视频文件地址。</p>':'';
   const m=dialog({title:titles[kind],body:`<div class="rich-insert-form">${common}${extra}<p id="rich-insert-error" class="validation" role="alert" hidden></p></div>`,actions:'<button class="button" data-rich-insert-cancel>取消</button><button class="button primary" data-rich-insert-submit>插入</button>'});
   const get=selector=>m.el.querySelector(selector),submit=get('[data-rich-insert-submit]');
   get('[data-rich-insert-cancel]').onclick=()=>{m.close();restore();};
   submit.onclick=async()=>{
    const error=get('#rich-insert-error');error.hidden=true;submit.disabled=true;
    try{
     let url='',code='';
     if(kind==='code'){code=get('#rich-insert-code').value;if(!code.trim())throw Error('请输入代码内容');}
     else if(kind==='image'&&get('#rich-insert-file').files[0]){
      const file=get('#rich-insert-file').files[0];
      if(!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type))throw Error('请选择 PNG、JPEG、WebP 或 GIF 图片');
      if(file.size>5*1024*1024)throw Error('图片请控制在 5 MB 以内');
      url=await new Promise((resolve,reject)=>{const reader=new win.FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('图片读取失败，请重试'));reader.readAsDataURL(file);});
     }else{try{url=safeURL(get('#rich-insert-url').value,kind);}catch(_){throw Error(kind==='link'?'链接仅支持 http://、https:// 或 mailto: 地址':'请填写有效的 http:// 或 https:// 媒体地址');}}
     if(!m.el.isConnected||!root.isConnected)return;
     const label=get('#rich-insert-text')?.value.trim(),alt=get('#rich-insert-alt')?.value.trim()||'';
     m.close();
     change(()=>{
      if(kind==='image'){const figure=doc.createElement('figure'),img=doc.createElement('img');img.src=url;img.alt=alt;figure.append(img);if(alt){const caption=doc.createElement('figcaption');caption.textContent=alt;figure.append(caption);}insertBlock(figure);}
      else if(kind==='video'){const figure=doc.createElement('figure'),video=doc.createElement('video');video.src=url;video.controls=true;video.preload='metadata';figure.append(video);insertBlock(figure);}
      else if(kind==='code'){const pre=doc.createElement('pre'),content=doc.createElement('code');content.textContent=code;pre.append(content);insertBlock(pre);}
      else{
       if(existing&&body.contains(existing)){existing.href=url;if(label)existing.textContent=label;}
       else if(!restore().collapsed){
        unlink();wrapText(()=>{const a=doc.createElement('a');a.href=url;return a;});
       }else{const a=doc.createElement('a');a.href=url;a.textContent=label||url;const r=restore();r.insertNode(a);r.setStartAfter(a);r.collapse(true);setRange(r);}
      }
     });
    }catch(reason){error.textContent=reason.message;error.hidden=false;}
    finally{submit.disabled=false;}
   };
  }
  function unlink(){
   const r=restore(),pieces=selectedText(r),links=[...body.querySelectorAll('a')].filter(a=>r.intersectsNode(a));
   const first=pieces[0],last=pieces.at(-1);
   for(const a of links)a.replaceWith(...a.childNodes);
   if(first&&last){const result=doc.createRange();result.setStart(first.node,first.start);result.setEnd(last.node,last.end);setRange(result);}else remember();
  }
  const actions={
   bold:()=>inlineToggle('fontWeight','700','400',s=>s.fontWeight==='bold'||Number(s.fontWeight)>=600),
   italic:()=>inlineToggle('fontStyle','italic','normal',s=>s.fontStyle==='italic'),
   underline:()=>decorationToggle('underline'),
   strike:()=>decorationToggle('line-through'),
   alignLeft:()=>paragraph({textAlign:'left'}),alignCenter:()=>paragraph({textAlign:'center'}),alignRight:()=>paragraph({textAlign:'right'}),alignJustify:()=>paragraph({textAlign:'justify'}),
   indent:()=>{for(const node of selectedBlocks())node.style.marginLeft=Math.min(240,(parseFloat(node.style.marginLeft)||0)+24)+'px';},
   outdent:()=>{for(const node of selectedBlocks()){const indent=Math.max(0,(parseFloat(node.style.marginLeft)||0)-24);node.style.marginLeft=indent?indent+'px':'';}},
   orderedList:()=>native('insertOrderedList'),unorderedList:()=>native('insertUnorderedList'),
   divider:()=>insertBlock(doc.createElement('hr')),unlink,
   clear:()=>{
    const defaultStyle=win.getComputedStyle(body);inline({fontWeight:'400',fontStyle:'normal',textDecoration:'none',fontFamily:defaultStyle.fontFamily||'inherit',fontSize:defaultStyle.fontSize||'13px',color:defaultStyle.color||'#52627a',backgroundColor:'transparent'});
    for(const node of selectedBlocks()){node.style.removeProperty('text-align');node.style.removeProperty('margin-left');node.style.removeProperty('line-height');}
   }
  };
  function sync(){
   bar.querySelector('[data-rich=undo]').disabled=historyIndex<=0;bar.querySelector('[data-rich=redo]').disabled=historyIndex>=history.length-1;
   if(!rangeValid(savedRange))return;
   let node=element(styleNode());if(node===body)node=element(body.childNodes[savedRange.startOffset])||body;
   const style=win.getComputedStyle(node),states={bold:style.fontWeight==='bold'||Number(style.fontWeight)>=600,italic:style.fontStyle==='italic',underline:(style.textDecoration||'').includes('underline'),strike:(style.textDecoration||'').includes('line-through')};
   for(const [action,active] of Object.entries(states))bar.querySelector(`[data-rich=${action}]`).setAttribute('aria-pressed',String(active));
   for(const [action,tag] of Object.entries({orderedList:'OL',unorderedList:'UL'}))bar.querySelector(`[data-rich=${action}]`).setAttribute('aria-pressed',String(node.closest('ol,ul')?.tagName===tag));
   const block=node.closest(blockSelector),alignment=win.getComputedStyle(block||body).textAlign||'left';
   for(const [action,align] of Object.entries({alignLeft:'left',alignCenter:'center',alignRight:'right',alignJustify:'justify'}))bar.querySelector(`[data-rich=${action}]`).setAttribute('aria-pressed',String(alignment===align||(align==='left'&&alignment==='start')));
   const values={block:/^H[1-6]$/.test(block?.tagName)?block.tagName.toLowerCase():'p',fontFamily:node.style.fontFamily||'inherit',fontSize:style.fontSize||'13px',lineHeight:block?.style.lineHeight||'1.9'};
   for(const [key,value] of Object.entries(values)){const control=bar.querySelector(`[data-rich-select=${key}]`);if([...control.options].some(option=>option.value===value))control.value=value;}
  }
  on(doc,'selectionchange',()=>{remember();sync();});
  on(bar,'mousedown',event=>{remember();if(event.target.closest('button'))event.preventDefault();});
  on(bar,'click',event=>{
   const control=event.target.closest('[data-rich]');if(!control||control.disabled)return;
   const action=control.dataset.rich;
   if(action==='undo')historyMove(-1);else if(action==='redo')historyMove(1);
   else if(action==='fullscreen')setFullScreen(!box.classList.contains('is-fullscreen'));
   else if(action==='painter')copyFormat();
   else if(['image','video','link','code'].includes(action))insertion(action);
   else if(actions[action])change(actions[action]);
  });
  on(bar,'change',event=>{
   const key=event.target.dataset.richSelect,color=event.target.dataset.richColor,value=event.target.value;
   if(color){event.target.closest('.rich-color').style.setProperty('--swatch',value);change(()=>inline({[color]:value}));}
   else if(key==='lineHeight')change(()=>paragraph({lineHeight:value}));
   else if(key==='block')change(()=>{
    const blocks=selectedBlocks(),updated=[];
    for(const block of blocks){if(block.tagName==='LI'){let p=doc.createElement(value);p.append(...block.childNodes);block.append(p);updated.push(p);}else{const p=doc.createElement(value);p.style.cssText=block.style.cssText;p.append(...block.childNodes);block.replaceWith(p);updated.push(p);}}
    if(updated.length){const r=doc.createRange();r.setStart(updated[0],0);r.setEnd(updated.at(-1),updated.at(-1).childNodes.length);setRange(r);}
   });
   else if(key)change(()=>inline({[key]:value}));
  });
  on(body,'beforeinput',event=>{
   if(event.inputType==='historyUndo'||event.inputType==='historyRedo'){event.preventDefault();historyMove(event.inputType==='historyUndo'?-1:1);return;}
   if(history[historyIndex])history[historyIndex].mark=bookmark();
  });
  on(body,'input',event=>{remember();if(!busy&&!composing){pushHistory(event.inputType==='insertText'||event.inputType==='deleteContentBackward');sync();}});
  on(body,'compositionstart',()=>{composing=true;});on(body,'compositionend',()=>{composing=false;pushHistory();});
  on(body,'mouseup',paint);on(body,'keyup',event=>{if(event.shiftKey)paint();});
  on(root,'keydown',event=>{
   if(event.key==='Escape'&&painter){event.preventDefault();event.stopPropagation();painterState(null);return;}
   if(event.key==='Escape'&&box.classList.contains('is-fullscreen')){event.preventDefault();event.stopPropagation();setFullScreen(false);return;}
   if(!belongs(event.target)||!(event.ctrlKey||event.metaKey))return;
   const key=event.key.toLowerCase();
   if(key==='z'||key==='y'){event.preventDefault();event.stopPropagation();historyMove(key==='y'||event.shiftKey?1:-1);}
   else if(['b','i','u'].includes(key)){event.preventDefault();change(actions[{b:'bold',i:'italic',u:'underline'}[key]]);}
   else if(key==='k'){event.preventDefault();insertion('link');}
  });
  on(body,'paste',event=>{
   event.preventDefault();event.stopPropagation();const text=event.clipboardData?.getData('text/plain')||'';if(!text)return;
   change(()=>{const range=restore();range.deleteContents();const fragment=doc.createDocumentFragment();text.split(/\r?\n/).forEach((line,i)=>{if(i)fragment.append(doc.createElement('br'));fragment.append(doc.createTextNode(line));});const last=fragment.lastChild;range.insertNode(fragment);range.setStartAfter(last);range.collapse(true);setRange(range);});
  });
  on(body,'drop',event=>{event.preventDefault();notify('请通过“插入图片”添加图片，或粘贴文字内容');});
  pushHistory();sync();
  return {destroy(){abort.abort();painterState(null);box.classList.remove('is-fullscreen');}};
 }
 window.RichEditor={toolbar,mount};
})();
