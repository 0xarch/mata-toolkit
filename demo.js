const Palette=new PaletteController(MataPalette);

Palette.setPaletteFrom("primary","TEAL",500,true);
Palette.setPaletteFrom("secondary","RED",450);

function e_toggleSlide(element){
    Toggle(element);
    ToggleForce(Select('#slide'),GetActive(element));
}

window.onload=()=>{
    fetch("demo.json").then(data=>{
        data.text().then(data=>{
            data = JSON.parse(data);
            Select("#calendar_demo").innerHTML=JSON.stringify(data['calendar_demo']);
            // WidgetConstructor.Calendar("calendar_demo").unwrap();
            renderAllCalendar();
        })
    });
    // WidgetConstructor.Calendar("calendar_today").unwrap();
    WidgetConstructor.ActionTitle();
    buildTabs("tabs_demo");
    buildTabsJSON("tabs_json_demo");
    buildPaginationJSON("pagination_demo");
    Em3et.render(Select("em3et"),"plain");
    let tabs_json = [
        {
            "tab":"文本",
            "content":"在纯文本或少量标签时使用JSON配置的Tabs分页"
        },
        {
            "tab":"标签",
            "content":"<h1>标签</h1>"
        }
    ];
    let Collapse = new CollapseComponent([{"header":"折叠面板","content":"<h3>折叠面板</h3>","open":false}]).renderHTMLElement();
    ReplaceAnchorWith("demo_coll_anc",Collapse);
    renderAllCollapse();
    ReplaceAnchorWith("anchor1",new TabsComponent(tabs_json,"JSON Tab").render());
}
