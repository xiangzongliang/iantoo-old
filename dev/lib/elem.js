module.exports = (element,type) => {
	let DOM = document.createElement(element);
	if(type){
		for(let key in type){
			DOM.setAttribute(key,type[key])
		}
	}
	return DOM
}