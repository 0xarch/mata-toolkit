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
            let TabLabel = newElement("label",[],this.title);
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
            let Tab = newElement("tab",[],tab_name);
            let Content = newElement("content",[],tab.content);
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