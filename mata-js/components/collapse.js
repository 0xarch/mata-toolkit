class CollapseComponent{
    size;
    active;
    content;
    title;
    /**
     * 
     * @param { ?string } title 
     * @param { ?string } content 
     * @param { ?number } size 
     * @param { ?boolean } open
     */
    constructor(title,content,open,size){
        this.title = title;
        this.content = content;
        this.size = size!=undefined?size:0;
        this.active = open!=undefined?open:false;
    }
    setTitle(title){
        this.title = title;
    }
    setContent(content){
        this.content = content;
    }
    setSize(size){
        this.size = size;
    }
    setOpen(open){
        this.active = open;
    }
    render(){
        let Collapse = newElement("Collapse");
        let CollapseTitle = newElement("container");
        let Content = newElement("content");

        Content.innerHTML = this.content;
        CollapseTitle.textContent = this.title;
        CollapseTitle.setAttribute("opened",!this.active);
        Collapse.setAttribute("stat",'rdd');

        Collapse.appendChild(CollapseTitle);
        Collapse.appendChild(Content);

        CollapseTitle.onclick=function(){
            let opened = CollapseTitle.getAttribute("opened");
            if(opened=="true"){
                Content.style.setProperty("--mh",window.getComputedStyle(Content).height);
                Content.style.transform="scaleY(0)";
                Content.style.maxHeight="0px";
                Content.style.margin="0px";
                CollapseTitle.setAttribute("opened","false");
            }else{
                Content.style.transform="scaleY(1)";
                Content.style.maxHeight="var(--mh)";
                Content.style.margin=".5rem";
                CollapseTitle.setAttribute("opened","true");
            }
        }
        CollapseTitle.click();
        return Collapse;
    }
    renderHTMLElement(){
        let Collapse = newElement("Collapse");
        Collapse.setAttribute("title",this.title);
        Collapse.innerHTML=this.content;
        Collapse.setAttribute("opened",this.active);
        Collapse.setAttribute("stat",'tbr');
        return Collapse;
    }
}

function renderCollapse(Collapse){
    let CollapseTitle = newElement("container");
    let Content = newElement("content");
    let opened = Collapse.getAttribute("opened");

    Content.innerHTML = Collapse.innerHTML;
    CollapseTitle.textContent = Collapse.getAttribute("title");
    CollapseTitle.setAttribute("opened",opened=="true"?false:true);
    Collapse.innerHTML="";

    Collapse.appendChild(CollapseTitle);
    Collapse.appendChild(Content);
    let maxHeight=window.getComputedStyle(Content).height;

    CollapseTitle.onclick=function(){
        let opened = CollapseTitle.getAttribute("opened");
        if(opened=="true"){
            Content.style.transform="scaleY(0)";
            Content.style.maxHeight="0px";
            CollapseTitle.setAttribute("opened","false");
        }else{
            Content.style.transform="scaleY(1)";
            Content.style.maxHeight=maxHeight;
            CollapseTitle.setAttribute("opened","true");
        }
    }
    
    CollapseTitle.click();
    Collapse.setAttribute("stat",'rdd');
}

function renderAllCollapse(){
    for(let item of SelectAll("collapse[stat='tbr']")){
        renderCollapse(item);
    }
}
