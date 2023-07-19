const Palette=new MPaletteProcesser(MataPalette);

Palette.setPaletteFrom("primary","TEAL",500);
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
            MInitSet.Calendar("calendar_demo").unwrap();
            Select("#switch_json").innerHTML=JSON.stringify(data['switch_json']);
            MInitSet.SwitcherJSON("switch_json").unwrap();
        })
    });
    MInitSet.Inheritor("inherit_demo");
    MInitSet.Switcher("switch_demo").unwrap();
    MInitSet.Switcher("switch_test").unwrap();
}
