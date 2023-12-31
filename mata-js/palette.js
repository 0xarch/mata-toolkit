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
     * @example let palette_processer = new PaletteController(MataPalette)
     */
    constructor(palettesJson) {
        this.palettes = palettesJson;
        this.colns = {};
        matchMedia('(prefers-color-scheme:dark)').onchange = () => {
            for (let item in this.colns) {
                this.setPaletteByHSL(item, this.colns[item]);
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
        if (document.body.classList.contains("MA-dark")) {
            v1 = v1.dl(-18), v2 = v2.dl(-18), v3 = v3.dl(-17);
        }
        this.#Root.setStyle(`--${name}-color-1`, v1.CSS());
        this.#Root.setStyle(`--${name}-color-2`, v2.CSS());
        this.#Root.setStyle(`--${name}-color-3`, v3.CSS());
        this.#Root.setStyle(`--${name}-text-1`, v1.textColor());
        this.#Root.setStyle(`--${name}-text-2`, v2.textColor());
        this.#Root.setStyle(`--${name}-text-3`, v3.textColor());

        this.colns["background"]=document.body.classList.contains("MA-dark")?v2.ds(-45).dl(-20):v2.ds(10).dl(40);
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


(function(){
    const jColor = {
        getTextColor: (r,g,b) =>{
            let gray = r * 3 + g * 6 + b + 5;
            if (gray > 1200) return "#000"
            else return "#FFF"
        },
        jHSLtoRGB(jhsl){
            return this.HSLtoRGB(jhsl.h,jhsl.s,jhsl.l);
        },
        HSLtoRGB(H,s,l, textmode = false) {
            let S = s / 100,
                L = l / 100;
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
            return {h:H,s:S,l:L};
        }
    }

    var jHSL = function(h,s,l){
        this.h = parseInt(h);
        this.s = parseInt(s);
        this.l = parseInt(l);
        this.ds = (s)=>{
            let _s = this.s + s;
            _s = _s > 100 ?100 :_s;
            _s = _s <0 ?0 :_s;
            return new jHSL(this.h,_s,this.l);
        }
        this.dl = (l)=>{
            let _l = this.l + l;
            _l = _l > 100 ?100 :_l;
            _l = _l <0 ?0 :_l;
            return new jHSL(this.h,this.s,_l);
        }
        this.css = () => `hsl(${this.h},${this.s}%,${this.l}%)`;
        this.toRGB = () => jColor.jHSLtoRGB(this);
    }

    var setPalette = (paletteName,paletteColor,colorLight) => {
        let name = paletteName;
        let root = jMata('body');
        let hue = parseInt(paletteColor[0]), saturation = parseInt(paletteColor[1]), lightness = parseInt(colorLight) /10;
        // let color_medium = {h:hue,s:saturation,l:lightness};
        // let color_darker = {h:hue,s:saturation,l:lightness-15};
        // let color_lighter = {h:hue,s:saturation,l:lightness+12};

        let color_medium = new jHSL(hue,saturation,lightness);
        let color_darker = color_medium.dl(-15);
        let color_lighter = color_medium.dl(12);

        const _hsl2css = (hsl)=>`hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`

        if (document.body.classList.contains("MA-dark")) {
            color_lighter.l -= 17;
            color_medium.l -= 18;
            color_darker.l -= 18;
        }
        root.css(`--${name}-color-1`, color_darker.css());
        root.css(`--${name}-color-2`, color_medium.css());
        root.css(`--${name}-color-3`, color_lighter.css());
        root.css(`--${name}-text-1`, jColor.getTextColor(color_darker.toRGB()));
        root.css(`--${name}-text-2`, jColor.getTextColor(color_medium.toRGB()));
        root.css(`--${name}-text-3`, jColor.getTextColor(color_lighter.toRGB()));

        // let bg_hsl = {h:paletteColor[0],s: saturation+10,l:lightness+40};
        let bg_hsl = color_medium.ds(10).dl(40);
        if(jMata('body').hasClass('MA-dark')){
            bg_hsl = color_medium.ds(-45).dl(-20);
        }
        root.css(`--${name}-background`,bg_hsl.css());
    }

    const SVGs = {
        Grid:`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="grid" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 72C0 49.9 17.9 32 40 32H88c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V72zM0 232c0-22.1 17.9-40 40-40H88c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V232zM128 392v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V392c0-22.1 17.9-40 40-40H88c22.1 0 40 17.9 40 40zM160 72c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V72zM288 232v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V232c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40zM160 392c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V392zM448 72v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V72c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40zM320 232c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V232zM448 392v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V392c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40z"></path></svg>`,
        Label:`<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>`,
        Sun:`<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"></path></svg>`,
        Moon:`<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"></path></svg>`,

    }

    window.jMata.SVGs = SVGs;
    window.jMata.setPalette = setPalette;
    window.jMata.color = jColor;

})( window );