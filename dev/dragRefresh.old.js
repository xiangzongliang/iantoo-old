import "../less/dragRefresh.less"

import elem from './lib/elem'
// import IA from './lib/InertiaAlgorithm'
// import VConsole from 'vconsole/dist/vconsole.min.js' //import vconsole
// let vConsole = new VConsole() // 初始化


;(function (win,undefined) {


	var iantoo = win.iantoo || {},
		_dom;

	var D = {
			//初始化
			init: function (opction) {
				this.data.el = opction.el || 'body'
				this.data.content = opction.content || ' '
				this.data.downRefresh = opction.downRefresh || function(){}
				this.data.upRefresh = opction.upRefresh || function(){}
				this.data.closeDown = opction.closeDown || function(){}
				this.data.closeUp = opction.closeUp || function(){}
				this.data.downDragText = opction.downDragText || '刷新中...'
				this.data.upDragText = opction.upDragText || '数据加载中...'
				this.data.downTextColor = opction.downTextColor || '#9c9c9c'
				this.data.upTextColor = opction.upTextColor || '#9c9c9c'


				//在IOS下面需要在最外层组织冒泡，否则依然会出现webview的上下拉事件
				// document.addEventListener('touchmove',()=>{
				// 	event.stopPropagation(); //停止事件传播
				// 	event.preventDefault();  //组织冒泡
				// },false);

				this.render()
			},
			data:{
				el:'',
				content:'',
				isdownRefresh:false,		//是否触发了下拉刷新
				isUpRefresh:false,			//是否触发了上拉加载
				downRefresh:'',				//触发下拉刷新的回调
				upRefresh:'',				//触发上拉加载的回调
				closeDown:'',				//关闭下拉刷新的回调
				closeUp:'',					//关闭上拉加载的回调
				downDragText:'',			//下拉刷新的文字内容
				upDragText:'',				//上拉加载的文字内容

				downTextColor:'',    //下拉刷新的文字颜色        默认 #828282
				upTextColor:'',      //上拉加载的文字颜色    默认 #828282
			},
			dom:{
				topDom:'', 		//顶部下拉下来的DOM
				bottomDom:'',
				dargDom:'',
				dargBox:'',
				topSpan:'',
				bottomSpan:'',
				loadingImgtop:'',
				loadingImgbot:'',
				TIFAdom:'',
			},







			//渲染
			render(){
				let topDom = elem.dom('div',{class:'iantooTopRefreshDom'}),
					bottomDom = elem.dom('div',{class:'iantooBottomRefreshDom'}),
					loadingImgtop = elem.dom('i',{class:'iantooRefreshLoadingimg'}),
					loadingImgbot = elem.dom('i',{class:'iantooRefreshLoadingimg'}),
					topLoadingText = elem.dom('span'),
					bottomLoadingText = elem.dom('span')

				
					this.dom.dargBox = document.querySelector(this.data.el)
					this.dom.dargDom = document.querySelector(this.data.content)
					this.dom.TIFAdom = document.querySelector('div')


					if(!this.dom.dargDom){
						console.error('页面中没有找到DOM元素`content`')
						return
					}




					////下拉刷新
					this.dom.dargBox.appendChild(topDom)
					topDom.appendChild(loadingImgtop)
					topDom.appendChild(topLoadingText)
					topLoadingText.innerText = this.data.downDragText
					topLoadingText.style.color = this.data.downTextColor




					///上拉加载
					this.dom.dargBox.appendChild(bottomDom)
					bottomDom.appendChild(loadingImgbot)
					bottomDom.appendChild(bottomLoadingText)
					bottomLoadingText.innerText = this.data.upDragText
					bottomLoadingText.style.color = this.data.upTextColor



					




					if(!this.dom.dargBox){
						console.error('页面中没有找到最外层盒子,案例中的id = dragRefresh')
						return
					}


					
				
				//将dom存入对象中
				this.dom.topDom = topDom
				this.dom.bottomDom = bottomDom
				this.dom.topSpan = topLoadingText
				this.dom.bottomSpan = bottomLoadingText
				this.dom.loadingImgtop = loadingImgtop
				this.dom.loadingImgbot = loadingImgbot



				//初始化核心方法
				this.dargFun.init()
			},



			//核心方法 ,不要随意提取对象出来,否则会造成卡顿现象
			dargFun : {
				dargDom:null, //惯性滑动的DOM区域
				startX:0, //开始偏移的X
				startY:0, //开始偏移的Y
				clientX:0, 
				clientY:0,
				translateX:0, //保存的X偏移
				translateY:0, //保存的Y偏移
				contentH:0,		//内容区域的高度
				boxH:0,			//盒子的高度
				// startTime:0, //记录初始按下时间
				init:function(config){

					this.dargDom = D.dom.dargDom,

					
					this.dargDom.addEventListener('touchstart',(event)=>{
						event.stopPropagation(); //停止事件传播
						this.clientX = event.changedTouches[0].clientX;
						this.clientY = event.changedTouches[0].clientY;

						//每次点击的时候重新去获取内容区域的高度,避免异步数据回来新增了长度
						this.contentH = this.dargDom.clientHeight;
						this.boxH = D.dom.dargBox.clientHeight;


						
		
						this.dargDom.style.WebkitTransition = this.dargDom.style.transition = '';
						this.startX = this.translateX;
						this.startY = this.translateY;



						//在按下的时候设置文字内容,必须是关闭状态才能重新触发文字修改
						if(D.data.isdownRefresh === false){
							D.dom.topSpan.innerText = '继续下拉刷新'
							D.dom.loadingImgtop.style.display = 'none'
						}
						if(D.data.isUpRefresh === false){
							D.dom.loadingImgbot.style.display = 'none'
							//如果内容太短不显示任何上拉加载的内容
							if(this.contentH >= this.boxH){
								D.dom.bottomSpan.innerText = '继续上拉加载更多'
							}else{
								D.dom.bottomSpan.innerText = ''
							}
						}
						
					},false);






					
					this.dargDom.addEventListener('touchmove',(event)=>{
						let scrollTop = document.querySelector('div').scrollTop || document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

		
					
						event.stopPropagation(); //停止事件传播
						//event.preventDefault();  //组织冒泡
						

						this.translateY = event.changedTouches[0].clientY - this.clientY + this.startY;
		
						if(this.translateY > 0 ){ //拖动系数. 拉力的感觉
							this.translateY *= 0.4 ;
						}else if( this.translateY < -(this.dargDom.scrollHeight - this.dargDom.clientHeight)){ 
							this.translateY = (event.changedTouches[0].clientY - this.clientY) * 0.4 + this.startY;
						}


						//判断是否触发了下拉刷新
						if(scrollTop <= 0){
							let downMoveHeight = this.translateY > 60 ? 60 : this.translateY;
							D.dom.topDom.style.top = downMoveHeight - 60 +'px'

							this.animate(this.translateY);

							//如果刷新状态关闭且下拉距离超过了60px
							if(D.data.isdownRefresh === false && this.translateY > 60){
							

								//触发下拉刷新的时候自动关闭上拉加载
								D.dom.bottomDom.style.bottom = '-60px'
								D.data.isUpRefresh = false
								//重制自身状态和样式
								D.data.isdownRefresh = true
								D.dom.topSpan.innerText = D.data.downDragText
								D.dom.loadingImgtop.style.display = 'inline-block'
								//开始回调
								D.data.downRefresh()
							}

						}else{

							//如果滚动距离超过了底部的距离,预备触发上拉加载

							if(scrollTop >= (this.contentH - this.boxH)){
								this.animate(this.translateY);

								//上拉加载状态关闭的时候默认跟着往上拉
								if(D.data.isUpRefresh === false){ 
									D.dom.bottomDom.style.bottom =-1* (60- (this.translateY*-1)) + 'px'
									//只有辣的距离超过60之后才会触发上拉加载事件，//如果页面的内容区域小于整个屏幕的高度将永远不会触发下拉加载的功能
									if(this.translateY < -60 && this.contentH >= this.boxH){
		
		
										//触发上拉之后会自动关闭下拉
										D.dom.topDom.style.top = '-60px'
										D.data.isdownRefresh = false
										
										
										//重制自身状态和样式
										D.data.isUpRefresh = true
										D.dom.bottomSpan.innerText = D.data.upDragText
										D.dom.loadingImgbot.style.display = 'inline-block'
										D.dom.TIFAdom.scrollTop = D.dom.TIFAdom.scrollTop + 60
		
										D.data.upRefresh()
		
									}
								}
							}
						}
					
						
					},false);







					
					this.dargDom.addEventListener('touchend',(event)=>{
						event.stopPropagation(); //停止事件传播
				
						this.translateY  = 0;
						// 添加贝塞尔曲线
						this.dargDom.style.WebkitTransition = this.dargDom.style.transition = 'transform 500ms cubic-bezier(0.1, 0.57, 0.1, 1)';
						
						if(D.data.isdownRefresh === true){//如果触发了下拉刷新,则保留一部分上方的控件，不收回，显示加载的内容
							this.animate(60);
						}else if(D.data.isUpRefresh === true){//如果触发了是上拉加载，则在底部保留一部分
							this.animate(-60);

						}else{
							this.animate(this.translateY);
						}

					},false);
					
				},
				animate:function(y){
					this.dargDom.style.WebkitTransform = this.dargDom.style.transform = 'translateY('+y+'px)';
				}
			},
			//设置CSS
			setCss:{
				topStyle(opction){
					return `
					top:${opction.top}px;
					transition: all ${opction.time}s ease-in;
					-webkit-transition: all ${opction.time}s ease-in;`
				},
				bottomStyle(opction){
					return `
					bottom:${opction.bottom}px;
					transition: all ${opction.time}s ease-in;
					-webkit-transition: all ${opction.time}s ease-in;`
				}
			}
	},
	E = {
		//关闭下拉刷新
		closeDown(state){
			//关闭的时候修改加载文字
			if(state == true){
				D.dom.topSpan.innerText = '加载成功'
			}else{
				D.dom.topSpan.innerText = '加载失败'
			}

			
			D.dom.topDom.setAttribute('style',D.setCss.topStyle({top:-60,time:0.3}))
			setTimeout(function(){
				D.dom.topDom.setAttribute('style',D.setCss.topStyle({top:-60,time:0}))
			},200)
			// D.dom.topDom.style.top = '-50px'
			
			D.data.isdownRefresh = false
			D.dom.dargDom.style.WebkitTransform = D.dom.dargDom.style.transform = 'translateY(0px)';
			//回调方法
			D.data.closeDown()
		},

		//关闭上拉加载
		closeUp(state){
			//关闭的时候修改加载文字
			if(state == true){
				D.dom.bottomSpan.innerText = '加载成功'
			}else{
				D.dom.bottomSpan.innerText = '加载失败'
			}
			D.dom.bottomDom.setAttribute('style',D.setCss.bottomStyle({bottom:-60,time:0.3}))
			setTimeout(function(){
				D.dom.bottomDom.setAttribute('style',D.setCss.bottomStyle({bottom:-60,time:0}))
			},200)

			D.data.isUpRefresh = false
			D.dom.dargDom.style.WebkitTransform = D.dom.dargDom.style.transform = 'translateY(0px)';
			//回调方法
			D.data.closeUp()
		},
		
		//关闭所有的加载刷新
		close(state){
			E.closeDown(state)
			E.closeUp(state)

		},

		//通过该方法异步更新页面的信息
		updata(opction){
				//重新初始化数据
			let downDragText = opction.downDragText || D.data.downDragText,
				upDragText = opction.upDragText || D.data.upDragText,
				downTextColor = opction.downTextColor || D.data.downTextColor,
				upTextColor = opction.upTextColor || D.data.upTextColor;
			


				//更新数据
			D.dom.topSpan.innerText = downDragText //更新后的下拉刷新文字...
			D.dom.bottomSpan.innerText = upDragText //更新上拉加载的文字...
			D.dom.topSpan.style.color = downTextColor
			D.dom.bottomSpan.style.color = upTextColor


		}
	}

	//------------------------------------------------//
	iantoo.dragRefresh = (opction) => {
		return new D.init(opction)
	}
	iantoo.dragRefresh.__proto__ = E
	D.init.prototype = D
	win.iantoo = iantoo
})(window)