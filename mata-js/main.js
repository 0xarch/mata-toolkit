 const ResultType = {
    Ok: Symbol(1),
    Err: Symbol(2)
};
const Ok = ResultType.Ok,
    Err = ResultType.Err;
let GetActive = (element) => {
        return element.getAttribute('active') == "true" ? true : false
    },
    Select = (query) => document.querySelector(query),
    SelectAll = (query) => document.querySelectorAll(query),
    Toggle = (element) => element.setAttribute('active', element.getAttribute('active') == "true" ? false : true),
    ToggleForce = (element, bool) => element.setAttribute('active', bool),
    removeElement = (query) => document.querySelector(query).remove(),
    Exist = (_var) => _var != null;

/**
 * 
 * @param { string } tag 
 * @returns HTMLElement
 */
function newElement(tag){
    return document.createElement(tag);
}

const ColorUtils = {
    /**
     * @param { HSL } hsl the specfic HSL color
     * @param { bool} textmode if uses text output (CSS format), defaults to false
     * @returns { {r:number,g:number,b:number}|string }
     */
    HSLtoRGB(hsl, textmode = false) {
        let H = hsl.h,
            S = hsl.s / 100,
            L = hsl.l / 100;
        const C = (1 - Math.abs(2 * L - 1)) * S;
        const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
        const m = L - C / 2;
        const vRGB = [];
        if (H >= 0 && H < 60) vRGB.push(C, X, 0);
        else if (H >= 60 && H < 120) vRGB.push(X, C, 0);
        else if (H >= 120 && H < 180) vRGB.push(0, C, X);
        else if (H >= 180 && H < 240) vRGB.push(0, X, C);
        else if (H >= 240 && H < 300) vRGB.push(X, 0, C);
        else if (H >= 300 && H < 360) vRGB.push(C, 0, X);
        const [vR, vG, vB] = vRGB;
        const R = 255 * (vR + m);
        const G = 255 * (vG + m);
        const B = 255 * (vB + m);
        if (textmode) return `rgb(${R},${G},${B})`;
        else return {
            r: R,
            g: G,
            b: B
        };
    },
    /**
     * convert RGB to HSL
     * @param {*} r Red
     * @param {*} g Green
     * @param {*} b Blue
     * @returns { HSL }
     */
    RGBtoHSL(r, g, b) {
        let R = r / 255,
            G = g / 255,
            B = b / 255;
        let min = Math.min(r, g, b),
            max = Math.max(r, g, b);
        let l = (min + max) / 2,
            d = max - min;
        let H, S, L = l;
        if (max == min) H = S = 0;
        else {
            S = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case R:
                    H = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case G:
                    H = 2.0 + (b - r) / d;
                    break;
                case B:
                    H = 4.0 + (r - g) / d;
                    break;
            }
            H = Math.round(H * 60);
        }
        S = Math.round(S * 100), L = Math.round(L * 100);
        return new HSL(H, S, L);
    },
    BrowserIsDark() {
        return matchMedia('(prefers-color-scheme:dark)').matches;
    }
}

const DatetimeUtils = {
    /**
     * if the year is leap year
     * @param { number } year
     * @returns { true|false }
     */
    testLeap(year) {
        if (year % 100 != 0)
            if (year % 4 == 0) return true
        else return false
        else
        if (year % 400 == 0) return true
        else return false
    },
    /**
     * the count of day of the month
     * @param { string | number } year
     * @param { string| number } month
     * @returns { 31|30|29|28 }
     */
    dayCountOf(year, month) {
        month = parseInt(month);
        if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31
        else if (month == 2)
            if (this.testLeap(parseInt(year)))
                return 29
        else return 28
        else return 30
    },
    /**
     * the first day of the month
     * @param { string|number } year
     * @param { string|number } month
     * @returns { Date }
     */
    firstDayOf(year, month) {
        return new Date(`${year}-${month}-1`);
    },
    /**
     *
     * @param { string } string
     * @returns { {year:string, month:string, day:string} } object(JSON)
     * @example stringToObject('2023-06-17')
     */
    stringToObject(string) {
        return {
            year: string.slice(0, 4),
            month: string.slice(5, 7),
            day: string.slice(8, 10)
        };
    }
}

