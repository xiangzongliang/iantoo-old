/*
	name : iantooWeek
	version : 0.0.1
	date : 2018-06-09
	author : xiangzongliang
	github :
	doc :
 */
import "../less/common.less"
import "../less/iantooweek.less"


;(function (win,undefined) {

	var iantoo = win.iantoo || {};


	const W = {

		//初始化
		init:function(opction) {
			var opction = opction || {}
			this.data.config.el = opction.el || 'body'
			this.data.config.date = opction.date || ''
			this.data.config.showWeek = opction.showWeek ? true : false
			this.data.config.clickDay = opction.clickDate || function () {}
			this.data.config.render = opction.render || function () {}
			this.data.config.theme.selectGB = opction.theme.selectGB || '#ff8800'
			this.data.config.theme.selectFontColor = opction.theme.selectFontColor || '#FFFFFF'
			this.data.config.theme.systemBG = opction.theme.systemBG || '#ececec'
			this.data.config.theme.systemFontColor = opction.theme.systemFontColor || '#555555'
			this.data.config.updataRender = opction.updataRender || function () {}
			this.data.config.sign = opction.sign || []
			this.data.config.touchStartFun = opction.touchStartFun || function(){}
			this.data.config.touchEndFun = opction.touchEndFun || function(){}


			this.render()
		},


		//数据存储
		data:{
			config:{
				el:'', //日历插件渲染的位置
				date : '',//指定渲染某个时间 格式 "2018-05-24" || "2000-02-22 23:19:56"
				clickDay:'', //点击某一天的时候回调方法
				showWeek:'', //是否显示星期栏
				render:'', //首次渲染结束之后调用,[0]回调当前显示的七天的星期时间,[1]回调系统对应的当前的时间
				theme:{
					selectGB:'', //当前选择的时间的颜色
					selectFontColor:'', //当前选择的时间的文字颜色,默认#ffffff
					systemBG:'', //系统对应的时间的背景色
					systemFontColor:'' //系统对应时间的文字颜色
				}, //主题颜色[0]:主题色

				sign:'', //需要被标记的时间,会在a标签中插入span标签
				updataRender:'', //每次更新渲染之后调用,回调当前显示的星期时间
				touchStartFun:'',  //当点击日历控件开始的时候出发,即‘touchstart’方法
				touchEndFun:'', //结束触摸的时候调用,即'touchend'方法 
			},
			elastic:0.3, // 弹性值,当滑动距离超过百分比之后后会发生弹性变化
			calcWeekArr:[], //页面当前显示的三个星期的数组,会随着滚动而变动
			week:['周日','周一','周二','周三','周四','周五','周六'],
			recordingTime:'',//记录的时间,默认初始化传入时间>系统时间,随着每次点击发生变化
			clickDom:'', //当前点击的那一天的DOM,首次进入是显示传入的时间,会随着下次点击发生变化
			systemDate:'', //当前系统对应的时间,首次加载设置一次，之后不会发生变化
			currentShowWeek:'',//当前显示的星期的（数组）,该数组会随着滑动而重新赋值

			arrMonth:function(year) {
				//判断是否为润年并返回当年的所有月的天数
				if((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0){
					return [31,29,31,30,31,30,31,31,30,31,30,31]  //闰年29天
				}else{
					return [31,28,31,30,31,30,31,31,30,31,30,31]  //平年28天
				}
			}, //获取某一年的所有月份的天数
			slider:{
				// X:'',
				// Y:'',
				H:'',
				W:'',
			},//记录坐标
			touch:{
				//当快速
				translateX:'',
				translateY:'',
				clientX:'', //记录当前的点击坐标X
				clientY:''
			}

		},




		//创建页面的DOM
		creatDOM:function() {
			var T = this
			return {
				iantooWeek:T.elem('div',{class:'iantooWeek'}), //整体的日历控件
				weekBar:T.elem('div',{class:'weekBar'}), //星期栏
				C_box:T.elem('div',{class:'calendarBox'}) //日历的外框
			}
		},






		//设置星期栏
		setWeek:function(dom) {
			var week = this.data.week
			for(var wi in week){
				var weekA = this.elem('a')
				weekA.innerText = week[wi]
				dom.weekBar.appendChild(weekA)
			}
		},





		//渲染日历
		setCalendar:function (dom) {
			var that = this,
				calcWeek = this.calcWeek(),     //当前显示的星期
				beforeWeek = this.beforeWeek(), //前一个星期
				afterWeek = this.afterWeek()    //后一个星期

			this.data.calcWeekArr[0] = beforeWeek
			this.data.calcWeekArr[1] = calcWeek
			this.data.calcWeekArr[2] = afterWeek



			// 得到三个星期的DOM,并插入在页面中
			var calcWeekArr = this.data.calcWeekArr
			for(var cai in calcWeekArr){
				that.renderWeek(calcWeekArr[cai],dom)
			}
		},






		//计算页面当前显示的三个星期的时间 ,初始化调用一次
		calcWeek:function () {
			var date = this.data.config.date,
				getDate = this.fmtDate(date),
				year = getDate.year,
				month = getDate.month, //获取当前的月份
				day = getDate.day, //获取当天是几号
				week = getDate.week, //获取当天是星期几
				allDay = this.data.arrMonth(year), //当年的月份列表
				monthDay = allDay[month-1] //获取当月有多少天







				//第一次打开将时间显示在最中间
				var firstDay = '', //当前显示的第一天
					lastDay = '', //当前显示的最后一天
					weekArrShow = []; //当前显示的星期的数组





				//当天之前的时间
				for(var di=0;di<=week;di++) {
					var today = day - di
					if(today > 0){ //正常添加
						weekArrShow.unshift({
							year:year,
							month:month,
							day:today
						})
					}else{
						if(month == 1){ //如果是一月则要回到上一年
							weekArrShow.unshift({
								year:year - 1,
								month:12,
								day:31 - di + day
							})

						}else{//如果不是一月,则跳转至上一个月
							var getBeforMonthAllDay = allDay[month-2] //获取上一个月有多少天
							weekArrShow.unshift({
								year:year,
								month:month - 1,
								day: getBeforMonthAllDay - di + day
							})
						}
					}
				}





				var newMonth = 1

				//当天之后的时间
				for(var ai=1;ai<(7-week);ai++){
					var today = day + ai
					if(today <= monthDay){ //正常添加
						weekArrShow.push({
							year:year,
							month:month,
							day:today
						})
					}else{
						if(month == 12){ //如果是12月则要往后推到一年
							weekArrShow.push({
								year:year + 1,
								month:1,
								day: newMonth
							})
							newMonth++
						}else{ //否则往后推一个月
							weekArrShow.push({
								year:year,
								month:month + 1,
								day: newMonth
							})
							newMonth++
						}

					}
				}

				/*必须要设置这里之后才能计算前一周和后一周，
					前一周和后一周都依赖currentShowWeek值的变化
				 */

				this.data.currentShowWeek = weekArrShow

				return weekArrShow

		},


		//计算前一周的数据 ,滚动后重复调用
		beforeWeek:function () {
			var currentShowWeek = this.data.currentShowWeek[0], //获取当前显示的星期的第一天的数据
				year = currentShowWeek.year,
				month = currentShowWeek.month,
				day = currentShowWeek.day,
				beforeWeekArr = []


			for(var bi=1;bi<=7;bi++){
				var B_day = day - bi
				if(B_day<=0){ //如果时间小于了一号则要往前推一个月
					if(month == 1){ //如果是一月则需要往前推一年,月份一定为12月
						beforeWeekArr.unshift({
							year:year - 1,
							month:12,
							day: 31 + B_day //此时的B_day为0或者负数,所以需要+
						})
					}else{//否则推一个月
						var arrMonth = this.data.arrMonth(year),
							beforMonthAllDay = arrMonth[month-2] // 获取前一个月一共有多少天
						beforeWeekArr.unshift({
							year:year,
							month:month - 1,
							day: beforMonthAllDay + B_day
						})

					}


				}else{
					beforeWeekArr.unshift({
						year:year,
						month:month,
						day: B_day
					})
				}
			}



			return beforeWeekArr

			
		},


		//计算后一个月的数据 ,滚动后重复调用
		afterWeek:function () {
			var currentShowWeek = this.data.currentShowWeek[6], //获取当前显示的星期的最后一天的数据
				year = currentShowWeek.year,
				month = currentShowWeek.month,
				day = currentShowWeek.day,
				arrMonth = this.data.arrMonth(year), //获取当年每个月都有多少天
				monthAllDay = arrMonth[month-1], //获取当月有多少天
				afterWeekArr = []


			for(var ai=1;ai<=7;ai++){
				var A_day = day + ai

				if(A_day > monthAllDay){ //如果超过了时间则要推向下一个月
					if(month == 12){ //如果是12月则要推向下一年
						afterWeekArr.push({
							year:year+1,
							month:1,
							day:A_day - monthAllDay //用加起来的天数 - 当月有多少天
						})

					}else{//否则只需要推向下一个月
						afterWeekArr.push({
							year:year,
							month:month + 1,
							day:A_day - monthAllDay
						})
					}

				}else{
					afterWeekArr.push({
						year:year,
						month:month,
						day:A_day
					})
				}


			}



			return afterWeekArr


		},






		//初次渲染
		render:function() {
			var that = this,
				dom = this.creatDOM(),
				config = this.data.config,
				date = this.fmtDate(this.data.config.date)




			//设置系统是时间
			this.data.systemDate = this.fmtDate()
			//设置当前点击的时间
			this.data.recordingTime = date


			var sel = document.querySelector(config.el)






			//渲染星期
			if(this.data.config.showWeek){
				this.setWeek(dom)
				dom.iantooWeek.appendChild(dom.weekBar)
			}




			//渲染日历栏
			this.setCalendar(dom)  //---书记环节较多




			//渲染星期和日历

			dom.iantooWeek.appendChild(dom.C_box)




			//dom 渲染到页面
			sel.appendChild(dom.iantooWeek)



			this.renderEnd(dom)

		},




		//渲染星期的DOM
		renderWeek:function (arr,dom,type) {
			var that = this,
				weekBox = this.elem('div',{class:'weekBox'}),
				recordingTime = this.data.recordingTime, //当前需要选中的时间
				systemDate = this.data.systemDate //当前的系统时间

			for(var wib in arr){
				var dayBox = this.elem('a')



				//判断是否为系统时间
				if(arr[wib].year == systemDate.year && arr[wib].month == systemDate.month && arr[wib].day == systemDate.day){
					dayBox.className = 'today systemDate'
					dayBox.style.background = this.data.config.theme.systemBG
					dayBox.style.color = this.data.config.theme.systemFontColor
				}


				//当天,着重标注
				if(arr[wib].year == recordingTime.year && arr[wib].month == recordingTime.month && arr[wib].day == recordingTime.day){
					dayBox.className = 'today'
					dayBox.style.background = this.data.config.theme.selectGB
					dayBox.style.color = this.data.config.theme.selectFontColor


					//记录DOM
					this.data.clickDom = dayBox
				}




				dayBox.innerText = arr[wib].day

				//当某一天被点击的时候
				dayBox.onclick = function (e) {
					that.clickDay(e,this)
				}

				//计算每天是否需要被标记
				this.signDate(arr[wib],dayBox)

				weekBox.appendChild(dayBox)
			}


			//滑动监听
			weekBox.addEventListener('touchstart',function(e){
				that.touchstartFun(e,dom,that)
			},false)
			weekBox.addEventListener('touchmove',function(e){
				that.touchmoveFun(e,dom,that);
				e.preventDefault();
				e.stopPropagation();
			},false)
			weekBox.addEventListener('touchend',function(e){
				that.touchendFun(e,dom,that)
			},false)



			if(type == 'right'){ //如果是往右滑动则是在最前面添加DOM
				dom.C_box.insertBefore(weekBox,dom.C_box.childNodes[0])
			}else{ //否则在最后面添加DOM
				dom.C_box.appendChild(weekBox)
			}
			return weekBox

		},




		//计算是否标记时间,高频率调用方法，不能堵塞
		signDate:function (opction,aDOM) {
			var sign = this.data.config.sign
			for(var si in sign){
				var newSignDay = this.fmtDate(sign[si])
				if(opction.year == newSignDay.year && opction.month == newSignDay.month && opction.day == newSignDay.day){
					var signDom = this.elem('span')
					aDOM.appendChild(signDom)
				}
			}
		},





		//渲染结束之后
		renderEnd:function (dom) {
			var weekBox = dom.C_box.querySelectorAll('.weekBox'),
				offsetWidth = window.screen.availWidth || weekBox[1].offsetWidth

			//渲染结束设置位置
			weekBox[0].style.transform = "translateX(-"+offsetWidth+"px)"
			weekBox[1].style.transform = "translateX(0px)"
			weekBox[2].style.transform = "translateX("+offsetWidth+"px)"




			//记录页面的宽度
			this.data.slider.W = offsetWidth



			//首次渲染结束调用
			this.data.config.render(this.data.currentShowWeek,this.data.systemDate)

		},




		//更新渲染
		updataRender:function (that,type,dom) {
			var renderArr = '', //需要重新渲染的数组
				month_box = dom.C_box.querySelectorAll('.weekBox'), //此处需要重新获取
				W = that.data.slider.W, //日历总宽度
				calcWeekArr = that.data.calcWeekArr, // 得到当前显示的三个星期的数组
				weekBox = '' //新渲染回来的星期栏的DOM

			if(type == 'right'){


				//——————————————————————————————————————
				// 交换当前显示的周的时间
				that.data.currentShowWeek = calcWeekArr[0]
				// 得到新的上一周的数组
				renderArr = that.beforeWeek()

				//重新修改数组
				that.data.calcWeekArr.unshift(renderArr)
				that.data.calcWeekArr.pop()


				weekBox = that.renderWeek(renderArr,dom,type)

				weekBox.style.transform = "translateX(-"+W+"px)"


			}else{
				//————————————————————————————————
				that.data.currentShowWeek = calcWeekArr[2]
				// 得到新的上一周的数组
				renderArr = that.afterWeek()

				//重新修改数组
				that.data.calcWeekArr.push(renderArr)
				that.data.calcWeekArr.shift()

				weekBox = that.renderWeek(renderArr,dom,type)

				weekBox.style.transform = "translateX("+W+"px)"
			}



			//每次更新渲染之后回调
			that.data.config.updataRender(that.data.currentShowWeek)
		},





		touchstartFun:function (e,dom,that) {
			var clientY = e.changedTouches[0].clientY,
				clientX = e.changedTouches[0].clientX,
				month_box = dom.C_box.querySelectorAll('.weekBox'),
				translate = window.getComputedStyle(month_box[1], null).getPropertyValue("transform");
				translate = translate.substring(0,translate.length-1)
				translate = translate.split(',')

			var translateY = parseInt(translate[5]), //一直在获取translateY属性的值
				translateX = parseInt(translate[4])


			that.data.touch.translateX = translateX
			that.data.touch.translateY = translateY
			that.data.touch.clientX = clientX
			that.data.touch.clientY = clientY


			//回调页面的方法
			that.data.config.touchStartFun(e)
		},
		touchmoveFun:function (e,dom,that) {
			var clientY = e.changedTouches[0].clientY,
				clientX = e.changedTouches[0].clientX,
				W = that.data.slider.W, //获取页面的宽度
				startClientX = that.data.touch.clientX,  //获取点击的时候的X坐标
				translateX = that.data.touch.translateX,
				month_box = dom.C_box.querySelectorAll('.weekBox'),
				coordinateX = clientX - startClientX + translateX




			month_box[0].style.transform = "translateX("+(coordinateX-W)+"px)"
			month_box[1].style.transform = "translateX("+coordinateX+"px)"
			month_box[2].style.transform = "translateX("+(coordinateX+W)+"px)"

		},
		touchendFun:function (e,dom,that) {
			var clientY = e.changedTouches[0].clientY,
				clientX = e.changedTouches[0].clientX,
				elastic = that.data.elastic, //获取弹性值
				W = that.data.slider.W, //日历总宽度
				startClientX = that.data.touch.clientX,  //点击的时候的X坐标
				month_box = dom.C_box.querySelectorAll('.weekBox'),
				direction = (clientX-startClientX)/W, //滑动方向
				proportionX = Math.abs(direction), //滑动绝对值
				isRender = false, //是否要重新渲染
				LorR = '',//  向左或者向右，
				renderArr = '' //z如果需要重新渲染，重新渲染的新 数组


			if(proportionX>elastic){ //如果达到了弹性值
				isRender = true
				if(direction>0){ //向右滑动
					LorR = 'right'
					month_box[0].style.transform = "translateX(0px)"
					month_box[1].style.transform = "translateX("+W+"px)"
					month_box[2].outerHTML = ''
					month_box[2].innerHTML = ''


				}else{//向左滑动
					LorR = 'left'
					month_box[1].style.transform = "translateX(-"+W+"px)"
					month_box[2].style.transform = "translateX(0px)"
					month_box[0].outerHTML = ''
					month_box[0].innerHTML = ''

				}
			}else{ //没有达到弹性值//回弹
				month_box[0].style.transform = "translateX(-"+W+"px)"
				month_box[1].style.transform = "translateX(-0px)"
				month_box[2].style.transform = "translateX("+W+"px)"
			}




			for(var mi in month_box){
				if(typeof month_box[mi] === 'object'){
					month_box[mi].style.transition = "all 0.2s ease-in"
				}
			}
			setTimeout(function () {
				for(var boi=0;boi<month_box.length;boi++){
					if(typeof month_box[boi] === 'object'){
						month_box[boi].style.transition = "all 0s ease-in"
					}
				}
			},200)






			//需要更新渲染
			if(isRender === true){
				that.updataRender(that,LorR,dom) //将新的一周渲染到页面上
			}

			//回调页面的方法	
			that.data.config.touchEndFun(e)
		},




		//当点击某一天的时候
		clickDay:function (e,that) {
			var clickDom = this.data.clickDom


			//删除之前DOM的class
			clickDom.removeAttribute('style')
			var befClass = clickDom.getAttribute('class'),
				classLength = befClass.split(' ')

			if(classLength.length > 1){
				clickDom.class = 'systemDate'
				clickDom.style.background = this.data.config.theme.systemBG
				clickDom.style.color = this.data.config.theme.systemFontColor
			}else{
				clickDom.removeAttribute('class')
			}



			//为新的DOM添加Class
			this.data.clickDom = that
			var thatClass = that.getAttribute('class')
			if(!thatClass){
				that.className = 'today'
			}
			that.style.background = this.data.config.theme.selectGB
			that.style.color = this.data.config.theme.selectFontColor




			


			var dayText = parseInt(that.innerText),
				currentShowWeek = this.data.currentShowWeek

			for(var ci in currentShowWeek){
				if(currentShowWeek[ci].day == dayText){

					//修改当前选择的时间
					var callBackDate = {
						year:currentShowWeek[ci].year,
						month:currentShowWeek[ci].month,
						day:dayText
					}

					this.data.recordingTime = callBackDate

					//回调方法
					this.data.config.clickDay(callBackDate)
				}
			}
		},




		//创建DOM
		elem:function(element,type) {
			var DOM = document.createElement(element);
			if(type){
				for(var key in type){
					DOM.setAttribute(key,type[key])
				}
			}
			return DOM
		},


		//获取指定格式的时间
		fmtDate:function(DateStr){
			var date;

			if(DateStr){
				try{
					var splitDate = DateStr.split(/\D/),  //得到的格式[2018,11,11,22,33,44]
						m_y = parseInt(splitDate[0]),
						m_m = parseInt(splitDate[1])-1,   //月份的参数是0-11，所以要减去1
						m_d = parseInt(splitDate[2]),


						m_h = isNaN(parseInt(splitDate[3])) ? 0 : parseInt(splitDate[3]),
						m_month = isNaN(parseInt(splitDate[4])) ? 0 : parseInt(splitDate[4]),
						m_s = isNaN(parseInt(splitDate[5])) ? 0 : parseInt(splitDate[5]),
						date = new Date(m_y,m_m,m_d,m_h,m_month,m_s)
				}catch (err){
					console.info(err)
					date = new Date()
				}
			}else{
				date = new Date();
			}



			var y = date.getFullYear();
			var m = date.getMonth()+1; //在返回月份的时候要正常的加一
			var d = date.getDate();
			var h = date.getHours();
			var minute = date.getMinutes();
			var second = date.getSeconds();
			var week = date.getDay()

			return {
				year:y,
				month:m,
				day:d,
				h:h,
				m:minute,
				s:second,
				week:week
			}
		},


	}

	//------------------------------------------------//
	iantoo.week = function(opction){
		return new W.init(opction)
	}
	W.init.prototype = W
	win.iantoo = iantoo

})(window)




