function renderButton(Button){
    let F = Button.getAttribute("F").split(" ");
    switch(F[0]){
        case "callDrop":
            let Drop = Button.querySelector("drop");
            Drop.style.display = "none";
            Button.onclick = function(){
                Button.querySelector("drop").style.display="block";
            };
            Select("body").addEventListener("click",function(e){
                var elem = e.target;
                if(!Button.contains(elem)){
                    Button.querySelector("drop").style.display="none";
                }
            });
            Button.innerHTML += ___getInner(F[1],F[2]);
            break;
        case "link":
            Button.onclick = function(){
                window.open(F[1]);
            };
            Button.innerHTML=___getInner(F[2],F[3]);
            break;
        case "callNav":
            let Nav = document.querySelector(F[1]);
            let Cover = document.createElement("div");
            Cover.classList.add("M3tk-A-darkAll");
            Select("body").appendChild(Cover);
            Button.onclick = function(){
                Cover.style.display = "block";
                Nav.style.left = "0px";
                Cover.style.background="rgba(0,0,0,.25)";
            }
            Cover.onclick = function(){
                Nav.style.left = "calc(-30*var(--g-unit))";
                Cover.style.background = "transparent";
                setTimeout(()=>{
                    Cover.style.display = "none";
                },500);
            }
            Button.innerHTML=___getInner(F[2],F[3]);
            break;
        case "changeDayNight":
            if(matchMedia('(prefers-color-scheme:light)').matches) Button.innerHTML = SVGs['Sun'];
            else Button.innerHTML = SVGs['Moon'];
            Button.addEventListener("click",function(){
                if(document.querySelector("body.MA-light")){
                    Button.innerHTML = SVGs['Moon'];
                    $.toggleLD(false);
                }else{
                    Button.innerHTML = SVGs['Sun'];
                    $.toggleLD(true);
                }
            });
            break;
    }
    Button.removeAttribute("F");
}

function ___getInner(ty,content){
    switch(ty){
        case "svg":
            return SVGs[content];
        case "i":
            return `<i class="${content.split(",").join(" ")}"></i>`;
        case "text":
            return `<p>${content}</p>`;
    }
}

function ___Inner(elem,ty,content){
    switch(ty){
        case "svg":
            elem.innerHTML = SVGs[content];
            break;
        case "i":
            elem.appendChild($.createElementC("i",content.split(",")));
            break;
        case "text":
            elem.innerHTML = content;
            break;
        case "svg2":
            let arr = content.split(",");
            elem.innerHTML = SVGs[arr[0]];
            elem.addEventListener("click",function(){
                if(elem.innerHTML == SVGs[arr[0]])
                    elem.innerHTML = SVGs[arr[1]]
                else
                    elem.innerHTML = SVGs[arr[0]]
            });
            break;
    }
}

function renderToolbar(Toolbar){
    for(let item of Toolbar.querySelectorAll(":is(lbtn,rbtn)")){
        renderButton(item);
    }
}