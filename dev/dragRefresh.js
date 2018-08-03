import "../less/dragRefresh.less"

import elem from './lib/elem'
import IA from './lib/InertiaAlgorithm'
import VConsole from 'vconsole/dist/vconsole.min.js' //import vconsole
let vConsole = new VConsole() // 初始化


;(function (win,undefined) {


	var iantoo = win.iantoo || {},
		_dom;

	var D = {
			//初始化
			init: function (opction) {
				this.data.el = opction.el || 'body'
				this.data.content = opction.content || ' '



				this.render()
			},



			//数据存储
			data:{
				el:'',   //页面所有的内容都必须包含在这个标签之下
				content:'',		//用于承载页面内容的区域



				//关于页面的一些信息
				pageInfo:{
					contentH:'', 		//主体内容区域的高度 content
					contentW:'',		//主体内容区域的宽度 content
					pageH:'',			//页面显示区域的高度
					pageW:'',			//页面显示区域的宽度
					top:0,				//当前滚动离顶部的距离
				},
				touch:{  //touch相关信息
					X:'',		//点击的坐标X
					Y:'',		//点击的坐标Y
					moveX:'',	//横着移动的距离
					moveY:'',	//竖着移动的距离
					twoTrigger:false,		//用于控制二次点击
				},
				moveArr:[0,0,0]
			},


			dom:{
				topDom:'',  		//从顶部向下拉之后的dom
				bottomDom:'',		//从底部向上拉的dom
				selectDom:''		//页面所有的内容包裹容器
			},




			//渲染
			render(){
				let topDom = elem.dom('div',{class:'iantooTopDom'}),
					bottomDom = elem.dom('div',{class:'iantooBottomDom'}),
					selectDom =	document.querySelector(this.data.content)


					if(!selectDom){
						console.error('页面中没有找到DOM元素`content`')
						return
					}
				
				//将dom存入对象中
				this.dom.topDom = topDom
				this.dom.bottomDom = bottomDom
				this.dom.selectDom = selectDom




				this.event()
			},




			//touch事件处理
			touchstartFun(t){
				console.log(11)

				this.data.touch.twoTrigger = false
				this.data.touch.X = t.changedTouches[0].clientX
				this.data.touch.Y = t.changedTouches[0].clientY
			},
			touchmoveFun(t){

				//记录每次滑动的最后三次位移
				this.data.moveArr.pop()
				this.data.moveArr.unshift(t.changedTouches[0].clientY)

				let touchX = this.data.touch.X,
					touchY = this.data.touch.Y,
					top = this.data.pageInfo.top,
					clientX = t.changedTouches[0].clientX,
					clientY = t.changedTouches[0].clientY,
					that = this

				
					this.dom.selectDom.setAttribute(`style`,that.transformFun({
						coordinate:`Y`,					//坐标
						distance:clientY - touchY + top,		//距离
						time:0,						//时间
						effect:`ease-in`				//效果
					}))


			},
			touchendFun(t){
				console.log('chufale end时间')
				this.data.touch.twoTrigger = true
				console.log(this.data.moveArr)
				this.data.moveArr = [0,0,0]
				console.log('end+'+t.changedTouches[0].clientY)
				let touchX = this.data.touch.X,
					touchY = this.data.touch.Y,
					top = this.data.pageInfo.top,
					clientX = t.changedTouches[0].clientX,
					clientY = t.changedTouches[0].clientY,
					that = this
				
				//向下拉动松开之后
				if((clientY-touchY)>=0){ //如果是下拉刷新活滚动

					if((clientY-touchY) > (-1*top)){ //下拉刷新
						that.dom.selectDom.setAttribute(`style`,that.transformFun({
							coordinate:`Y`,					//坐标
							distance:0,		//距离
							time:0.3,						//时间
							effect:`ease-out`				//效果
						}))
						that.data.pageInfo.top = 0
	
						setTimeout(()=>{
							that.dom.selectDom.setAttribute(`style`,that.transformFun({
								coordinate:`Y`,					//坐标
								distance:0,		//距离
								time:0,						//时间
								effect:`ease-out`				//效果
							}))
						},300)
					}else{ //下拉滚动
						that.data.pageInfo.top = (clientY - touchY) + top
					}
					


				}else{ //向上滚动
					
					//每次下拉重新获取内容的高度,避免异步数据加载
					let selectDomHeight = that.dom.selectDom.offsetHeight,
						pageHeight = document.querySelector('#dragRefresh').offsetHeight || window.screen.availHeight || window.screen.height,
						contentTop = clientY-touchY+top+(-1*pageHeight) 	//最顶部距离屏幕顶部的距离
					that.data.pageInfo.contentH = selectDomHeight


					if(contentTop < (-1*selectDomHeight)){ //上拉加载

						//设置回滚
						that.dom.selectDom.setAttribute(`style`,that.transformFun({
							coordinate:`Y`,					//坐标
							distance:-1*(selectDomHeight - pageHeight),		//距离
							time:0.3,						//时间
							effect:`ease-out`				//效果
						}))

						//重置top值
						that.data.pageInfo.top = -1*(selectDomHeight - pageHeight)
					}else{
						that.data.pageInfo.top = (clientY - touchY) + top
					}
				}
			},


			transformFun(opction){
				let callbackData = `transform:translate${opction.coordinate}(${opction.distance}px);
				-webkit-transform:translate${opction.coordinate}(${opction.distance}px);
				transition: all ${opction.time}s ${opction.effect};
				-webkit-transition: all ${opction.time}s ${opction.effect};`
				return callbackData	
			},







			//事件监听
			event(){
				this.dom.selectDom.addEventListener('touchstart',(e)=>{
					this.touchstartFun(e)
					e.stopPropagation()
				})
				this.dom.selectDom.addEventListener('touchmove',(e)=>{
					// console.log(e.changedTouches[0].clientY)
					this.touchmoveFun(e)
				})
				this.dom.selectDom.addEventListener('touchend',(e)=>{
					// console.log('end+'+e.changedTouches[0].clientY)
					this.touchendFun(e)
				})
			}
		}

	//------------------------------------------------//
	iantoo.dragRefresh = (opction) => {
		return new D.init(opction)
	}
	// iantoo.percent.__proto__ = E
	D.init.prototype = D
	win.iantoo = iantoo
})(window)