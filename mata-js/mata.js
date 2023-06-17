const DefaultErrMsg=["程序运行正常。","脚本运行错误！","输入的数值有误！","服务器异常！","数据不存在！"];
const MResultType={ Ok:Symbol(1) , Err:Symbol(2) };
const MOk = MResultType.Ok,MErr= MResultType.Err;
const MataPalette={
    "RED":[0,88],"PINK":[330,92],"PURPLE":[285,80],"DEEPPURPLE":[262,52],
    "INDIGO":[231,48],"BLUE":[207,100],"LIGHTBLUE":[199,98],"CYAN":[187,100],
    "TEAL":[155,62],"GREEN":[122,39],"LIGHTGREEN":[88,62],"LIME":[66,70],
    "YELLOW":[54,87],"AMBER":[45,100],"ORANGE":[36,100],"DEEPORANGE":[14,100]
};
let GetActive=(element)=>{return element.attributes.active.nodeValue=="true"?true:false},
Select=(query)=>document.querySelector(query),
SelectAll=(query)=>document.querySelectorAll(query),
Toggle=(element)=>element.attributes.active.nodeValue=GetActive(element)?false:true,
ToggleForce=(element,bool)=>element.attributes.active.nodeValue=bool;

const HSLUtilties={
    /**
     * 
     * @param { HSL } hsl the specfic HSL color
     * @param { bool} textmode if uses text output (CSS format)
     * @returns { {r:number,g:number,b:number}|string }
     */
    HSLtoRGB(hsl,textmode=false){
        let H=hsl.h,S=hsl.s/100,L=hsl.l/100;
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
        else return { r:R, g:G, b:B };
    }
}
class HSL{
    h;s;l;
    constructor(h,s,l){
        this.h=h!=undefined?h:0;
        this.s=s!=undefined?s:0;
        this.l=l!=undefined?l:0;
    }
    dh(dh){
        let h = this.h+dh;
        if (h<0) h=0;
        else if (h>360) h=360; 
        return new HSL(h,this.s,this.l);
    }
    ds(ds){
        let s = this.s+ds;
        if (s<0) s=0;
        else if (s>100) s=100; 
        return new HSL(this.h,s,this.l);
    }
    dl(dl){
        let l = this.l+dl;
        if (l<0) l=0;
        else if (l>100) l=100; 
        return new HSL(this.h,this.s,l);
    }
    CSS=()=>`hsl(${this.h},${this.s}%,${this.l}%)`;
    textColor(){
        let rgb=HSLUtilties.HSLtoRGB(this);
        let gray = rgb.r*3+rgb.g*6+rgb.b+5;
        if(gray>1200) return "#000"
        else return "#FFF"
    }
}
class MResult{
    result;errcode;#msg;
    constructor(result,errcode){
        if(result==MOk){
            this.result=MOk;
            this.errcode=new Number(0);
        }else{
            this.result=MErr;
            this.errcode=new Number(errcode);
        }
    }
    extract(){
        return this.#msg;
    }
    match(err_arr){
        for(let item in err_arr){
            if(item==this.errcode){
                this.#msg=err_arr[item];
                break;
            }
        }
    }
    is_ok(){
        return this.result===MOk;
    }
    is_err(){
        return this.result===MErr;
    }
    unwrap_err(){
        this.match(DefaultErrMsg);
        return this.#msg!=undefined?this.#msg:this.err;
    }
    release(){
        delete this;
    }
}
class MDElement{
    element;
    constructor(query){
        this.element=Select(query);
    }
    setStyle(key,val){
        this.element.style.setProperty(key,val);
    }
    
