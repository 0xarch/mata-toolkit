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
    createElementT(tag,innerHTML){
        let element = document.createElement(tag);
        if(typeof(innerHTML)!="object")
            element.innerHTML=innerHTML;
        else if(Array.isArray(innerHTML)){
            for(let item of innerHTML){
                element.append(item);
            }
        }
        return element
    },
    createElementC(tag,CSSclass){
        let element = document.createElement(tag);
        element.classList.add(...CSSclass);
        return element
    },
    createElementCT(tag,CSSclass,innerHTML){
        let element = document.createElement(tag);
        if(typeof(innerHTML)!="object")
            element.innerHTML=innerHTML;
        else if(Array.isArray(innerHTML)){
            for(let item of innerHTML){
                element.append(item);
            }
        }
        element.classList.add(...CSSclass);
        return element
    },
    parseString(str){
        return str.replace(/ /,"_")
    },
    toggleLD(force){
        let judge = false;
        if(force!=undefined){
            judge = force;
        }else{
            judge = matchMedia('(prefers-color-scheme:light)').matches;
        }
        if(judge == true){
            jMata('body').roaClass('MA-dark','MA-light');
        }else{
            jMata('body').roaClass('MA-light','MA-dark');
        }
    },
    loadAll(hascontent){
        if($.isMobile()){
            document.body.classList.add("mobile");
        }
        renderAllCalendar();
        // renderToolbar(Select("uiheader>toolbar"));
        evalCSS();
        $.toggleLD();
        if(hascontent) generateContent(Select(".M3tk-ContentBox"),Select(".M3tk-R-Content"));
        matchMedia('(prefers-color-scheme:dark)').onchange = () => {
            $.toggleLD();
        };
    }
};

