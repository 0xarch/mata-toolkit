const DefaultErrMsg=["程序运行正常。","脚本运行错误！","输入的数值有误！","服务器异常！","数据不存在！"];
const MResultType={ Ok:Symbol(1) , Err:Symbol(2) };
const MOk = MResultType.Ok,MErr= MResultType.Err;
const MataPalette={
    "RED":[0,88],"PINK":[330,92],"PURPLE":[285,80],"DEEPPURPLE":[262,52],
    "INDIGO":[231,48],"BLUE":[207,100],"LIGHTBLUE":[199,98],"CYAN":[187,100],
    "TEAL":[155,62],"GREEN":[122,39],"LIGHTGREEN":[88,62],"LIME":[66,70],
    "YELLOW":[54,87],"AMBER":[45,100],"ORANGE":[36,100],"DEEPORANGE":[14,100]
};
const GetActive=(element)=>{return element.attributes.active.nodeValue=="true"?true:false},
Select=(query)=>document.querySelector(query),
SelectAll=(query)=>document.querySelectorAll(query),
Toggle=(element)=>element.setAttribute('active',GetActive(element)?false:true),
ToggleForce=(element,bool)=>element.setAttribute('active',bool),
newElement=(tag)=>document.createElement(tag),
removeElement=(query)=>document.querySelector(query).remove();

