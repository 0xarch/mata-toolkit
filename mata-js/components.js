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
            let Panel = newElement("panel",[],item.content);
            Panel.setAttribute("header",item.header);
            Panel.setAttribute("opened",item.active);
            Panel.setAttribute("stat",'tbr');
            Collapse.appendChild(Panel);
        }
        return Collapse;
    }
}

function renderCollapse(Collapse){
    let type = Collapse.getAttribute("type");
    let i = 0;
    let panels = [];
    for(let item of Collapse.childNodes){
        if(item.nodeType===1 && item.tagName=="PANEL") panels.push(item);
    }
    for(let Panel of panels){
        let Header = newElement("Container",[],Panel.getAttribute("header"));
        let Content = newElement("Content",[],Panel.innerHTML);
        let opened = Panel.getAttribute("opened");

        Panel.setAttribute("opened",opened=="true"?false:true);
        Panel.setAttribute("serial",i);
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
                    for(let item of panels){
                        if(item.getAttribute("serial")!=i){
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
        i++;
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

/**
 * 
 * @param { string } anchor 
 * @param { HTMLElement } element 
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

/**
 * 
 * @param { string } anchor 
 * @param { HTMLElement|string } element 
 */
function ReplaceAnchorWith(anchor,element){
    InsertAtAnchor(anchor,element,"after");
    Select(`anchor[anchor="${anchor}"]`).remove();
}

function renderCalendar(Calendar) {
    let config = Calendar.innerHTML;
    Calendar.innerHTML = '';

    // Parse Config
    if(config!=''){
        try {
            config = JSON.parse(config);
        } catch (e) {
            return new Result(Err, 3);
        }
    }
    // Read date
    let date = new Date();
    let year = parseInt(config['year'] && config['year'] != "this" ? config['year'] : date.getFullYear());
    let month = parseInt(config['month'] && config['month'] != "this" ? config['month'] : date.getMonth() + 1);

    let _conf_clickevent = config['clickevent'];
    let conf_clickevent = {};
    for (let i in _conf_clickevent) {
        let di;
        if (i[0] == '$') di = i.replace('$', `${year}-${month}-`);
        else di = i;
        conf_clickevent[di] = _conf_clickevent[i];
    }

    // Element Creating

    // Calendar Label
    let DayLabel   = $.createElement("Label",'',["days"]),
        LeftArrow  = $.createElement("Button",'',["left"],"<"),
        RightArrow = $.createElement("Button",'',["right"],">");
    let ArrowLabel = $.createElement("Label",'',["arrows"],[LeftArrow,RightArrow]),
        YearEntry  = $.createElement("select",'',["year_select"]),
        MonthEntry = $.createElement("select",'',["month_select"]);

    // Re-generate YearEntry and MonthEntry
    function _MLocal_RefreshYM(y){
        for(let i=y-10;y-10<=i,i<y+10;i++){
            let Option = $.createElement("Option",'',[],i+"年",{"value":i});
            YearEntry.appendChild(Option);
        }
        for(let i=1;i<=12;i++){
            let Option = $.createElement("Option",'',[],i+"月",{"value":i});
            MonthEntry.appendChild(Option);
        }
    }
    // Go to previous month
    function _MLocal_GoLastM() {
        let month = parseInt(MonthEntry.value),
            year = parseInt(YearEntry.value);
        if (month == 1) {
            month = 12; year -= 1
        } else month -= 1;
        MonthEntry.value = month;
        YearEntry.value = year;
        refresh_calendarbox();
    }
    // Go to next month
    function _MLocal_GoNextM(){
        let month = parseInt(MonthEntry.value),
            year = parseInt(YearEntry.value);
        if (month == 12) {
            month = 1; year += 1
        } else month += 1;
        MonthEntry.value = month;
        YearEntry.value = year;
        refresh_calendarbox();
    }
    /** day is in config:some(obj{})
     * @returns {string|false}
     */
    function _MLocTs_Incld(f,y,m,d){
        let ret;
        try{
            ret = config[f][y][m][d];
        }catch(_){ 
            try{
                ret = config[f]["EachYear"][m][d];
            }
            catch(_){ ret = false }
        }finally{ return ret }
    }
    /** day is in config:some(array)
     * @returns {boolean}
     */
    function _MLocTs_IncAr(f,y,m,d){
        let ret;
        try{
        if(config[f][y][m].includes(d)
        || config[f]["EachYear"][m].includes(d))
            ret = true
        else ret = false
        }catch(_){ ret = false }
        finally{ return ret }
    }

    _MLocal_RefreshYM(year);

    YearEntry.value = year;
    MonthEntry.value = month;

    let YearMonthLabel = newElement("Label",["months"],[YearEntry,MonthEntry]);
    let TextLabel = newElement("Label",["fo_fd0","text"],[YearMonthLabel,ArrowLabel]);
    for (let item of ['日', '一', '二', '三', '四', '五', '六']) {
        let DayP = newElement("p",[],item);
        DayLabel.appendChild(DayP);
    }
    let Label = newElement("Label",[],[TextLabel,DayLabel]);

    // Calendar Box
    let Container = newElement("Container",[],"",{"year":year,"month":month});

    Calendar.appendChild(Label);
    Calendar.appendChild(Container);
    let refresh_calendarbox = function() {
        Container.innerHTML="";
        let month = parseInt(MonthEntry.value),
            year = parseInt(YearEntry.value);
        let _l_year = parseInt(YearEntry.value),
            _l_month = parseInt(MonthEntry.value);

        YearEntry.innerHTML="";
        MonthEntry.innerHTML="";
        _MLocal_RefreshYM(_l_year);
        YearEntry.value = _l_year, MonthEntry.value = _l_month;

        // day blank for last month
        let first_day = DatetimeUtils.firstDayOf(year,month).getDay();
        if (first_day != 0)
            for (var i = 0; i < first_day; i++){
                let DayBlank = newElement("DayBlank");
                DayBlank.onclick = function(){_MLocal_GoLastM()};
                Container.appendChild(DayBlank);
        }

        // append day elements
        if (config['showToday']) {
            var today = new Date();
            var today_year = today.getFullYear(),
                today_month = today.getMonth() + 1,
                today_date = today.getDate();
        }
        let day_count = DatetimeUtils.dayCountOf(year,month);
        for (var i = 1; i <= day_count; i++) {
            let day_action = newElement('dayaction',[],i);
            let hasText = _MLocTs_Incld("Text",_l_year,_l_month,i),
                hasClickEvent = _MLocTs_Incld("ClickEvent",_l_year,_l_month,i);
            if(hasText){
                day_action.classList.add("hasText");
                let text = newElement("Tx",[],hasText);
                day_action.appendChild(text);
            }
            if(hasClickEvent){
                day_action.classList.add("hasClickEvent");
                day_action.onclick = function() {
                    eval(hasClickEvent)
                }
            }
            if(_MLocTs_IncAr("Marked",_l_year,_l_month,i))
                day_action.classList.add("hasMarked");
            if (config["showToday"]==true) {
                if (today_year == _l_year && today_month == _l_month && today_date == i) {
                    console.log(1);
                    day_action.classList.add("hasText");
                    day_action.appendChild(newElement("tx",['up'],"今天"));
                }
            }
            Container.appendChild(day_action);
        }
        let _lastDayCount = 42 - first_day - day_count;
        if (_lastDayCount != 0)
            for (var i = 0; i < _lastDayCount; i++){
                let DayBlank = newElement("DayBlank");
                DayBlank.onclick = function(){_MLocal_GoNextM()};
                Container.appendChild(DayBlank);
        }
    }
    // write arrow functions
    LeftArrow.onclick = function(){_MLocal_GoLastM()};
    RightArrow.onclick = function() {_MLocal_GoNextM()};
    YearEntry.onchange = function(){refresh_calendarbox()};
    MonthEntry.onchange = function(){refresh_calendarbox()};
    refresh_calendarbox();
}

function renderAllCalendar(){
    for(let item of SelectAll("calendar[stat='tbr']")){
        renderCalendar(item);
    }
}


function renderImageRoller(ImageRoller){
    let Imgs = ImageRoller.querySelectorAll("img");
    let len = Imgs.length;
    ImageRoller.setAttribute("i",0);
    ImageRoller.setAttribute("stopped","0");
    setInterval(()=>{
        if(ImageRoller.getAttribute("stopped")=="1") return;
        let i = parseInt(ImageRoller.getAttribute("i"));
        if(i<len){
            try{
                for(let I=0;I<len;I++){
                    if(I==i){
                        Imgs[I].style.display = "inline-block";
                        Imgs[I].style.left="0px";
                    }else if(I+1==i){
                        // 在 i 的左面
                        Imgs[I].style.display = "inline-block";
                        Imgs[I].style.left="-100%";
                    }else if(I-1==i || I+1==len){
                        // 在 i 的右面
                        Imgs[I].style.display = "inline-block";
                        Imgs[I].style.left="100%";
                    }else{
                        Imgs[I].style.display = "none";
                    }
                }
            }catch(e){
                console.error(e);
            }
            i++;
            if(i==len) i=0;
        }else{
            i=0;
        }
        ImageRoller.setAttribute("i",i);
    },parseInt(ImageRoller.getAttribute("time")));
}

function toggleRollingImage(ImageRoller,force){
    if(ImageRoller.getAttribute("stopped")=="0" || force){
        ImageRoller.setAttribute("stopped","1");
    }else{
        ImageRoller.setAttribute("stopped","0");
    }
}

function renderButton(Button){
    let F = Button.getAttribute("F").split(" ");
    console.log(F);
    switch(F[0]){
        case "callDrop":
            let Drop = Button.querySelector("drop");
            Drop.style.display = "none";
            Button.onclick = function(){
                Button.querySelector("drop").style.display="block";
            };
            Select("body").addEventListener("click",function(e){
                var elem = e.target;
                if(!Button.contains(elem)){
                    Button.querySelector("drop").style.display="none";
                }
            });
            Button.innerHTML += ___getInner(F[1],F[2]);
            break;
        case "link":
            Button.onclick = function(){
                window.open(F[1]);
            };
            Button.innerHTML=___getInner(F[2],F[3]);
            break;
        case "callNav":
            let Nav = document.querySelector(F[1]);
            let Cover = document.createElement("div");
            Cover.classList.add("M3tk-A-darkAll");
            Select("body").appendChild(Cover);
            Button.onclick = function(){
                Cover.style.display = "block";
                Nav.style.left = "0px";
                Cover.style.background="rgba(0,0,0,.25)";
            }
            Cover.onclick = function(){
                Nav.style.left = "calc(-30*var(--g-unit))";
                Cover.style.background = "transparent";
                setTimeout(()=>{
                    Cover.style.display = "none";
                },500);
            }
            Button.innerHTML=___getInner(F[2],F[3]);
            break;
    }
    Button.removeAttribute("F");
}

function ___getInner(ty,content){
    if(ty=="svg"){
        return SVGs[content];
    }else if(ty=="i"){
        return `<i class="${content.split(",").join(" ")}"></i>`;
    }else if(ty=="text"){
        return content;
    }
}

function renderToolbar(Toolbar){
    for(let item of Toolbar.querySelectorAll(":is(lbtn,rbtn)")){
        renderButton(item);
    }
}