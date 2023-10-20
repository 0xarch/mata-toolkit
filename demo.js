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
            WidgetConstructor.Calendar("calendar_demo").unwrap();
        })
    });
    WidgetConstructor.Calendar("calendar_today").unwrap();
    WidgetConstructor.ActionTitle();
    WidgetConstructor.Wind();
    buildTabs("tabs_demo");
    buildTabsJSON("tabs_json_demo");
    buildCollapse("collapse_demo");
    Em3et.render(Select("em3et"),"plain");
}