class HSL {
    h;
    s;
    l;
    /**
     * @constructor HSL
     * @param {*} h Hue 色相
     * @param {*} s Saturation 饱和度 (percent)
     * @param {*} l Lightness 亮度 (percent)
     */
    constructor(h, s, l) {
        this.h = h ? h : 0;
        this.s = s ? s : 0;
        this.l = l ? l : 0;
    }
    /**
     * adjust the hue, returns new HSL
     * 调节色相，返回新的 HSL
     * @param { number } dh delta hue 变化的色相
     * @returns { HSL }
     */
    dh(dh) {
        let h = this.h + dh;
        if (h < 0) h = 0;
        else if (h > 360) h = 360;
        return new HSL(h, this.s, this.l);
    }
    /**
     * adjust the saturation, returns new HSL
     * 调节饱和度，返回新的 HSL
     * @param { number } ds delta saturation 变化的饱和度
     * @returns { HSL }
     */
    ds(ds) {
        let s = this.s + ds;
        if (s < 0) s = 0;
        else if (s > 100) s = 100;
        return new HSL(this.h, s, this.l);
    }
    /**
     * adjust the lightness, returns new HSL
     * 调节亮度，返回新的 HSL
     * @param { number } dl delta lightness 变化的亮度
     * @returns { HSL }
     */
    dl(dl) {
        let l = this.l + dl;
        if (l < 0) l = 0;
        else if (l > 100) l = 100;
        return new HSL(this.h, this.s, l);
    }
    /**
     * @returns { string } CSS 声明
     */
    CSS = () => `hsl(${this.h},${this.s}%,${this.l}%)`;
    /**
     * 测试以该HSL为背景，应该使用亮色文字还是暗色文字
     * @returns { "#000" | "#FFF" } HEX 字符串
     */
    textColor() {
        let rgb = ColorUtils.HSLtoRGB(this);
        let gray = rgb.r * 3 + rgb.g * 6 + rgb.b + 5;
        if (gray > 1200) return "#000"
        else return "#FFF"
    }
}

