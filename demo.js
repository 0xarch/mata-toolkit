const Palette=new MPaletteProcesser(MataPalette);

Palette.setPaletteFrom("primary","TEAL",500);
Palette.setPaletteFrom("secondary","RED",450);

function e_toggleSlide(element){
    Toggle(element);
    ToggleForce(Select('#slide'),GetActive(element));
}

window.onload=()=>{
    MInitSet.Switcher("switch_demo");
    MInitSet.Switcher("switch_test");
    MInitSet.Definition.c_eq_v();
}