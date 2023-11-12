function evalCSS(){
    for(let element of document.querySelectorAll(".M3tk-HlClick")){
        element.addEventListener("mousedown",function(e){
            const Ripple = document.createElement("fake");
            Ripple.style.setProperty("--o-x",e.offsetX+"px");
            Ripple.style.setProperty("--o-y",e.offsetY+"px");
            Ripple.classList.add("M3tk-RippleFake");
            setTimeout(()=>Ripple.remove(),500);
            element.appendChild(Ripple);
        });
    }
    const CSS = ``;
    document.head.appendChild($.createElementT("style",CSS));
}

/**
 * 
 * @param { HTMLElement } from 
 * @param { HTMLElement } to 
 */
function generateContent(from,to){
    for(let item of from.querySelectorAll(":is(h1,h2,h3,h4,h5,h6)")){
        if(item.parentNode!=from) continue;
        let ID = $.parseString(item.textContent);
        let NavAnchor = document.createElement("a");
        NavAnchor.href="#M3tk-EA-"+ID;
        NavAnchor.textContent = item.textContent;
        NavAnchor.classList.add("M3tk-LC_"+item.tagName,"MA-textDeco_none");
        item.classList.add("M3tk-M");
        item.parentNode.insertBefore($.createElement("fake","M3tk-EA-"+ID,["M3tk-E-Anchor"]),item);
        to.appendChild(NavAnchor);
    }
}