const HSLUtilties={
    /**
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
const DatetimeUtilites={
    /**
     * if the year is leap year
     * @param { number } year 
     * @returns { true|false }
     */
    testLeap(year){
        if(year%100!=0)
            if(year%4==0) return true
            else return false
        else
            if(year%400==0) return true
            else return false
    },
    /**
     * the count of day of the month
     * @param { string | number } month 
     * @param { string| number } year to test leap year
     * @returns { 31|30|29|28 }
     */
    dayCountOf(month,year){
        month=parseInt(month);
        if([1,3,5,7,8,10,12].includes(month)) return 31
        else if(month==2)
            if(this.testLeap(parseInt(year)))
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
    firstDayOf(month,year){
        return new Date(`${year}-${month}-1`);
    },
    /**
     * 
     * @param { string } string an date string
     * @returns { {year:string, month:string, day:string} } object(JSON)
     * @example stringToObject('2023-06-17')
     */
    stringToObject(string){
        return { 
            year:string.slice(0,4),
            month:string.slice(5,7),
            day:string.slice(8,10)
        };
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
        let label = newElement("label");
        let children = father.querySelectorAll("mconbox>content");
        let switchbox = newElement("fbox");
        if(father==null || children==null )
            return new MResult(MErr,4);
        for(let item of children){
            let text = item.getAttribute("name");
            /*
             * Beslect is a new widget used by switcher
             */
            let bselect = newElement("bselect");
            bselect.textContent=text;
            bselect.setAttribute('father',id); // To let the function know what to change
            bselect.setAttribute('active',false);
            bselect.onclick=function(){
                for(let item of SelectAll(`#${id}>mconbox>content`))
                    item.style.display='none';
                Select(`#${this.getAttribute('father')}>mconbox>content[name="${this.textContent}"]`).style.display='block';
                for (let item of SelectAll(`#${id}>label>fbox>bselect`))
                    item.setAttribute("active","false");
                this.setAttribute("active",true);
            }
            switchbox.appendChild(bselect);
        }
        if(father.getAttribute("label")!=undefined){
            let _label = newElement("textlabel");
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
        let config = /[#\w]+/.exec(element.textContent);
        console.log(config,element.textContent);
        let f_id = '#'+config[0].replace('#','');
        let f = Select(f_id);
        let i_father = element.parentNode;
        element.remove();
        i_father.innerHTML=f.innerHTML;
    },
    Calendar(id){
        id = id.replace('#','');
        let element = Select('#'+id);
        let config = element.textContent;
        element.textContent='';

        // Parse Config
        config = JSON.parse(config);
        let day_conf = config['config']==undefined?{}:config['config'];

        // Read date
          let date = new Date();
          let year = (config['year']!=undefined&&config['year']!="this")?config['year']:date.getFullYear();
          let month = (config['month']!=undefined&&config['month']!="this")?config['month']:date.getMonth()+1;
          month=month[1]==undefined?'0'+month:month;
        
        let _conf_clickevent=config['clickevent'];
        let conf_clickevent={};
        for(let i in _conf_clickevent){
            let di;
            if(i[0]=='$')di=i.replace('$',`${year}-${month}-`);
            else di=i;
            conf_clickevent[di]=_conf_clickevent[i];
        }

        // Element Creating
        let main_label = newElement('label');
        let fbox = newElement('fbox');
          let left_arrow = newElement('arrow');
          let right_arrow = newElement('arrow');
          left_arrow.setAttribute('towards','left');
          right_arrow.setAttribute('towards','right');
          let month_label = newElement('textlabel');
          fbox.appendChild(left_arrow);
          fbox.appendChild(month_label);
          fbox.appendChild(right_arrow);
        let day_label = newElement('fbox');
        day_label.setAttribute('FullWidth','');
        for(let item of ['日','一','二','三','四','五','六']){
            let _day_label = newElement('textlabel');
            _day_label.textContent=item;
            day_label.appendChild(_day_label);
        }
        main_label.appendChild(fbox);
        main_label.appendChild(day_label);

        let main_box = newElement('calendarbox');
        main_box.setAttribute('year',year);
        main_box.setAttribute('month',month);

        // Day Action
        /**
         * 
         * @param { string } year 
         * @param { string } month 
         * @param { number } day 
         * @param { object } day_conf_selected 
         * @returns 
         */
        let test_day=function(year,month,day,day_conf_selected){
            month = parseInt(month);
            if(day_conf_selected['each']!=undefined){
                let e_dc=day_conf_selected['each'];
                if(e_dc['each']!=undefined){
                    let e_dd=e_dc['each'];
                    if(e_dd.includes!=undefined){
                        if(e_dd.includes(day))
                            return true
                    }else for(let item in e_dd){
                        if(item==day)
                            return [true,e_dd[item]];
                    }
                }
                if(e_dc[month]!=undefined){
                    let e_dd=e_dc[month];
                    if(e_dd.includes!=undefined){
                        if(e_dd.includes(day))
                            return true
                    }else for(let item in e_dd){
                        if(item==day)
                            return [true,e_dd[item]];
                    }
                }
            }
            if(day_conf_selected[year]!=undefined){
                let e_dc=day_conf_selected[year];
                if(e_dc['each']!=undefined){
                    let e_dd=e_dc['each'];
                    if(e_dd.includes!=undefined){
                        if(e_dd.includes(day))
                            return true
                    }else for(let item in e_dd){
                        if(item==day)
                            return [true,e_dd[item]];
                    }
                }
                if(e_dc[month]!=undefined){
                    let e_dd=e_dc[month];
                    if(e_dd.includes!=undefined){
                        if(e_dd.includes(day))
                            return true
                    }else for(let item in e_dd){
                        if(item==day)
                            return [true,e_dd[item]];
                    }
                }
            }
            return false
        }
        let refresh_calendarbox=function(){
            let month = main_box.getAttribute('month'),
            year = main_box.getAttribute('year');
            month = month[1]==undefined?'0'+month:month;
            // Firstday Blank
            let first_day = DatetimeUtilites.firstDayOf(month,year).getDay();
            if(first_day!=0)
                for(var i=0;i<first_day;i++)
                    main_box.appendChild(document.createElement('dayblank'));
            month_label.textContent=year+'年'+month+'月';

            let day_count=DatetimeUtilites.dayCountOf(month,year);
            for(var i=1;i<=day_count;i++){
                let day_action = document.createElement('dayaction');
                day_action.textContent=i;
                for(let item in conf_clickevent){
                    if(item==year+'-'+month+'-'+i){
                        day_action.setAttribute('daytag','clickevent');
                        day_action.onclick=function(){eval(conf_clickevent[item])};
                        break;
                    }
                }
                if(test_day(year,month,i,day_conf['mark']))
                    day_action.setAttribute('marked',true)
                let hover = test_day(year,month,i,day_conf['hover']);
                  if(hover[0]){
                    day_action.setAttribute('hovered',true);
                    day_action.setAttribute('title',hover[1]);
                  }
                main_box.appendChild(day_action);
            }
        }
        left_arrow.onclick=function(){
            main_box.innerHTML='';
            let month = eval(main_box.getAttribute('month')),year=eval(main_box.getAttribute('year'));
            if(month==1){month=12,year-=1}
            else month-=1;
            main_box.setAttribute('month',month);
            main_box.setAttribute('year',year);
            refresh_calendarbox();
        }
        right_arrow.onclick=function(){
            main_box.innerHTML='';
            let month = eval(main_box.getAttribute('month')),year=eval(main_box.getAttribute('year'));
            if(month==12){month=1,year+=1}
            else month+=1;
            main_box.setAttribute('month',month);
            main_box.setAttribute('year',year);
            refresh_calendarbox();
        }
        refresh_calendarbox();
        
        // Final Process
        element.appendChild(main_label);
        element.appendChild(main_box);
    },
    Definition:{
        c_eq_v(){
            for(let item of document.querySelectorAll("*[c-eq-v]")){
                item.textContent=item.getAttribute("value");
            }
        }
    }
}