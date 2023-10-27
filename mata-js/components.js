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
    let day_conf = !config['config'] ? {} : config['config'];

    // Read date
    let date = new Date();
    let year = parseInt(config['year'] && config['year'] != "this" ? config['year'] : date.getFullYear());
    let month = parseInt(config['month'] && config['month'] != "this" ? config['month'] : date.getMonth() + 1);
    month = month<10 ? '0' + month : month;

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
    let Label = newElement("Label");
    let TextLabel = newElement("Label");
    let DayLabel = newElement("Label");
    Label.appendChild(TextLabel);
    Label.appendChild(DayLabel);
    let LeftArrow = newElement("Arrow"), RightArrow = newElement("Arrow");
    let MonthLabel = newElement("Label");
    LeftArrow.textContent="<";
    RightArrow.textContent=">";
    MonthLabel.classList.add("months");
    DayLabel.classList.add("days");
    TextLabel.classList.add("fo_fd0");
    TextLabel.appendChild(LeftArrow);
    TextLabel.appendChild(MonthLabel);
    TextLabel.appendChild(RightArrow);
    for (let item of ['日', '一', '二', '三', '四', '五', '六']) {
        let DayP = newElement("p");
        DayP.textContent = item;
        DayLabel.appendChild(DayP);
    }

    // Calendar Box
    let Container = newElement("Container");
    Container.setAttribute("year",year);
    Container.setAttribute("month",month);

    const e_dd_test = (e_dd, day) => {
        try {
            if (e_dd.includes(day))
                return true
        } catch (_) {
            for (let item in e_dd) {
                if (item == day)
                    return [true, e_dd[item]]
            }
        }
        return undefined
    }
    /**
     * @param { string } year
     * @param { string } month
     * @param { number } day
     * @param { object } day_conf_selected
     * @returns { boolean }
     */
    let test_day = function(year, month, day, day_conf_selected) {
        if (!day_conf_selected) return false;
        month = parseInt(month);
        if (day_conf_selected['each']) {
            let e_dc = day_conf_selected['each'];
            if (e_dc['each']) {
                let result = e_dd_test(e_dc['each'], day);
                if (result) return result;
            }
            if (e_dc[month]) {
                let result = e_dd_test(e_dc[month], day);
                if (result) return result;
            }
        }
        if (day_conf_selected[year]) {
            let e_dc = day_conf_selected[year];
            if (e_dc['each']) {
                let result = e_dd_test(e_dc['each'], day);
                if (result) return result;
            }
            if (e_dc[month]) {
                let result = e_dd_test(e_dc[month], day);
                if (result) return result;
            }
        }
        return false
    }
    let refresh_calendarbox = function() {
        let month = parseInt(Container.getAttribute('month')),
            year = parseInt(Container.getAttribute('year'));
        month = month<10 ? '0' + month : month;
        // first day Blank
        let first_day = DatetimeUtils.firstDayOf(year,month).getDay();
        if (first_day != 0)
            for (var i = 0; i < first_day; i++)
                Container.appendChild(newElement('dayblank'));
        MonthLabel.textContent = year + '年' + month + '月';

        // append day elements
        if (day_conf['showtoday']) {
            var today = new Date();
            var today_year = today.getFullYear(),
                today_month = today.getMonth() + 1,
                today_date = today.getDate();
        }
        let day_count = DatetimeUtils.dayCountOf(year,month);
        for (var i = 1; i <= day_count; i++) {
            let day_action = newElement('dayaction');
            day_action.textContent = i;
            if (test_day(year, month, i, day_conf['mark']))
                day_action.setAttribute('marked', true)
            let hover = test_day(year, month, i, day_conf['text']);
            if (hover[0]) {
                day_action.setAttribute('textfilled', true);
                let text = newElement("tx");
                text.textContent = hover[1];
                day_action.appendChild(text);
            }
            let clickevent = test_day(year, month, i, day_conf['click']);
            if (clickevent[0]) {
                day_action.setAttribute('clickevented', true);
                day_action.onclick = function() {
                    eval(clickevent[1])
                }
            }
            if (day_conf['showtoday']) {
                if (today_year == year && today_month == Container.getAttribute('month') && today_date == i) {
                    day_action.setAttribute('textfilled', true);
                    let text = newElement("tx");
                    text.textContent = "今天";
                    day_action.appendChild(text);
                }
            }
            Container.appendChild(day_action);
        }
    }
    // write arrow functions
    LeftArrow.onclick = function() {
        Container.innerHTML = '';
        let month = parseInt(Container.getAttribute('month')),
            year = parseInt(Container.getAttribute('year'));
        if (month == 1) {
            month = 12, year -= 1
        } else month -= 1;
        Container.setAttribute('month', month);
        Container.setAttribute('year', year);
        refresh_calendarbox();
    }
    RightArrow.onclick = function() {
        Container.innerHTML = '';
        let month = parseInt(Container.getAttribute('month')),
            year = parseInt(Container.getAttribute('year'));
        if (month == 12) {
            month = 1, year += 1
        } else month += 1;
        Container.setAttribute('month', month);
        Container.setAttribute('year', year);
        refresh_calendarbox();
    }
    refresh_calendarbox();

    // Final Process
    Calendar.appendChild(Label);
    Calendar.appendChild(Container);
}

function renderAllCalendar(){
    for(let item of SelectAll("calendar[stat='tbr']")){
        renderCalendar(item);
    }
}