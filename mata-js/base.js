 const MResultType = {
    Ok: Symbol(1),
    Err: Symbol(2)
};
const MOk = MResultType.Ok,
    MErr = MResultType.Err;
const GetActive = (element) => {
        return element.getAttribute('active') == "true" ? true : false
    },
    Select = (query) => document.querySelector(query),
    SelectAll = (query) => document.querySelectorAll(query),
    Toggle = (element) => element.setAttribute('active', element.getAttribute('active') == "true" ? false : true),
    ToggleForce = (element, bool) => element.setAttribute('active', bool),
    newElement = (tag) => document.createElement(tag),
    removeElement = (query) => document.querySelector(query).remove();
const Exist = (_var) => _var != null;

const ColorUtilties = {
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
        return _MatchMediaDark.matches;
    }
}
const DatetimeUtilites = {
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
     * @param { string | number } month
     * @param { string| number } year to test leap year
     * @returns { 31|30|29|28 }
     */
    dayCountOf(month, year) {
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
     * @param { string|number } month
     * @param { string|number } year
     * @returns { Date }
     */
    firstDayOf(month, year) {
        return new Date(`${year}-${month}-1`);
    },
    /**
     *
     * @param { string } string an date string
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

class MResult {
    result;
    errcode;
    #msg;
    constructor(result, errcode) {
        if (result == MOk) {
            this.result = MOk;
            this.errcode = new Number(0);
        } else {
            this.result = MErr;
            this.errcode = new Number(errcode);
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
        this.result = MOk
    }
    toErr(errcode) {
        this.result = MErr;
        this.errcode = errcode
    }
    testOk() {
        return this.result === MOk
    }
    testErr() {
        return this.result === MErr
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

class MDElement {
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
