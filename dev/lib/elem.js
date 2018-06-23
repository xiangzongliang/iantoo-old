module.exports = {

	dom(element,type){
		let DOM = document.createElement(element);
		if(type){
			for(let key in type){
				DOM.setAttribute(key,type[key])
			}
		}
		return DOM
	},


	// 添加类
	addClass(element,newclass){
        if(element.className){
            var oldClass=element.className;
            element.className=oldClass+" "+newclass;
        }else{
            element.className=newclass;
        }
    },



    removeClass(element, a_class){
        var obj_class = ' '+element.className+' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
        obj_class = obj_class.replace(/(\s+)/gi, ' ');//将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
        var removed = obj_class.replace(' '+a_class+' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
        removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
        if(removed){
            element.className = removed;//替换原来的 class.
        }else{
            element.removeAttribute('class')
        }  
    }
}
	