class Result {
    result;
    errcode;
    #msg;
    constructor(result, errcode) {
        if (result == Ok) {
            this.result = Ok;
            this.errcode = 0;
        } else {
            this.result = Err;
            this.errcode = parseInt(errcode);
        }
    }
    getMsg() {
        return this.#msg;
    }
    match(err_arr) {
        for (let item in err_arr) {
            if (item == this.errcode) {
                this.#msg = err_arr[item];
                break;
            }
        }
    }
    toOk() {
        this.result = Ok
    }
    toErr(errcode) {
        this.result = Err;
        this.errcode = errcode
    }
    testOk() {
        return this.result === Ok
    }
    testErr() {
        return this.result === Err
    }
    crash_if_error(){
        if(this.result === Err)
            throw new error;
    }
    unwrap() {
        if (this.testOk()) {
            this.release();
        } else {
            this.match(DefaultErrMsg);
            console.log(this.#msg);
        }
    }
    release() {
        delete this;
    }
}

class ElementController {
    element;
    constructor(query) {
        this.element = Select(query);
    }
    setStyle(key, val) {
        this.element.style.setProperty(key, val);
    }
    setAttribute(key,val) {
        this.element.setAttribute(key, val);
    }
    isActived() {
        return GetActive(this.element);
    }
    release() {
        delete this;
    }
    remove() {
        this.element.remove();
        delete this;
    }
}


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

function buildCollapse(id){
    let CollapseID = getIDFromArgument(id);
    let Collapse = Select(CollapseID);
    let CollapseTitle = newElement("container");
    let Content = newElement("content");
    let opened = Collapse.getAttribute("opened");

    Content.innerHTML = Collapse.innerHTML;
    CollapseTitle.textContent = Collapse.getAttribute("title");
    CollapseTitle.setAttribute("closed",opened?opened:false);
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

const WidgetConstructor = {
    Inheritor(id) {
        id = id.replace('#', '');
        let element = Select('#' + id);
        let config = /[#\w]+/.exec(element.textContent);
        let f_id = '#' + config[0].replace('#', '');
        let f = Select(f_id);
        let i_father = element.parentNode;
        element.remove();
        i_father.innerHTML = f.innerHTML;
    },
    /**
     * init a calendar element
     * @param { string } id the id of calendar element
     * @returns { Result }
     */
    Calendar(id) {
        id = id.replace('#', '');
        let element = Select('#' + id);
        if (!Exist(element)) return new Result(Err, 3);
        let config = element.innerHTML;
        element.innerHTML = '';

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
        let main_label = newElement('label');
        let fbox = newElement('fbox');
        let left_arrow = newElement('arrow'), right_arrow = newElement('arrow');
        left_arrow.setAttribute('towards', 'left');
        right_arrow.setAttribute('towards', 'right');
        let month_label = newElement('textlabel');
        fbox.appendChild(left_arrow);
        fbox.appendChild(month_label);
        fbox.appendChild(right_arrow);
        let day_label = newElement('fbox');
        //day_label.setAttribute('FullWidth', '');
        day_label.classList.add("w_100");
        for (let item of ['日', '一', '二', '三', '四', '五', '六']) {
            let _day_label = newElement('textlabel');
            _day_label.textContent = item;
            day_label.appendChild(_day_label);
        }
        main_label.appendChild(fbox);
        main_label.appendChild(day_label);

        // Calendar Box
        let main_box = newElement('calendarbox');
        main_box.setAttribute('year', year);
        main_box.setAttribute('month', month);

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
            let month = parseInt(main_box.getAttribute('month')),
                year = parseInt(main_box.getAttribute('year'));
            month = month<10 ? '0' + month : month;
            // first day Blank
            let first_day = DatetimeUtils.firstDayOf(year,month).getDay();
            if (first_day != 0)
                for (var i = 0; i < first_day; i++)
                    main_box.appendChild(newElement('dayblank'));
            month_label.textContent = year + '年' + month + '月';

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
                    if (today_year == year && today_month == main_box.getAttribute('month') && today_date == i) {
                        day_action.setAttribute('textfilled', true);
                        let text = newElement("tx");
                        text.textContent = "今天";
                        day_action.appendChild(text);
                    }
                }
                main_box.appendChild(day_action);
            }
        }
        // write arrow functions
        left_arrow.onclick = function() {
            main_box.innerHTML = '';
            let month = eval(main_box.getAttribute('month')),
                year = eval(main_box.getAttribute('year'));
            if (month == 1) {
                month = 12, year -= 1
            } else month -= 1;
            main_box.setAttribute('month', month);
            main_box.setAttribute('year', year);
            refresh_calendarbox();
        }
        right_arrow.onclick = function() {
            main_box.innerHTML = '';
            let month = eval(main_box.getAttribute('month')),
                year = eval(main_box.getAttribute('year'));
            if (month == 12) {
                month = 1, year += 1
            } else month += 1;
            main_box.setAttribute('month', month);
            main_box.setAttribute('year', year);
            refresh_calendarbox();
        }
        refresh_calendarbox();

        // Final Process
        element.appendChild(main_label);
        element.appendChild(main_box);
        return new Result(Ok);
    },
    ActionTitle(){
        for(let item of SelectAll("action,.action")){
            item.setAttribute("title",item.textContent);
        }
    },
    Wind(){
        for(let item of SelectAll("wind,.wind")){
            let label = item.querySelector("label");
            let content = item.querySelector("content");
            label.onclick=function(event,force){
                console.log(force);
                item.setAttribute("unwinded",force?force:(item.getAttribute("unwinded")=="true"?"false":"true"));
                if(item.getAttribute("unwinded")=="true"){
                    content.style.setProperty("max-height","fit-content");
                    content.style.setProperty("transform","scaleY(1)");
                }else{
                    content.style.setProperty("max-height","0vh");
                    content.style.setProperty("transform","scaleY(0)");
                }
            }
            label.click(item.getAttribute("unwinded"));
        }
    }
}


 const MataPalette = {
    "RED": [0, 88],
    "PINK": [330, 92],
    "PURPLE": [285, 80],
    "DEEPPURPLE": [262, 52],
    "INDIGO": [231, 48],
    "BLUE": [207, 100],
    "LIGHTBLUE": [199, 98],
    "CYAN": [187, 100],
    "TEAL": [155, 62],
    "GREEN": [122, 39],
    "LIGHTGREEN": [88, 62],
    "LIME": [66, 70],
    "YELLOW": [54, 87],
    "AMBER": [45, 100],
    "ORANGE": [36, 100],
    "DEEPORANGE": [14, 100]
};
class PaletteController {
    palettes;
    colns;
    bgcoln;
    /**
     * initialize a palette processer from specific color palettes
     * @constructor
     * @param { Object } palettesJson
     * @example let palette_processer = new MPaletteProcesser(MataPalette)
     */
    constructor(palettesJson) {
        this.palettes = palettesJson;
        this.colns = {};
        matchMedia('(prefers-color-scheme:dark)').onchange = () => {
            for (let item in this.colns) {
                this.setPaletteByHSL(item, this.colns[item],this.bgcoln==item);
            }
        };
    }
    #Root = new ElementController(":root");
    /**
     * macro! set the primary palette from specific color & light
     * @param { string } col
     * @param { number} light
     * @returns { Result }
     */
    setPrimary(col, light) {
        if (!this.palettes[col])
            return new Result(Err, 2);
        else {
            this.setPaletteByHSL("primary", new HSL(this.palettes[col][0], this.palettes[col][1], light / 10));
            return new Result(Ok);
        }
    }
    /**
     * macro! set the seconday palette from specific color & light
     * @param { string } col secondary color
     * @param { number} light secondary light
     * @returns { Result }
     */
    setSecondary(col, light) {
        if (!this.palettes[col]) return new Result(Err, 2);
        else {
            this.setPaletteByHSL("secondary", new HSL(this.palettes[col][0], this.palettes[col][1], light / 10));
            return new Result(Ok);
        }
    }
    /**
     * macro! set the primary & seconday palette from specific color & light
     * @param { string } colPr primary color
     * @param { number} lightPr primary light
     * @param { string } colSc secondary color
     * @param { number} lightSc secondary light
     * @returns { Result }
     */
    setSP(colPr, lightPr, colSc, lightSc) {
        let r1 = this.setPrimary(colPr, lightPr);
        let r2 = this.setSecondary(colSc, lightSc);
        if (r1.is_ok() && r2.is_ok()) return new Result(Ok);
        else return new Result(Err);
    }
    /**
     * set the specific palette from a HSLColor
     * @param { string } name
     * @param { HSL } hsl
     * @param { boolean } force_background whether to let background use this color or not
     * @returns { void }
     * @example setPaletteByHSL("primary",new HSL(0,0,0),true)
     */
    setPaletteByHSL(name, hsl, force_background) {
        this.colns[name] = hsl ? hsl : this.colns[name];
        let v2 = this.colns[name];
        let v1 = v2.dl(-15),
            v3 = v2.dl(12);
        if (ColorUtils.BrowserIsDark()) {
            v1 = v1.dl(-18), v2 = v2.dl(-18), v3 = v3.dl(-17);
        }
        this.#Root.setStyle(`--${name}-color-1`, v1.CSS());
        this.#Root.setStyle(`--${name}-color-2`, v2.CSS());
        this.#Root.setStyle(`--${name}-color-3`, v3.CSS());
        this.#Root.setStyle(`--${name}-text-1`, v1.textColor());
        this.#Root.setStyle(`--${name}-text-2`, v2.textColor());
        this.#Root.setStyle(`--${name}-text-3`, v3.textColor());
        if(force_background==true){
            this.colns["background"]=ColorUtils.BrowserIsDark()?v2.ds(-45).dl(-20):v2.ds(10).dl(40);
            this.#Root.setStyle(`--background-colored`,this.colns["background"].CSS());
            this.bgcoln=name;
        }
        return new Result(Ok);
    }
    /**
     * set the specific palette from palette in
     * @param { string } name the name of palette (e.g. "primary" )
     * @param { string } color the name of color (e.g. "RED" )
     * @param { number } light the light of color (e.g. 550 )
     * @param { boolean } force_background whether to let background use this color or not
     * @returns { Result }
     */
    setPaletteFrom(name, color, light,force_background) {
        if (!this.palettes[color])
            return new Result(Err, 2);
        else {
            this.colns[name] = new HSL(this.palettes[color][0], this.palettes[color][1], light / 10);
            return this.setPaletteByHSL(name,this.colns[name],force_background);
        }
    }
    release() {
        delete this;
    }
}