(function(window,undefined){

    function _local_appendTextOrChildsToElement(element,innerHTML){
        if(typeof(innerHTML)!="object")
            element.innerHTML=innerHTML;
        else if(Array.isArray(innerHTML)){
            for(let item of innerHTML){
                element.append(item);
            }
        }
    }

    function _local_JudgeReturnsByNodeList(nodeList){
        if(nodeList.length == 1){
            return new jMataSingleElement(nodeList[0]);
        }else{
            return new jMataBase(nodeList);
        }
    }
    
    function _local_JudgeReturnsByQuery(query,element){
        let selected = undefined;
        if(element != undefined){
            selected = element.querySelectorAll(query);
        }else{
            selected = document.querySelectorAll(query);
        }
        return _local_JudgeReturnsByNodeList(selected);
    }

    var jMata = (selector) => {
        if(selector != undefined){
            return _local_JudgeReturnsByQuery(selector);
        }else{
            return window.jMata;
        }
    };

    var jFrom = (element) => {
        return new jMataSingleElement(element);
    }

    var macros = {
        element: (tag)=> document.createElement(tag),
        elementC: function(tag,classes){
            return jCreateElement(tag).class(classes).finish();
        },
        elementT: function(tag,innerHTML){
            return jCreateElement(tag).inner(innerHTML).finish();
        },
        elementCT: function(tag,classes,innerHTML){
            return jCreateElement(tag).class(classes).inner(innerHTML).finish();
        },
        elementU : function(tag,id,CSSclass,innerHTML,attributes){
            let element = document.createElement(tag);
            if(id != undefined){
                element.id = id;
            }
            if(CSSclass != undefined){
                element.classList.add(...CSSclass);
            }
            if(innerHTML != undefined){
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
    }

    function jCreateElement(tag){
        this.tag = tag;
        this.CSSclass = [];
        this.attributes = {};
        this.fns = {};
        this.contentType = undefined;
        this.content = undefined;

        this.class = function(...classes){
            this.CSSclass = classes;
            return this;
        }

        this.inner = function(innerHTML){
            this.content = innerHTML;
            if(typeof(innerHTML)!="object")
                this.contentType = "string";
            else if(Array.isArray(innerHTML)){
                this.contentType = "childArray";
            }
            return this;
        }

        this.id = function(id){
            this.attributes['id'] = id;
            return this;
        }

        this.fn = function(name,fn){
            this.fns[name] = fn;
            return this;
        }

        this.attr = function(attr,val){
            this.attributes[attr] = val;
            return this;
        }

        this.finish = function(){
            let element = document.createElement(this.tag);
            if(this.CSSclass.length!=0)
                element.classList.add(...this.CSSclass);
            for(let item in this.attributes){
                element.setAttribute(item,this.attributes[item]);
            }
            for(let item in this.fns){
                element.addEventListener(item,this.fns[item]);
            }
            if(this.content != undefined){
                _local_appendTextOrChildsToElement(element,this.innerHTML);
            }
            return element;
        }
    }

    function jNewElement(){
        let arg_len = arguments.length;
        let elem = document.createElement(arguments[0]);
        switch(arg_len){
            case 4:
                _local_appendTextOrChildsToElement(elem,arguments[3]);
            case 3:
                elem.id = arguments[2];
            case 2:
                elem.classList.add(...arguments[1]);
            case 1:
            default:
                return elem;
        }
    }

    function jSelectIterable(query){
        return document.querySelectorAll(query);
    }

    function jSelect(query){
        let queried = document.querySelectorAll(query);
        if(queried.length == 1)
            return queried[0];
        else return queried;
    }

    function jMataBase(provided_elements){
        this.elements = [];
        this.current = -1;

        if(provided_elements != undefined){
            this.elements = provided_elements;
        }

        this.each_or_current = (fn) => {
            if(this.current == -1){
                this.elements.forEach(fn);
            }else{
                fn(this.elements[this.current]);
            }
        }

        this.select = (index)=> new jMataSingleElement(this.elements[index]);
        
        this.$ = function(selector){
            let elements = document.querySelectorAll(selector);
            this.elements.push(...elements);
            return this;
        }

        this.css = function(attr,val){
            this.each_or_current((elem)=>{
                elem.style.setProperty(attr,val);
            });
            return this;
        }

        this.class = function(...classes){
            this.elements.forEach((element)=>{
                element.classList.add(classes);
            });
            return this;
        }

        this.removeClass = function(...classes){
            this.elements.forEach((element)=>{
                element.classList.remove(classes);
            });
            return this;
        }

        this.replaceClass = function(oldClass,newClass){
            this.elements.forEach((element)=>{
                element.classList.replace(oldClass,newClass);
            });
            return this;
        }

        this.toggleClass = function(className){
            this.elements.forEach((element)=>{
                element.classList.toggle(className);
            })
        }

        this.eq = (index) => {
            this.current = index;
            return this;
        }

        this.req = () => {
            this.current = -1;
            return this;
        }

        this.event = function(eventName,eventFn){
            this.elements.forEach((element)=>{
                element.addEventListener(eventName,eventFn);
            });
            return this;
        }
    }

    function jMataSingleElement(provided_element){
        this.element = provided_element;

        this.css = function(attr,val){
            this.element.style.setProperty(attr,val);
            return this;
        }

        this.event = function(trig,fn){
            this.element.addEventListener(trig,fn);
            return this;
        }

        this.inner = function(inner){
            if(inner != undefined){
                _local_appendTextOrChildsToElement(this.element,inner);
                return this;
            }else{
                return this.element.innerHTML;
            }
        }
        this.addClass = (...className) => {
            this.element.classList.add(...className);
            return this;
        }
        this.removeClass = (...className) => {
            this.element.classList.remove(...className);
            return this;
        }
        this.replaceClass = (oldClass,newClass) => {
            this.element.classList.replace(oldClass,newClass);
            return this;
        }
        this.hasClass = (className) =>{
            return this.element.classList.contains(className);
        }
        this.roaClass = (oldClass,newClass) => {
            if(this.hasClass(oldClass)){
                this.replaceClass(oldClass,newClass);
            }else{
                this.addClass(newClass);
            }
            return this;
        }
        this.select = (selector) => _local_JudgeReturnsByQuery(selector,this.element);
    }

    jMata['isMobile'] = () => {
        for(let keyword of ["Android","iPhone","iPad"]){
            if(this.userAgent.includes(keyword))
                return true
        }
        return false
    };
    jMata['getPlatform'] = () => {
        for(let keyword of ["Android","iPhone","iPad","Linux","Windows","Mac OS X"]){
            if(this.userAgent.includes(keyword))
                return keyword
        }
    };

    jMata['from'] = jFrom;
    jMata['macros'] = macros;
    jMata['createElement'] = jCreateElement;
    jMata['select'] = jSelect;
    jMata['select_iter'] = jSelectIterable;
    jMata['new'] = jNewElement;

    window.jMata = jMata;
    window.Mata = jMata;

    // window.jMata.macros = macros;
    // window.jMata.createElement = jCreateElement;
    // window.jMata.select = jSelect;
})( window );



