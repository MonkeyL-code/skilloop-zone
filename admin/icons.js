'use strict';
(() => {
  const paths={
    newspaper:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h3M8 15h8M8 18h8"/><path d="M15 10h2v2h-2z"/>',
    pen:'<path d="m14 5 5 5M4 20l4-1 12-12a2.1 2.1 0 0 0-3-3L5 16l-1 4ZM13 20h7"/>',
    library:'<rect x="3" y="4" width="4" height="16" rx="1"/><rect x="7" y="4" width="4" height="16" rx="1"/><path d="m14 5 4-1 4 15-4 1zM3 8h4M7 8h4"/>',
    settings:'<path d="m10 3-.6 2.2-2 .9-2-.6-2 3.5L5 10.5v3L3.4 15l2 3.5 2-.6 2 .9L10 21h4l.6-2.2 2-.9 2 .6 2-3.5-1.6-1.5v-3L20.6 9l-2-3.5-2 .6-2-.9L14 3Z"/><circle cx="12" cy="12" r="3"/>',
    rules:'<path d="M9 4H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="m8 11 1 1 2-2m-3 7 1 1 2-2m3-5h2m-2 6h2"/>',
    chevron:'<path d="m6 9 6 6 6-6"/>',
    left:'<path d="m14 6-6 6 6 6"/>',
    right:'<path d="m10 6 6 6-6 6"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    external:'<path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>',
    heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    bookmark:'<path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4Z"/>',
    share:'<path d="m14 4 6 6-6 6v-4c-6 0-9 2-10 6 0-8 4-10 10-10Z"/>',
    comment:'<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 1v-9.5a9 9 0 0 1 18 0Z"/><path d="M8 10h8M8 14h5"/>',
    star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>',
    play:'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    undo:'<path d="m9 4-5 5 5 5M4 9h10a6 6 0 0 1 0 12"/>',
    redo:'<path d="m15 4 5 5-5 5m5-5H10a6 6 0 0 0 0 12"/>',
    list:'<path d="M9 6h12M9 12h12M9 18h12M3 6h.01M3 12h.01M3 18h.01"/>',
    quote:'<path d="M4 5h6v7H5c0 3 1 4 3 5M14 5h6v7h-5c0 3 1 4 3 5"/>',
    bold:'<path d="M6 3h7a5 5 0 0 1 0 10H6Zm0 10h8a4 4 0 0 1 0 8H6Z"/>',
    italic:'<path d="M10 3h10M4 21h10M16 3 8 21"/>',
    underline:'<path d="M6 3v8a6 6 0 0 0 12 0V3M4 21h16"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    alert:'<path d="m12 3 10 18H2Z"/><path d="M12 9v5M12 17h.01"/>',
    globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    logout:'<path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4m7-13 5 5-5 5m-9-5h14"/>',
    refresh:'<path d="M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5m-4 8a8 8 0 0 0 14 3l3-3m0 5v-5h-5"/>',
    strike:'<path d="M17 5c-1-2-8-3-10 1-1 2 1 4 5 5m-6 6c1 5 12 5 12-1 0-2-2-3-5-4M3 12h18"/>',
    textColor:'<path d="m6 17 6-14 6 14M8 13h8M4 21h16"/>',
    highlight:'<path d="m14 3 7 7-9 9-7-7zM5 12l-2 7 7-2M2 22h20"/>',
    alignLeft:'<path d="M4 5h16M4 10h10M4 15h16M4 20h10"/>',
    alignCenter:'<path d="M4 5h16M7 10h10M4 15h16M7 20h10"/>',
    alignRight:'<path d="M4 5h16M10 10h10M4 15h16M10 20h10"/>',
    alignJustify:'<path d="M4 5h16M4 10h16M4 15h16M4 20h16"/>',
    indent:'<path d="M3 4h18M12 9h9M12 15h9M3 20h18m0-12 4 4-4 4"/>',
    outdent:'<path d="M3 4h18M12 9h9M12 15h9M3 20h18M7 8l-4 4 4 4"/>',
    orderedList:'<path d="M10 5h11M10 12h11M10 19h11M3 3h1v5M2 8h4M2 14c0-3 4-3 4-1 0 1-4 3-4 5h4"/>',
    image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    video:'<rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
    divider:'<path d="M3 12h18M4 5h2m5 0h2m5 0h2M4 19h2m5 0h2m5 0h2"/>',
    link:'<path d="m10 13 4-4m-6 7-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 1 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(1 0)"/>',
    unlink:'<path d="m9 6 2-2a4 4 0 0 1 6 6l-1 1m-1 6-2 2a4 4 0 0 1-6-6l1-1M3 3l18 18M4 13H2m11-9V2m7 9h2m-11 9v2"/>',
    code:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m8 9-3 3 3 3m8-6 3 3-3 3m-3-7-2 8"/>',
    clear:'<path d="m14 3 7 7-10 10H7l-5-5L14 3ZM8 9l7 7m1 4h6"/>',
    painter:'<rect x="3" y="3" width="14" height="6" rx="1"/><path d="M17 6h3v7H10v3m-2 0h4v6H8z"/>',
    fullscreen:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
    minimize:'<path d="M3 8h5V3m8 0v5h5M8 21v-5H3m13 5v-5h5"/>',
  };
  function hydrate(root){
    const items=[];
    if(root.nodeType!==1&&root.nodeType!==9)return;
    if(root.matches?.('[data-icon]:not([data-icon-ready])'))items.push(root);
    items.push(...root.querySelectorAll('[data-icon]:not([data-icon-ready])'));
    for(const item of items){
      const content=paths[item.dataset.icon];if(!content)continue;
      item.dataset.iconReady='true';item.setAttribute('aria-hidden','true');item.classList.add('ui-icon');
      item.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true">${content}</svg>`;
      const button=item.closest('button');if(button?.title&&!button.hasAttribute('aria-label'))button.setAttribute('aria-label',button.title);
    }
  }
  hydrate(document);
  new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)hydrate(node);}).observe(document.body,{childList:true,subtree:true});
})();
