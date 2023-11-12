const ResultType = {
    Ok: Symbol(1),
    Err: Symbol(2)
};
const _DOMParser = new DOMParser();
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
 * @param { Array.<string> } CSSclass
 * @param { string|Array.<HTMLElement> } innerHTML
 * @param { {} } attributes
 * @returns HTMLElement
 */
function newElement(tag,CSSclass,innerHTML,attributes){
    let element = document.createElement(tag);
    if(CSSclass!=undefined){
        element.classList.add(...CSSclass);
    }
    if(innerHTML!=undefined){
        if(typeof(innerHTML)!="object")
            element.innerHTML=innerHTML;
        else if(Array.isArray(innerHTML)){
            for(let item of innerHTML){
                element.append(item);
            }
        }
    }
    for(let item in attributes){
        element.setAttribute(item,attributes[item]);
    }
    return element;
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

const $ = {
    userAgent: navigator.userAgent,
    isMobile(){
        for(let keyword of ["Android","iPhone","iPad"]){
            if(this.userAgent.includes(keyword))
                return true
        }
        return false
    },
    getPlatform(){
        for(let keyword of ["Android","iPhone","iPad","Linux","Windows","Mac OS X"]){
            if(this.userAgent.includes(keyword))
                return keyword
        }
    },
    /**
     * 
     * @param { string } tag 
     * @param { string } id
     * @param { Array.<string> } CSSclass
     * @param { string|Array.<HTMLElement> } innerHTML
     * @param { {} } attributes
     * @returns {HTMLElement}
     */
    createElement(tag,id,CSSclass,innerHTML,attributes){
        let element = document.createElement(tag);
        if(id){
            element.id = id;
        }
        if(CSSclass){
            element.classList.add(...CSSclass);
        }
        if(innerHTML!=undefined){
            if(typeof(innerHTML)!="object")
                element.innerHTML=innerHTML;
            else if(Array.isArray(innerHTML)){
                for(let item of innerHTML){
                    element.append(item);
                }
            }
        }
        for(let item in attributes){
            element.setAttribute(item,attributes[item]);
        }
        return element;
    },
    parseString(str){
        return str.replace(/ /,"_")
    },
    loadAll(hascontent){
        if($.isMobile()){
            Select("body").classList.add("mobile");
        }
        renderAllCalendar();
        renderToolbar(Select("uiheader>toolbar"));
        evalCSS();
        if(hascontent) generateContent(Select(".M3tk-ContentBox"),Select(".M3tk-R-Content"));
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
        if (r1.testOk() && r2.testOk()) return new Result(Ok);
        else return new Result(Err);
    }
    /**
     * set the specific palette from a HSLColor
     * @param { string } name
     * @param { HSL } hsl
     * @returns { void }
     * @example setPaletteByHSL("primary",new HSL(0,0,0),true)
     */
    setPaletteByHSL(name, hsl) {
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

        this.colns["background"]=ColorUtils.BrowserIsDark()?v2.ds(-45).dl(-20):v2.ds(10).dl(40);
        this.#Root.setStyle(`--${name}-background`,this.colns["background"].CSS());
        this.bgcoln=name;
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


const SVGs = {
    Grid:`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="grid" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M0 72C0 49.9 17.9 32 40 32H88c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V72zM0 232c0-22.1 17.9-40 40-40H88c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V232zM128 392v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V392c0-22.1 17.9-40 40-40H88c22.1 0 40 17.9 40 40zM160 72c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V72zM288 232v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V232c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40zM160 392c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V392zM448 72v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V72c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40zM320 232c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V232zM448 392v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V392c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40z"></path></svg>`,
    Label:`<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>`,
}

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
}

/**
 * 
 * @param { HTMLElement } from 
 * @param { HTMLElement } to 
 */
function generateContent(from,to){
    for(let item of from.querySelectorAll(":is(h1,h2,h3,h4,h5,h6)")){
        let ID = $.parseString(item.textContent);
        let NavAnchor = document.createElement("a");
        NavAnchor.href="#M3tk-EA-"+ID;
        NavAnchor.textContent = item.textContent;
        NavAnchor.classList.add("M3tk-LC_"+item.tagName,"M-textDeco_none");
        // item.id = ID;
        item.classList.add("M3tk-M");
        item.parentNode.insertBefore(newElement("fake",["M3tk-E-Anchor"],'',{"id":"M3tk-EA-"+ID}),item);
        to.appendChild(NavAnchor);
    }
}