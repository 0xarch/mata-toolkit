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
    constructor(title,content,size,open){
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

        Content.innerHTML = content;
        CollapseTitle.textContent = title;
        CollapseTitle.setAttribute("closed",active);

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
        return Collapse;
    }
}