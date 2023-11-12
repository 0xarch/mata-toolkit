function renderImageRoller(ImageRoller){
    let Imgs = ImageRoller.querySelectorAll("img");
    let len = Imgs.length;
    ImageRoller.setAttribute("i",0);
    ImageRoller.setAttribute("stopped","0");
    setInterval(()=>{
        if(ImageRoller.getAttribute("stopped")=="1") return;
        let i = parseInt(ImageRoller.getAttribute("i"));
        if(i<len){
            try{
                for(let I=0;I<len;I++){
                    if(I==i){
                        Imgs[I].style.display = "inline-block";
                        Imgs[I].style.left="0px";
                    }else if(I+1==i){
                        // 在 i 的左面
                        Imgs[I].style.display = "inline-block";
                        Imgs[I].style.left="-100%";
                    }else if(I-1==i || I+1==len){
                        // 在 i 的右面
                        Imgs[I].style.display = "inline-block";
                        Imgs[I].style.left="100%";
                    }else{
                        Imgs[I].style.display = "none";
                    }
                }
            }catch(e){
                console.error(e);
            }
            i++;
            if(i==len) i=0;
        }else{
            i=0;
        }
        ImageRoller.setAttribute("i",i);
    },parseInt(ImageRoller.getAttribute("time")));
}

function toggleRollingImage(ImageRoller,force){
    if(ImageRoller.getAttribute("stopped")=="0" || force){
        ImageRoller.setAttribute("stopped","1");
    }else{
        ImageRoller.setAttribute("stopped","0");
    }
}