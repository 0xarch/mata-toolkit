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

        Content.innerHTML = this.content;
        CollapseTitle.textContent = this.title;
        CollapseTitle.setAttribute("closed",this.active);

        Collapse.appendChild(CollapseTitle);
        Collapse.appendChild(Content);
        let maxHeight=window.getComputedStyle(Content).height;

        CollapseTitle.onclick=function(){
            let opened = CollapseTitle.getAttribute("opened");
            if(opened=="true"){
                Content.style.transform="scaleY(0)";
                Content.style.maxHeight="0px";
                Content.style.margin="0px";
                CollapseTitle.setAttribute("opened","false");
            }else{
                Content.style.transform="scaleY(1)";
                Content.style.maxHeight=maxHeight;
                Content.style.margin=".5rem";
                CollapseTitle.setAttribute("opened","true");
            }
        }
        CollapseTitle.click();
        return Collapse;
    }
}


class TabsComponent{
    tabs;
    size;
    position;
    type;
    title;
    /**
     * 
     * @param {Array.<{tab:string,content:string,active:?boolean}>} tabs
     * @param { ?string } title
     * @param { ?number } size
     * @param { ?string } position 
     * @param { ?string } type 
     */
    constructor(tabs,title,size,position,type){
        this.tabs = tabs;
        this.title = title;
        this.size = size!=undefined?size:0;
        this.position = position!=undefined?position:"top";
        this.type = type!=undefined?type:"tab";
    }
    /**
     * @param {Array.<{tab:string,content:string}} tabs
     */
    setTabs(tabs){
        this.tabs = tabs;
    }
    setSize(size){
        this.size = size;
    }
    setPosition(position){
        this.position = position;
    }
    setType(type){
        this.type = type;
    }
    render(){
        let Tabs = newElement("Tabs");
        let TabContainer = newElement("container"); // contains label and tabs
        let TabsBox = newElement("container");
        let containing_tabs;
        let tab_active;

        if(this.title!=null && this.title!=undefined){
            let TabLabel = newElement("label");
            TabLabel.textContent = this.title;
            TabContainer.appendChild(TabLabel);
            TabContainer.appendChild(TabsBox);
            TabContainer.style.setProperty("flex-direction","column");
            containing_tabs = TabsBox;
        }else{
            containing_tabs = TabContainer;
        }
        containing_tabs.classList.add("widen");

        for(let tab of this.tabs){
            let tab_name = tab.tab;
            let Tab = newElement("tab");
            let Content = newElement("content");
            Tab.textContent = tab_name;
            if(tab.active) tab_active=Tab;
            Tab.onclick=function(){
                for(let item of containing_tabs.childNodes){
                    item.setAttribute("active","false");
                    Tabs.querySelector(`*[tab="${item.textContent}"]`).style.display="none";
                };
                Tab.setAttribute("active","true");
                Tabs.querySelector(`*[tab="${tab_name}"]`).style.display="block";
            }
            containing_tabs.appendChild(Tab);
            Content.innerHTML=tab.content;
            Content.setAttribute("tab",tab_name);
            Tabs.appendChild(Content);
        }
        if(!tab_active) tab_active = containing_tabs.childNodes[0];
        tab_active.click();
        if(this.position=="top") Tabs.insertBefore(TabContainer,Tabs.firstChild);
        else Tabs.appendChild(TabContainer);
        return Tabs;
    }
}

/**
 * 
 * @param { string } anchor 
 * @param { element } element 
 * @param { ?string } side 
 */
function InsertAtAnchor(anchor,element,side){
    let Anchor = Select(`anchor[anchor="${anchor}"`);
    let parent = Anchor.parentNode;
    if(side=="after"){
        if(parent.lastChild == Anchor)
            parent.appendChild(element);
        else{
            parent.insertBefore(element,Anchor.nextSibling);
        }
    }else{
        parent.insertBefore(element,Anchor);
    }
}