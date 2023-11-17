function renderButton(Button){
    let F = Button.getAttribute("F").split(" ");
    switch(F[0]){
        case "callDrop":
            let Drop = Button.querySelector("drop");
            Drop.style.display = "none";
            Button.onclick = function(){
                // Button.querySelector("drop").style.display="block";
                jMata.from(Button).select('drop').css('display','block');
            };
            // jMata.select("body").addEventListener("click",function(e){
            jMata('body').event("click",function(e){
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
            let Nav = jMata(F[1]);
            let CoverElement = jMata.new('div');
            let Cover = jMata.from(CoverElement);
            Cover.addClass("M3tk-A-darkAll");
            document.body.appendChild(CoverElement);
            Button.onclick = function(){
                Nav.css('left','0px');
                Cover.css('display','block').css('background','rgba(0,0,0,.25)');
            }
            Cover.onclick = function(){
                Nav.css('left',"calc(-30*var(--g-unit))");
                Cover.css('background','transparent');
                setTimeout(()=>{
                    Cover.css('display','none');
                },500);
            }
            ___Inner(Button,F[2],F[3]);
            break;
        case "changeDayNight":
            if(matchMedia('(prefers-color-scheme:light)').matches) Button.innerHTML = jMata.SVGs['Sun'];
            else Button.innerHTML = jMata.SVGs['Moon'];
            Button.addEventListener("click",function(){
                if(document.querySelector("body.MA-light")){
                    Button.innerHTML = jMata.SVGs['Moon'];
                    $.toggleLD(false);
                }else{
                    Button.innerHTML = jMata.SVGs['Sun'];
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
            return jMata.SVGs[content];
        case "i":
            return `<i class="${content.split(",").join(" ")}"></i>`;
        case "text":
            return `<p>${content}</p>`;
    }
}

function ___Inner(elem,ty,content){
    switch(ty){
        case "svg":
            elem.innerHTML = jMata.SVGs[content];
            break;
        case "i":
            elem.appendChild(jMata.new("i",content.split(",")));
            break;
        case "text":
            elem.innerHTML = content;
            break;
    }
}

function renderToolbar(Toolbar){
    for(let item of Toolbar.querySelectorAll(":is(lbtn,rbtn)")){
        renderButton(item);
    }
}