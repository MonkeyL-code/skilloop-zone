'use strict';

window.ContentSafety=(()=>{
 const htmlNamespace='http://www.w3.org/1999/xhtml';
 const allowed=new Set('p div span br strong b em i u s strike del ins sub sup small mark h1 h2 h3 h4 h5 h6 blockquote pre code ul ol li hr a img video source figure figcaption table caption thead tbody tfoot tr th td'.split(' '));
 const discard=new Set('script style iframe frame frameset object embed applet form input textarea button select option optgroup label fieldset legend template noscript noembed noframes xmp plaintext base link meta title head svg math'.split(' '));
 const color=value=>/^(?:#[\da-f]{3,8}|[a-z]+|(?:rgba?|hsla?)\([\d\s.,%+/-]+\))$/i.test(value);
 const length=(value,maxPixels=240,maxEm=20)=>{
  const match=/^(\d+(?:\.\d+)?|\.\d+)(px|em|rem|%)?$/.exec(value);if(!match)return false;
  const amount=Number(match[1]),unit=match[2]||'';
  return unit==='px'?amount<=maxPixels:['em','rem'].includes(unit)?amount<=maxEm:unit==='%'?amount<=100:amount===0;
 };
 const styles={
  color,'background-color':color,
  'font-size':value=>/^(?:xx-small|x-small|small|medium|large|x-large|xx-large|smaller|larger|inherit)$/.test(value)||length(value,192,12),
  'font-family':value=>value.length<=200&&/^[\p{L}\p{N}\s'",_-]+$/u.test(value),
  'font-weight':value=>/^(?:normal|bold|bolder|lighter|[1-9]00|inherit)$/.test(value),
  'font-style':value=>/^(?:normal|italic|oblique|inherit)$/.test(value),
  'text-decoration':value=>/^(?:none|(?:underline|overline|line-through)(?:\s+(?:underline|overline|line-through))*)$/.test(value),
  'text-decoration-line':value=>/^(?:none|(?:underline|overline|line-through)(?:\s+(?:underline|overline|line-through))*)$/.test(value),
  'text-align':value=>/^(?:left|center|right|justify|start|end)$/.test(value),
  'line-height':value=>value==='normal'||(/^\d*(?:\.\d+)?$/.test(value)&&Number(value)>=0.5&&Number(value)<=5)||(/(?:px|em|rem|%)$/.test(value)&&length(value,192,5)),
  'margin-left':value=>length(value),'padding-left':value=>length(value),'text-indent':value=>length(value),
  'white-space':value=>/^(?:normal|pre|pre-wrap|pre-line|break-spaces)$/.test(value),
  'vertical-align':value=>/^(?:baseline|sub|super|middle|top|text-top|bottom|text-bottom)$/.test(value),
 };
 function url(value,{image=false,video=false}={}){
  if(typeof value!=='string'||/[\u0000-\u001f\u007f-\u009f]/.test(value))return '';
  const input=value.trim();if(!input)return '';
  if(image&&!video&&/^data:image\/(?:png|jpeg|gif|webp);base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(input)&&input.slice(input.indexOf(',')+1))return input;
  try{
   const parsed=new URL(input);
   if(parsed.username||parsed.password)return '';
   if(['http:','https:'].includes(parsed.protocol))return parsed.href;
   return !image&&!video&&parsed.protocol==='mailto:'&&parsed.pathname?parsed.href:'';
  }catch(_){return '';}
 }
 function copyStyles(source,target){
  for(const property of Object.keys(styles)){
   const value=source.style.getPropertyValue(property).trim();
   if(value&&!/[\\;@\u0000-\u001f]|\/\*|(?:url|expression|var|attr)\s*\(/i.test(value)&&styles[property](value))target.style.setProperty(property,value);
  }
 }
 function integerAttribute(source,target,name,min,max){
  const value=source.getAttribute(name);if(value!==null&&/^-?\d+$/.test(value)&&Number(value)>=min&&Number(value)<=max)target.setAttribute(name,String(Number(value)));
 }
 function copyAttributes(source,target,tag){
  if(source.hasAttribute('title'))target.setAttribute('title',source.getAttribute('title'));
  if(['ltr','rtl','auto'].includes(source.getAttribute('dir')))target.setAttribute('dir',source.getAttribute('dir'));
  copyStyles(source,target);
  if(tag==='a'){
   const href=url(source.getAttribute('href'));if(href)target.setAttribute('href',href);
   if(source.getAttribute('target')==='_blank')target.setAttribute('target','_blank');
   target.setAttribute('rel','noopener noreferrer');
  }
  if(tag==='img'){
   target.setAttribute('src',url(source.getAttribute('src'),{image:true}));
   if(source.hasAttribute('alt'))target.setAttribute('alt',source.getAttribute('alt'));
   integerAttribute(source,target,'width',1,4096);integerAttribute(source,target,'height',1,4096);
  }
  if(tag==='video'||tag==='source'){
   const src=url(source.getAttribute('src'),{video:true});if(src)target.setAttribute('src',src);
   if(tag==='video'){
    target.setAttribute('controls','');target.setAttribute('preload','metadata');
    const poster=url(source.getAttribute('poster'),{image:true});if(poster)target.setAttribute('poster',poster);
   }else if(/^video\/(?:mp4|webm|ogg)$/.test(source.getAttribute('type')||''))target.setAttribute('type',source.getAttribute('type'));
  }
  if(tag==='ol'){
   integerAttribute(source,target,'start',-100000,100000);
   if(source.hasAttribute('reversed'))target.setAttribute('reversed','');
   if(['1','a','A','i','I'].includes(source.getAttribute('type')))target.setAttribute('type',source.getAttribute('type'));
  }
  if(tag==='li')integerAttribute(source,target,'value',-100000,100000);
  if(tag==='th'||tag==='td'){
   integerAttribute(source,target,'colspan',1,100);integerAttribute(source,target,'rowspan',1,100);
   if(['row','col','rowgroup','colgroup'].includes(source.getAttribute('scope')))target.setAttribute('scope',source.getAttribute('scope'));
  }
 }
 function html(value){
  if(value===null||value===undefined)return '';
  const template=document.createElement('template');template.innerHTML=String(value);
  const inert=template.content.ownerDocument,output=inert.createElement('div');
  const queue=[...template.content.childNodes].reverse().map(node=>({node,parent:output}));
  while(queue.length){
   const {node,parent}=queue.pop();
   if(node.nodeType===3){parent.append(inert.createTextNode(node.data));continue;}
   if(node.nodeType!==1||node.namespaceURI!==htmlNamespace)continue;
   const tag=node.localName;if(discard.has(tag))continue;
   if(tag==='img'&&!url(node.getAttribute('src'),{image:true}))continue;
   if(tag==='source'&&(parent.localName!=='video'||!url(node.getAttribute('src'),{video:true})))continue;
   let destination=parent;
   if(allowed.has(tag)){destination=inert.createElement(tag);copyAttributes(node,destination,tag);parent.append(destination);}
   for(const child of [...node.childNodes].reverse())queue.push({node:child,parent:destination});
  }
  return output.innerHTML;
 }
 return Object.freeze({html,url});
})();
