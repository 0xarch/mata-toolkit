const getIDFromArgument=(arg)=>'#'+arg.replace('#','');
const getConfigFromID=(id)=>{
    let config;
    try{
        config = JSON.parse(Select(id).innerHTML);
        Select(id).innerHTML="";
    }catch(e){
        throw e;
    }
    return config;
};

/*  |``````TabLabel``````|
    |_Tab1_|_Tab2_|_Tab3_|
    |                    |
    |       Content      |
    |                    |
    |____________________|
*/
function buildTabs(id){
    let TabsID = getIDFromArgument(id);
    let Tabs = Select(TabsID);
    let TabContainer = newElement("container"); // contains label and tabs
    let TabsBox = newElement("container");
    let contents = Tabs.querySelectorAll("content");
    let containing_tabs;
    let tab_active;

    if(Tabs.getAttribute("title")){
        let TabLabel = newElement("label");
        TabLabel.textContent = Tabs.getAttribute("title");
        TabContainer.appendChild(TabLabel);
        TabContainer.appendChild(TabsBox);
        TabContainer.style.setProperty("flex-direction","column");
        containing_tabs = TabsBox;
    }else{
        containing_tabs = TabContainer;
        delete TabsBox;
    }
    containing_tabs.classList.add("widen");

    for(let content_element of contents){
        let tab_name = content_element.getAttribute("tab");
        let Tab = newElement("tab");
        Tab.textContent = tab_name;
        if(content_element.getAttribute("active")=="true") tab_active=Tab;
        Tab.onclick=function(){
            for(let item of containing_tabs.childNodes){
                item.setAttribute("active","false");
                Tabs.querySelector(`*[tab=${item.textContent}]`).style.display="none";
            };
            Tab.setAttribute("active","true");
            Tabs.querySelector(`*[tab=${tab_name}]`).style.display="block";
        }
        containing_tabs.appendChild(Tab);
    }
    if(!tab_active) tab_active = containing_tabs.childNodes[0];
    tab_active.click();
    Tabs.insertBefore(TabContainer,Tabs.firstChild);
}

function buildTabsJSON(id){
    let TabsID=getIDFromArgument(id);
    let Tabs = Select(TabsID);
    let config;
    try{
        config = JSON.parse(Tabs.innerHTML);
        Tabs.innerHTML="";
    }catch(e){
        return new Result(Err);
    }
    let TabContainer = newElement("container"); // contains label and tabs
    let TabsBox = newElement("container");
    let containing_tabs;
    let tab_active;

    if(config.title){
        let TabLabel = newElement("label");
        TabLabel.textContent = config.title;
        TabContainer.appendChild(TabLabel);
        TabContainer.appendChild(TabsBox);
        // set style
        TabContainer.style.setProperty("flex-direction","column");
        containing_tabs = TabsBox;
    }else{
        containing_tabs = TabContainer;
        delete TabsBox;
    }
    containing_tabs.classList.add("widen");

    for(let tab_element of config.tabs){
        let tab_name = tab_element.tab;
        let Tab = newElement("tab");
        let Content = newElement("content");
        Content.setAttribute("tab",tab_name);
        Content.innerHTML='<pre>'+tab_element.content+'</pre>';
        Tab.textContent = tab_name;
        Tabs.appendChild(Content);
        if(tab_element["active"]=="true")
            tab_active=Tab;
        Tab.onclick=function(){
            for(let item of containing_tabs.childNodes){
                item.setAttribute("active","false");
                Tabs.querySelector(`*[tab=${item.textContent}]`).style.display="none";
            };
            Tab.setAttribute("active","true");
            Tabs.querySelector(`*[tab=${Tab.textContent}]`).style.display="block";
        }
        containing_tabs.appendChild(Tab);
    }
    if(!tab_active) tab_active = containing_tabs.childNodes[0];
    tab_active.click();
    Tabs.insertBefore(TabContainer,Tabs.firstChild);
}

function buildPaginationJSON(id){
    let PaginationID = getIDFromArgument(id);
    let Pagination = Select(PaginationID);
    let config = getConfigFromID(PaginationID);
    let page =parseInt(config.page),now=parseInt(config.now);
    let haveSeparator = page>5;
    let builds = [];

    let GoPrev = newElement("a"),GoNext = newElement("a");
    GoPrev.textContent="<";
    GoNext.textContent=">";
    GoPrev.classList.add("prev");
    GoNext.classList.add("next");
    if(now==1) GoPrev.classList.add("disabled");
    else {
        let i = now-1;
        GoPrev.setAttribute("href",eval('`'+config.link+'`'));
    }
    if(now==page) GoNext.classList.add("disabled");
    else {
        let i = now+1;
        GoNext.setAttribute("href",eval('`'+config.link+'`'));
    }
    Pagination.appendChild(GoPrev);

    for(let i=1;i<=page;i++){
        if([1,now-1,now,now+1,page].includes(i)){
            builds.push(i);
        }else if(haveSeparator){
            if(builds.at(-1)!="space")
                builds.push("space");
        }
    }
    for(let item of builds){
        if(item=="space"){
            Pagination.appendChild(newElement("space"));
            continue;
        }
        let i = item;
        let Page = newElement("a");
        Page.textContent=i;
        Page.classList.add("page");
        if(i==now){
            Page.classList.add("this");
        }
        Page.setAttribute("href",eval('`'+config.link+'`'));
        Pagination.appendChild(Page);
        
    }
    Pagination.appendChild(GoNext);
}

function Inheritor(id) {
        id = id.replace('#', '');
        let element = Select('#' + id);
        let config = /[#\w]+/.exec(element.textContent);
        let f_id = '#' + config[0].replace('#', '');
        let f = Select(f_id);
        let i_father = element.parentNode;
        element.remove();
        i_father.innerHTML = f.innerHTML;
    }
