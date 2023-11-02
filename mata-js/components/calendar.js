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
    // let daysConfig = !config['config'] ? {} : config['config'];

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
    let DayLabel = newElement("Label",["days"]);
    let LeftArrow = newElement("Button",["left"],"<"),
        RightArrow = newElement("Button",["right"],">");
    let ArrowLabel = newElement("Label",["arrows"],[LeftArrow,RightArrow]);
    let YearEntry = newElement("select",["year_select"]);
    let MonthEntry = newElement("select",["month_select"]);

    // Re-generate YearEntry and MonthEntry
    function _MLocal_RefreshYM(y){
        for(let i=y-10;y-10<=i,i<y+10;i++){
            let Option = newElement("Option",[],i+"年",{"value":i});
            YearEntry.appendChild(Option);
        }
        for(let i=1;i<=12;i++){
            let Option = newElement("Option",[],i+"月",{"value":i});
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
        if(config[f]!=undefined)
            if(config[f][y]!=undefined
            && config[f][y][m]!=undefined
            && config[f][y][m][d]!=undefined)
                return config[f][y][m][d]
            else if(config[f]["EachYear"]!=undefined
                 && config[f]["EachYear"][m]!=undefined
                 && config[f]["EachYear"][m][d]!=undefined)
                    return config[f]["EachYear"][m][d]
            else return false
        else return false
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
        }catch(e){ ret = false }
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
        if (day_conf['showtoday']) {
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
            if (day_conf['showtoday'] || config["ShowToday"]==true) {
                if (today_year == year && today_month == Container.getAttribute('month') && today_date == i) {
                    day_action.classList.add("hasText");
                    day_action.appendChild(newElement("tx",[],"今天"));
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