    getAttribute(string){
        return this.element.attributes[string].nodeValue;
    }
    isActived(){
        return GetActive(this.element);
    }
    release(){
        delete this;
    }
    remove(){
        this.element.remove();
        delete this;
    }
}
class MPaletteProcesser{
    palettes;
    colns;
    /**
     * initialize a palette processer from specific color palettes
     * @param { Object } palettesJson
     * @example let palette_processer = new MPaletteProcesser(MataPalette)
     */
    constructor(palettesJson){
        this.palettes=palettesJson;
        this.colns={};
    }
    #Root=new MDElement(":root");
    /**
     * macro! set the primary palette from specific color & light
     * @param { string } col 
     * @param { number} light 
     * @returns { MResult }
     */
    setPrimary(col,light){
        if(this.palettes[col]==undefined)
            return new MResult(MErr,3);
        else {
            this.setPaletteByHSL("primary",new HSL(this.palettes[col][0],this.palettes[col][1],light/10));
            return new MResult(MOk);
        }
    }
    /**
     * macro! set the seconday palette from specific color & light
     * @param { string } col secondary color
     * @param { number} light secondary light
     * @returns { MResult }
     */
    setSecondary(col,light){
        if(this.palettes[col]==undefined)return new MResult(MErr,3);
        else {
            this.setPaletteByHSL("secondary",new HSL(this.palettes[col][0],this.palettes[col][1],light/10));
            return new MResult(MOk);
        }
    }
    /**
     * macro! set the primary & seconday palette from specific color & light
     * @param { string } colPr primary color
     * @param { number} lightPr primary light
     * @param { string } colSc secondary color
     * @param { number} lightSc secondary light
     * @returns { MResult }
     */
    setSP(colPr,lightPr,colSc,lightSc){
        let r1=this.setPrimary(colPr,lightPr);
        let r2=this.setSecondary(colSc,lightSc);
        if(r1.is_ok() && r2.is_ok()) return new MResult(MOk);
        else return new MResult(MErr);
    }
    /**
     * set the specific palette from a HSLColor
     * @param { string} name 
     * @param { HSL } hsl 
     * @returns { void }
     * @example setPaletteByHSL("primary",new HSL(0,0,0))
     */
    setPaletteByHSL(name,hsl){
        this.colns[name]=hsl!=undefined?hsl:this.colns[name];
        let v2=this.colns[name];
        let v1=v2.dl(-15),v3=v2.dl(12);
        this.#Root.setStyle(`--${name}-color-1`,v1.CSS());
        this.#Root.setStyle(`--${name}-color-2`,v2.CSS());
        this.#Root.setStyle(`--${name}-color-3`,v3.CSS());
        this.#Root.setStyle(`--${name}-text-1`,v1.textColor());
        this.#Root.setStyle(`--${name}-text-2`,v2.textColor());
        this.#Root.setStyle(`--${name}-text-3`,v3.textColor());
        return new MResult(MOk);
    }
    /**
     * set the specific palette from palette in 
     * @param { string } name the name of palette (e.g. "primary" )
     * @param { string } color the name of color (e.g. "RED" )
     * @param { number } light the light of color (e.g. 550 )
     * @returns { MResult }
     */
    setPaletteFrom(name,color,light){
        if(this.palettes[color]==undefined)
            return new MResult(MErr,3);
        else {
            this.colns[name]=new HSL(this.palettes[color][0],this.palettes[color][1],light/10);
            return this.setPaletteByHSL(name); 
        }
    }
    release(){
        delete this;
    }
}
const MInitSet={
    /**
     * init switcher ( functions, children... )
     * @param { string } id the switcher's id
     */
    Switcher(id){
        id = id.replace('#',''); // remove the character
        let father = Select(`#${id}`);
        let label = document.createElement("label");
        let children = father.querySelectorAll("mconbox>content");
        let switchbox = document.createElement("fbox");
        if(father==null || children==null )
            return new MResult(MErr,4);
        for(let item of children){
            let text = item.getAttribute("name");
            /*
             * Beslect is a new widget used by switcher
             */
            let bselect = document.createElement("bselect");
            bselect.textContent=text;
            bselect.setAttribute('father',id); // To let the function know what to change
            bselect.setAttribute('active',false);
            bselect.onclick=function(){
                for(let item of document.querySelectorAll(`#${id}>mconbox>content`))
                    item.style.display='none';
                document.querySelector(`#${this.getAttribute('father')}>mconbox>content[name="${this.textContent}"]`).style.display='block';
                for (let item of document.querySelectorAll(`#${id}>label>fbox>bselect`))
                    item.setAttribute("active","false");
                this.setAttribute("active",true);
            }
            switchbox.appendChild(bselect);
        }
        if(father.getAttribute("label")!=undefined){
            let _label = document.createElement("textlabel");
            _label.textContent=father.getAttribute("label");
            label.appendChild(_label);
        }
        label.appendChild(switchbox);
        switchbox.firstChild.click(); // show the first content
        father.appendChild(label);
        return new MResult(MOk);
    },
    Inheritor(id){
        id = id.replace('#','');
        let element = Select('#'+id);
        let f_id = '#'+element.getAttribute('fromid');
        let f = document.querySelector(f_id);
        let i_father = element.parentNode;
        i_father.innerHTML+=f.innerHTML;
        element.remove();
    },
    Definition:{
        c_eq_v(){
            for(let item of document.querySelectorAll("*[c-eq-v]")){
                item.textContent=item.getAttribute("value");
            }
        }
    }
}