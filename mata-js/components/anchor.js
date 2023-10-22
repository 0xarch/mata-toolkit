/**
 * 
 * @param { string } anchor 
 * @param { HTMLElement } element 
 * @param { ?string } side 
 */
function InsertAtAnchor(anchor,element,side){
    let Anchor = Select(`anchor[anchor="${anchor}"`);
    let parent = Anchor.parentNode;
    if(side=="after"){
        if(parent.lastChild == Anchor)
            parent.appendChild(element);
        else{
            parent.insertBefore(element,Anchor.nextSibling);
        }
    }else{
        parent.insertBefore(element,Anchor);
    }
}

/**
 * 
 * @param { string } anchor 
 * @param { HTMLElement|string } element 
 */
function ReplaceAnchorWith(anchor,element){
    InsertAtAnchor(anchor,element,"after");
    Select(`anchor[anchor="${anchor}"]`).remove();
}