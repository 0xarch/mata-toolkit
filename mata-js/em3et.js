const Em3et={
    /**
     * @param { element } element
     * @param { string } type
     */
    render(element,type){
        let stack = this.AST(element.innerHTML);
        let parsed_text = this.Compile(stack);
        if(type=='plain') element.textContent=parsed_text;
        else element.innerHTML=parsed_text;
    },
    /**
    *
    * @param { string } raw_string
    * @returns { Array }
    */
    AST(raw_string){
        let quo = false;
        let stack = [];
        let raw_chars = raw_string.split("");
        let i = 0,len = raw_chars.length;
        while(i<len){
            let _char_now = raw_chars[i];
            if(/[A-Za-z]/.test(_char_now)){
                let _str = _char_now;
                i++;
                while(i<len){
                    let __char_now = raw_chars[i];
                    if(/[A-Za-z ]/.test(__char_now)){
                        _str = _str+__char_now;
                        i++;
                    }else{
                        stack.push(_str);
                        i--;
                        break;
                    }
                }
            }else
            if(['(',':','%','*','"',"'"].includes(_char_now)){
                if(!['"',"'"].includes(_char_now)) stack.push(_char_now);
                let _str = "";
                let _end_char = _char_now!='('?_char_now:')';
                i++;
                while(i<len){
                    let __char_now = raw_chars[i];
                    if(__char_now!=_end_char){
                        if(__char_now!='\\'){
                            _str += __char_now;
                        }else{
                            _str += raw_chars[++i];
                        }
                        i++;
                    }else{
                        stack.push(_str);
                        break;
                    }
                }
            }else
            if(_char_now==','){
                if(quo){
                    stack.push('}');
                    quo=false;
                }else{
                    stack.push('{');
                    quo=true;
                }
            }else
            if(!/[ \n]/.test(_char_now)) stack.push(_char_now);
            i++;
        }
        return stack
    },
    /**
    *
    * @param { Array } stack
    * @returns { String }
    */
    Compile(stack){
        let result = new String;
        let i=0,len = stack.length;
        let element_stack = new Array;
        result = 'let str = new String; str+=`';
        let in_command = false, in_variable = false;
        while(i<len){
            let text = stack[i];
            if(/[A-Za-z]+/.test(text)){
                result = result+'<'+text;
                element_stack.push(text);
            }else{
                switch(text){
                    case '{':
                    case '[':
                        result +='>';
                        break;
                    case '}':
                    case ']':
                        result = `${result}</${element_stack.pop()}>`;
                        break;
                    case '!':
                    case '/':
                        element_stack.pop();
                        result += '/>';
                        break;
                    case ':':
                        i++;
                        result = result+stack[i];
                        break;
                    case '(':
                        i++;
                        result = result+' '+stack[i];
                        break;
                    case '#':
                        i++;
                        result = `${result} id="${stack[i]}"`;
                        break;
                    case '.':
                        i++;
                        result = `${result} class="${stack[i]}"`;
                        break;
                    case '%':
                        i++;
                        if(in_command){
                            result += '`'+stack[i]+';str+=`';
                            in_command = false;
                        }else{
                            result = result+'`;'+stack[i]+'str+=`';
                            in_command = true;
                        }
                        break;
                    case '$':
                        if(in_variable){
                            result += '}';
                            in_variable=false;
                        }else{
                            i++;
                            result += '${'+stack[i];
                            in_variable=true;
                        }
                        break;
                }
            }
            i++;
        }
        result += '`';
        return eval(result)
    }
}