const Em3et={
    /**
     * @param { element } element
     * @param { string } type
     */
    render(element,type){
        let stack = this.AST(element.innerHTML);
        let parsed_text = this.Compile(stack);
        if(type=='plain') element.textContent=parsed_text;
        else element.innerHTML=parsed_text;
    },
    /**
    *
    * @param { string } raw_string
    * @returns { Array }
    */
    AST(raw_string){
        let quo = false;
        let stack = [];
        let raw_chars = raw_string.split("");
        let i = 0,len = raw_chars.length;
        while(i<len){
            let _char_now = raw_chars[i];
            if(/[A-Za-z]/.test(_char_now)){
                let _str = _char_now;
                i++;
                while(i<len){
                    let __char_now = raw_chars[i];
                    if(/[A-Za-z ]/.test(__char_now)){
                        _str = _str+__char_now;
                        i++;
                    }else{
                        stack.push(_str);
                        i--;
                        break;
                    }
                }
            }else
            if(['(',':','%','*','"',"'"].includes(_char_now)){
                if(!['"',"'"].includes(_char_now)) stack.push(_char_now);
                let _str = "";
                let _end_char = _char_now!='('?_char_now:')';
                i++;
                while(i<len){
                    let __char_now = raw_chars[i];
                    if(__char_now!=_end_char){
                        if(__char_now!='\\'){
                            _str += __char_now;
                        }else{
                            _str += raw_chars[++i];
                        }
                        i++;
                    }else{
                        stack.push(_str);
                        break;
                    }
                }
            }else
            if(_char_now==','){
                if(quo){
                    stack.push('}');
                    quo=false;
                }else{
                    stack.push('{');
                    quo=true;
                }
            }else
            if(!/[ \n]/.test(_char_now)) stack.push(_char_now);
            i++;
        }
        return stack
    },
    /**
    *
    * @param { Array } stack
    * @returns { String }
    */
    Compile(stack){
        let result = new String;
        let i=0,len = stack.length;
        let element_stack = new Array;
        result = 'let str = new String; str+=`';
        let in_command = false, in_variable = false;
        while(i<len){
            let text = stack[i];
            if(/[A-Za-z]+/.test(text)){
                result = result+'<'+text;
                element_stack.push(text);
            }else{
                switch(text){
                    case '{':
                    case '[':
                        result +='>';
                        break;
                    case '}':
                    case ']':
                        result = `${result}</${element_stack.pop()}>`;
                        break;
                    case '!':
                    case '/':
                        element_stack.pop();
                        result += '/>';
                        break;
                    case ':':
                        i++;
                        result = result+stack[i];
                        break;
                    case '(':
                        i++;
                        result = result+' '+stack[i];
                        break;
                    case '#':
                        i++;
                        result = `${result} id="${stack[i]}"`;
                        break;
                    case '.':
                        i++;
                        result = `${result} class="${stack[i]}"`;
                        break;
                    case '%':
                        i++;
                        if(in_command){
                            result += '`'+stack[i]+';str+=`';
                            in_command = false;
                        }else{
                            result = result+'`;'+stack[i]+'str+=`';
                            in_command = true;
                        }
                        break;
                    case '$':
                        if(in_variable){
                            result += '}';
                            in_variable=false;
                        }else{
                            i++;
                            result += '${'+stack[i];
                            in_variable=true;
                        }
                        break;
                }
            }
            i++;
        }
        result += '`';
        return eval(result)
    }
}
