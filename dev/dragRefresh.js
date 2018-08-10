/*!
* 	基于手机端的下拉刷新+上拉加载组件
*	author:xiangzongliang
*	time:20180810
*	version:V1.0.0
*	github:https://github.com/xiangzongliang/iantoo-old	
*/




import "../less/dragRefresh.less"
import elem from './lib/elem.js'
;(function (win,undefined) {


	var iantoo = win.iantoo || {},
		_dom;

	var D = {
			//初始化
			init: function (opction) {
				this.data.content = opction.content || 'body'
				this.data.loadingBox = opction.loadingBox || '#dragRefreshLoading'
				this.data.downDragText = opction.downDragText || '页面刷新中...'
				this.data.upDragText = opction.upDragText || '数据加载中...'
				this.data.downTextColor = opction.downTextColor || '#9c9c9c'
				this.data.upTextColor = opction.upTextColor || '#9c9c9c'
				this.data.downRefresh = opction.downRefresh || function(){}
				this.data.upRefresh = opction.upRefresh || function(){}
				this.data.closeDown = opction.closeDown || function(){}
				this.data.closeUp = opction.closeUp || function(){}

				this.render()
			},	
			data:{
				content:'',			//内容显示的主题区域
				loadingBox:'',		//loading的盒子
				downDragText:'',	//下拉刷新的文字
				upDragText:'',		//上拉加载的文字
				downTextColor:'',	//下拉刷新的文字颜色
				upTextColor:'',		//上拉加载的文字颜色


				downRefresh:'',		//下拉刷新的回调方法
				upRefresh:'',		//上拉加载的回调方法
				closeDown:'',		//关闭了下拉刷新回调
				closeUp:'',			//关闭了上拉加载回调


				isDown:false,		//是否触发了下拉刷新
				isUp:false,			//是否触发了上拉加载

				isIdenDown:true,	//用于判断没有触发下拉刷新的时候下拉的跳屏现象
				isIdenUp:true,		//同上
			},
			dom:{
				iantooDragRefresh:'',	//最外层的下拉刷新框
				iantooTopLoading:'',	//顶部的loading盒子
				dragContent:'',			//用户自定义内容区域
				loadingBox:'',			//加载的盒子
				iantooBottomLoading:'',	//底部loading 盒子

				topImg:'',				//顶部的loading图片
				bottomImg:'',			//底部的loading图片
				topSpan:'',				//顶部的文字
				bottomSpan:'',				//底部的文字
			},

			//渲染
			render(){
				this.dom.iantooDragRefresh = document.querySelector('#iantooDragRefresh')
				this.dom.dragContent = document.querySelector(this.data.content)
				this.dom.loadingBox = document.querySelector(this.data.loadingBox)

				this.dom.iantooTopLoading = elem.dom('div',{id:'iantooTopLoading'})
				this.dom.iantooBottomLoading = elem.dom('div',{id:'iantooBottomLoading'})



				this.dom.topImg = elem.dom('i')
				this.dom.topSpan = elem.dom('span')
				this.dom.bottomImg = elem.dom('i')
				this.dom.bottomSpan = elem.dom('span')


				//设置文字和样式
				this.dom.topSpan.innerText = this.data.downDragText
				this.dom.bottomSpan.innerText = this.data.upDragText
				this.dom.topSpan.style.color = this.data.downTextColor
				this.dom.bottomSpan.style.color = this.data.upTextColor


				this.dom.iantooTopLoading.appendChild(this.dom.topImg)
				this.dom.iantooTopLoading.appendChild(this.dom.topSpan)
				this.dom.iantooBottomLoading.appendChild(this.dom.bottomImg)
				this.dom.iantooBottomLoading.appendChild(this.dom.bottomSpan)

				// this.dom.iantooDragRefresh.appendChild(this.dom.iantooBottomLoading)
				// this.dom.iantooDragRefresh.insertBefore(this.dom.iantooTopLoading,this.dom.dragContent)

				this.dom.loadingBox.appendChild(this.dom.iantooTopLoading)
				this.dom.loadingBox.appendChild(this.dom.iantooBottomLoading)

				this.event()

				
			},
			event(){

				let C_obj = {
					dargDom:null, //惯性滑动的DOM区域
					startX:0, //开始偏移的X
					startY:0, //开始偏移的Y
					clientX:0, 
					clientY:0,
					translateX:0, //保存的X偏移
					translateY:0, //保存的Y偏移
					contentH:0,		//内容区域的高度
					contentScrollHeight:0,
					boxH:0,			//盒子的高度
					animate(y){
						
					}

				}

				this.dom.dragContent.addEventListener('touchstart',(event)=>{
					event.stopPropagation(); //停止事件传播
					C_obj.clientX = event.changedTouches[0].clientX;
					C_obj.clientY = event.changedTouches[0].clientY;
					//每次点击的时候重新去获取内容区域的高度,避免异步数据回来新增了长度
					C_obj.contentH = this.dom.dragContent.clientHeight;
					C_obj.boxH = window.screen.availHeight || window.screen.height;
					C_obj.contentScrollHeight = this.dom.dragContent.scrollHeight;


					this.dom.dragContent.style.WebkitTransition = this.dom.dragContent.style.transition = '';
					C_obj.startX = C_obj.translateX;
					C_obj.startY = C_obj.translateY;




					//处理跳屏现象
					this.data.isIdenDown = this.data.isDown === true ? true : false
					this.data.isIdenUp = this.data.isUp === true ? true : false
					



					//初始化loading模块的样式
					if(this.data.isDown !== true){
						this.dom.iantooTopLoading.setAttribute('style',`top:-60px;transition: all 0s ease-out`)
					}
					

					if(this.data.isUp !== true){
						this.dom.iantooBottomLoading.setAttribute('style',`bottom:-60px;transition: all 0s ease-out`)
					}

				},false)







				this.dom.dragContent.addEventListener('touchmove',(event)=>{
					event.stopPropagation(); //停止事件传播

					//此处是定制化的写法,建议使用第二句
					let scrollTop = document.querySelector('div').scrollTop || document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
					// let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;


					C_obj.translateX = event.changedTouches[0].clientX - C_obj.clientX + C_obj.startX;
					C_obj.translateY = event.changedTouches[0].clientY - C_obj.clientY + C_obj.startY;




					if(C_obj.translateY > 0 ){ //拖动系数. 拉力的感觉
						C_obj.translateY *= 0.4 ;
					}else if( C_obj.translateY < -(C_obj.contentScrollHeight - this.dom.dragContent.clientHeight)){ 
						C_obj.translateY = (event.changedTouches[0].clientY - C_obj.clientY) * 0.4 + C_obj.startY;
					}




					//如果已经处于没有被下拉刷新状态
					if(this.data.isDown === false){
						if(C_obj.translateY <= 60){
							this.dom.iantooTopLoading.style.top = C_obj.translateY - 60 +'px'
							this.dom.topSpan.innerText = '继续下拉刷新页面'
							this.dom.topImg.style.display = 'none'
						}else{
							this.data.isDown = true
							this.dom.iantooTopLoading.style.top = '0px'

							//修改提示文字与图标样式
							this.dom.topSpan.innerText = this.data.downDragText
							this.dom.topImg.style.display = 'inline-block'


							//触发了下拉刷新的回调
							this.data.downRefresh()
						}
						
					//如果已经处于没有被上拉加载的状态
					}
					
					
					if(this.data.isUp === false){
						//页面必须有滚动的时候才能触发上拉加载
						if(C_obj.contentH >= C_obj.boxH){
							//如果已经拉到底部了
							if(scrollTop >= (C_obj.contentH - C_obj.boxH)){
								this.dom.bottomSpan.innerText = '继续上拉加载更多'
								this.dom.bottomImg.style.display = 'none'
								//设置底部loading的高度的同时也设置滚动条的位置，
								this.dom.iantooBottomLoading.style.bottom = -60 - C_obj.translateY +'px'
								if(C_obj.translateY < -60){ //触发了上拉加载
									this.data.isUp = true
									this.dom.iantooBottomLoading.style.bottom = '0px'

									//重新设置底部加载文字和图标样式
									this.dom.bottomSpan.innerText = this.data.upDragText
									this.dom.bottomImg.style.display = 'inline-block'


									//触发了上拉加载的回调
									this.data.upRefresh()
								}
							}
						}
						
					}




					if(this.data.isDown === true && this.data.isIdenDown === true){
						this.animate(60 + C_obj.translateY);
					}else if(this.data.isUp === true && this.data.isIdenUp === true){
						this.animate(-60 + C_obj.translateY);
					}else{
						this.animate(C_obj.translateY);
					}
				},false)






				this.dom.dragContent.addEventListener('touchend',(event)=>{
					event.stopPropagation(); //停止事件传播
					C_obj.translateY = 0;

					this.dom.dragContent.style.WebkitTransition = this.dom.dragContent.style.transition = 'transform 500ms cubic-bezier(0.1, 0.57, 0.1, 1)';


					//如果没有触发了下拉刷新
					if(this.data.isDown === true){
						D.animate(60);
					}else if(this.data.isUp === true){
						D.animate(-60);
					}else{
						this.dom.iantooTopLoading.setAttribute('style',`top:-60px;transition: all 0.2s ease-out`)
						this.dom.iantooBottomLoading.setAttribute('style',`bottom:-60px;transition: all 0.2s ease-out`)
						D.animate(0);
					}
				},false)

			},
			animate(y){
				D.dom.dragContent.style.WebkitTransform = D.dom.dragContent.style.transform = 'translateY('+y+'px)';
			}
			
	},
	E = {
		closeDown(opction){
			if(opction == true){
				D.dom.topSpan.innerText = '刷新成功'
			}else{
				D.dom.topSpan.innerText = '刷新失败'
			}
			D.dom.iantooTopLoading.setAttribute('style',`top:-60px;transition: all 0.3s ease-out`)
			D.animate(0)
			D.data.isDown = false
			//触发关闭下拉刷新
			D.data.closeDown()
		},
		closeUp(opction){
			if(opction == true){
				D.dom.bottomSpan.innerText = '加载成功'
			}else{
				D.dom.bottomSpan.innerText = '加载失败'
			}
			D.dom.iantooBottomLoading.setAttribute('style',`bottom:-60px;transition: all 0.3s ease-out`)
			D.animate(0)
			D.data.isUp = false
			//触发上拉加载的回调
			D.data.closeUp()
		},
		updata(opction){
			D.data.downDragText = opction.downDragText || D.data.downDragText
			D.data.upDragText = opction.upDragText || D.data.upDragText
			D.data.downTextColor = opction.downTextColor || D.data.downTextColor
			D.data.upTextColor = opction.upTextColor || D.data.upTextColor

			D.dom.topSpan.innerText = D.data.downDragText
			D.dom.topSpan.style.color = D.data.downTextColor
			D.dom.bottomSpan.innerText = D.data.upDragText
			D.dom.bottomSpan.style.color = D.data.upTextColor
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