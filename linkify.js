
(function(){
  function linkifyRoot(root){
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n){
        if(!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if(n.parentNode && (n.parentNode.closest('a') || /script|style|textarea/i.test(n.parentNode.nodeName))) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n=>linkify(n));
  }
  function linkify(node){
    const text=node.nodeValue;
    const re=/(https?:\/\/[^\s<>()]+|www\.[^\s<>()]+|[A-Za-z0-9._-]+\.[A-Za-z]{2,}(?:\/[^\s<>()]+)?)/g;
    const trail=/[.,!?;:)\]\}]+$/;
    let i=0; const frag=document.createDocumentFragment();
    text.replace(re,(m,off)=>{
      const offset=text.indexOf(m,i);
      if(offset>i) frag.appendChild(document.createTextNode(text.slice(i,offset)));
      let disp=m; const t=disp.match(trail); if(t) disp=disp.slice(0,-t[0].length);
      let href=disp; if(!/^https?:\/\//i.test(href)) href="https://"+href;
      const a=document.createElement('a'); a.href=href; a.target="_blank"; a.rel="noopener"; a.textContent=disp;
      frag.appendChild(a); if(t) frag.appendChild(document.createTextNode(t[0]));
      i=offset+m.length; return m;
    });
    if(i===0){ return; }
    if(i<text.length) frag.appendChild(document.createTextNode(text.slice(i)));
    node.parentNode.replaceChild(frag,node);
  }
  function run(){ linkifyRoot(document.querySelector('main, article, body')); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",run); else run();
})();
