class CollapseComponent{
    size;
    json;
    /**
     * 
     * @param { Array.<{header:string,content:string,open:boolean}> } conf 
     * @param { 0|1|2 } size 
     * @param { string } type
     */
    constructor(conf,size,type){
        this.size = size!=undefined?size:1;
        this.type = type;
        this.json = conf;
    }
    setConf(conf){
        this.json = conf;
    }
    setSize(size){
        this.size = size;
    }
    setType(type){
        this.type = type;
    }
    renderHTMLElement(){
        let Collapse = newElement("Collapse");
        Collapse.setAttribute("type",this.type);
        for(let item of this.json){
            let Panel = newElement("panel");
            Panel.setAttribute("header",item.header);
            Panel.innerHTML=item.content;
            Panel.setAttribute("opened",item.active);
            Panel.setAttribute("stat",'tbr');
            Collapse.appendChild(Panel);
        }
        return Collapse;
    }
}

function renderCollapse(Collapse){
    let type = Collapse.getAttribute("type");
    for(let Panel of Collapse.querySelectorAll("panel")){
        let Header = newElement("Container");
        let Content = newElement("Content");
        let opened = Panel.getAttribute("opened");

        Content.innerHTML = Panel.innerHTML;
        Header.textContent = Panel.getAttribute("header");
        Panel.setAttribute("opened",opened=="true"?false:true);
        Panel.innerHTML="";

        Panel.appendChild(Header);
        Panel.appendChild(Content);
        Panel.setAttribute("maxheight",window.getComputedStyle(Content).height);

        Header.onclick=function(){
            let opened = Panel.getAttribute("opened");
            if(opened=="true"){
                Content.style.transform="scaleY(0)";
                Content.style.maxHeight="0px";
                Panel.setAttribute("opened","false");
            }else{
                if(type=="accordion"){
                    for(let item of Collapse.querySelectorAll("&>panel")){
                        if(item!=Panel){
                            try{
                                let _Content = item.querySelector("content");
                                _Content.style.transform="scaleY(0)";
                                _Content.style.maxHeight="0px";
                            }
                            catch(e){}
                            finally{
                                item.setAttribute("opened","false");
                            }
                        }
                    }
                }
                Content.style.transform="scaleY(1)";
                Content.style.maxHeight=Panel.getAttribute("maxheight");
                Panel.setAttribute("opened","true");
            }
        }

        Header.click();
    }
    Collapse.setAttribute("stat","rdd");
}

/**
 * 
 * @param { boolean } strict 
 */
function renderAllCollapse(strict){
    for(let item of strict?SelectAll("collapse[stat='tbr']"):SelectAll("collapse:not(collapse[stat='rdd'])")){
        renderCollapse(item);
    }
}
