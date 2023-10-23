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