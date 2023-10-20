const MataConstruct = {
    /**
     * init switcher ( functions, children... )
     * @param {string} id the switcher's id
     * @returns { Result }
     */
    Switcher(id) {
        id = id.replace('#', ''); // remove the character
        let father = Select(`#${id}`);
        let label = newElement("label");
        let children = father.querySelectorAll("mconbox>content");
        let switchbox = newElement("fbox");
        if (!Exist(father) || !Exist(children))
            return new Result(MErr, 4);
        for (let item of children) {
            let text = item.getAttribute("name");
            let bselect = newElement("bselect");
            bselect.textContent = text;
            bselect.setAttribute('father', id); // To let the function know what to change
            bselect.setAttribute('active', false);
            bselect.onclick = function() {
                for (let item of SelectAll(`#${id}>mconbox>content`))
                    item.style.display = 'none';
                Select(`#${this.getAttribute('father')}>mconbox>content[name="${this.textContent}"]`).style.display = 'block';
                for (let item of SelectAll(`#${id}>label>fbox>bselect`))
                    item.setAttribute("active", "false");
                this.setAttribute("active", true);
            }
            switchbox.appendChild(bselect);
        }
        if (father.getAttribute("label")) {
            let _label = newElement("textlabel");
            _label.textContent = father.getAttribute("label");
            label.appendChild(_label);
        }
        label.appendChild(switchbox);
        switchbox.firstChild.click(); // show the first content
        father.appendChild(label);
        return new Result(MOk);
    },
    SwitcherJSON(id) {
        id = id.replace('#', '');
        let element = Select('#' + id);
        try {
            var config = JSON.parse(element.innerHTML);
        } catch (e) {
            return new Result(MErr, 2);
        }
        let mconbox = newElement("mconbox");
        for (let item of config) {
            let mcontent = newElement("content");
            mcontent.setAttribute("name", item.name);
            mcontent.innerHTML = '<pre>' + item.content + '</pre>';
            mconbox.appendChild(mcontent);
        }
        element.innerHTML = '';
        element.appendChild(mconbox);
        return this.Switcher(id);
    },
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
        if (!Exist(element)) return new Result(MErr, 3);
        let config = element.innerHTML;
        element.innerHTML = '';

        // Parse Config
        if(config!=''){
            try {
                config = JSON.parse(config);
            } catch (e) {
                return new Result(MErr, 3);
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
        return new Result(MOk);
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
