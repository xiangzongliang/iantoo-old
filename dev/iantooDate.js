/*
	name : iantooDate
	version : 2.0.1
	date : 2018-06-07
	author : xiangzongliang
	github : https://github.com/xiangzongliang/iantoo-date
	doc : http://xiangzongliang.com/tool
 */

import "../less/common.less"
import "../less/iantooDate.less"


import dayjs from 'dayjs'
import elem from './lib/elem'


dayjs.locale('zh-cn')


;(function (w,undefined) {

    var iantoo = w.iantoo || {},
        _dom;


    const D = {

        //初始化
        init:function(opction) {
            var opction = opction || {}
	        this.data.config.el = opction.el || ''
            this.data.config.date = opction.date || ''
            this.data.config.lang = opction.lang || 'cn'
            this.data.config.mask = opction.mask.show ? true : false
	        this.data.config.maskClosePage = opction.mask.closePage ? true : false
            this.data.config.rollDirection = opction.rollDirection || 'UD'
            this.data.config.elastic = opction.elastic || 0.3

	        //主题颜色模块
	        this.data.config.theme.selectGB = opction.theme.selectGB || '#ff8800'
	        this.data.config.theme.selectFontColor = opction.theme.selectFontColor || '#ffffff'
	        this.data.config.theme.systemBG = opction.theme.systemBG || '#ececec'
	        this.data.config.theme.systemFontColor = opction.theme.systemFontColor || '#ffffff'
	        this.data.config.theme.overdueRemindingColor = opction.theme.overdueRemindingColor || '#c4c4c4'



	        this.data.config.header = opction.header ? true : false
	        this.data.config.week = opction.week ? true : false
            this.data.config.sign = opction.sign || []
            this.data.config.clickDay = opction.clickDay || function () {}
			this.data.config.clickFooter = opction.clickFooter || function () {}
            this.data.config.slide = opction.slide || function () {}
            this.data.config.render = opction.render || function () {}
            this.data.config.close = opction.close || function () {}
            this.data.config.move = opction.move ? true : false


            this.render()
        },


        //数据存储
        data:{
            config:{
            	el:'', //日历插件渲染的位置
                date : '',//指定渲染某个时间 格式 "2018-05-24" || "2000-02-22 23:19:56"
                lang : '',//默认语言为中文
                mask : true, //是否显示遮罩  默认开启
                maskClosePage:'', //点击遮罩是否关闭，默认开启，只有在显示遮罩开启的模式下有用
                theme:{
	                selectGB:'', //选择的背景颜色
	                selectFontColor:'', //选择的日历的文字颜色
	                systemBG:'', //系统当前时间的背景色
	                systemFontColor:'', //系统当前时间的文字颜色
	                overdueRemindingColor:''//过期时间提醒的背景色
                }, //主题颜色
	            rollDirection:'UD',
                selectDayColor:'', //默认选择今天的颜色
	            header:'',//是否显示头部 ,默认显示
	            week:'',//是否显示星期,默认显示
                elastic:0.3, //弹性,取值为0-1之间，为百分比
	            sign:[], //提示信息，传入的内容为年月日数组，当匹配到该年月日的时候会标记一个点，格式["2018-05-25","2018-05-30"]
                clickDay:'', //点击了某一天的日期 =>> 回调方法
	            clickFooter:'',//点击底部的按钮之后回调 ,回调当前的系统时间
                slide:'', //每次滑动结束之后回调方法
                render:'', //初次渲染完成之后回调
                close:'', //关闭页面之后回调
                move:'', //是否实时拖动,默认开启,实时监听并更新渲染页面需要消耗性能，当手机新能较差时可以关闭此功能
            },
            lang: {
                cn: {
                    week: ['日', '一', '二', '三', '四', '五', '六'],
                    time: ['时', '分', '秒'],
                    month: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
                },
                en: {
                    week: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    time: ['Hours', 'Minutes', 'Seconds'],
                    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                }
            }, //语言
            arrMonth:function(year) {
                //判断是否为润年并返回当年的所有月的天数
                if((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0){
                    return [31,29,31,30,31,30,31,31,30,31,30,31]  //闰年29天
                }else{
                    return [31,28,31,30,31,30,31,31,30,31,30,31]  //平年28天
                }
            }, //获取某一年的所有月份的天数
            slider:{
                X:'',
                Y:'',
                H:'',
                W:'',
            },//记录坐标
            translateY:0, //当前所有月份的坐标（统一）
	        translateX:0, //当前点击的日历的X值，主要为了避免快速点击的时候页面不能滑动完的效果
            today:{}, // 会保存传入的时间 || 是初始化的今天,只有点击之后才会发生变化    返回格式{year:2018,month:5,day:27,h:11,m:3,s:27,week:1}
            currentDate:{}, //当前显示的是那年那月 , 会随着页面的滑动
            pageMonthArr:[], //页面一共会渲染三个月的内容，对应的数组。
            selectDom:'', //当前选中的日历对象，避免下次点击的时候去遍历DOM，直接清除样式即可
	        constTody:{}, //初始化的系统的今天的时间，初始一次，之后不会发生变化
        },




        //创建页面的DOM
        creatDOM:function() {
            return {
                pop_date_box:elem.dom('div',{class:'iantooDate'}),
                mask:elem.dom('div',{class:'iantooMask'}),
                date_head:elem.dom('div',{class:'date_head'}),
                date_title:elem.dom('div',{class:'date_title'}),
                date_week:elem.dom('div',{class:'date_week'}),
                date_content:elem.dom('div',{class:'date_content'}),
	            date_footer:elem.dom('div',{class:'date_footer'}),
            }
        },



        //设置头部
        setHead:function() {
            var lang = this.data.config.lang, //语言
                theme = this.data.config.theme.selectGB, //主题色
                la = lang=='cn' ? this.data.lang.cn : this.data.lang.en,
                month = la.month,
                currentDate = this.data.currentDate,
                headerText;

            if(lang == 'cn'){
                headerText = currentDate.Y+'年'+currentDate.M + '月'
            }else{
                var getMonth = parseInt(currentDate.M)
                headerText = month[getMonth - 1] + ' ' + currentDate.Y
            }
            _dom.date_head.innerText = headerText
            _dom.date_head.style.color = theme
        },



        //设置星期栏
        setWeek:function() {
            var lang = this.data.config.lang,
                la = lang=='cn' ? this.data.lang.cn : this.data.lang.en,
                week = la.week

            for(var wi in week){
                var weekNode = elem.dom('a')
                weekNode.innerText = week[wi]
                _dom.date_week.appendChild(weekNode)
            }
        },



	    //设置底部内容
	    setFooter:function () {
        	var that = this
        	_dom.date_footer.innerText = '查看今天'
		    _dom.date_footer.onclick = function () {
        		// ------- 重新渲染当天需要执行的方法
        		that.data.config.date = '' //时间初始化为空
			    var dateNode = that.fmtDate() //得到今天的时间
			    that.data.today = {
				    y:dateNode.Y,
				    m:dateNode.M,
				    d:dateNode.D
			    };
			    that.data.currentDate = dateNode
			    //计算页面要渲染的三个月的日历
			    that.calcPageDate()
			    that.setHead()
			    //计算并显示页面中的月份详情
			    that.calcMonth(_dom)
			    //渲染结束调用方法
			    that.renderEnd(_dom)

			    //回调点击当前底部的按钮
			    that.data.config.clickFooter(that.data.constTody,function(){
			    	that.close()
			    })
		    }
	    },



        //初次渲染
        render:function() {
            var config = this.data.config,
                dom = this.creatDOM(),
                dateNode = this.fmtDate(config.date),
	            constTody = this.fmtDate(),
	            styleSheets = document.styleSheets[0];



                _dom = dom


            //初始化两个时间,注：⚠这里必须去等于一个新的对象，否则在对象深度复制的时候会出现问题️
            this.data.today = dateNode;
            this.data.currentDate = dateNode

            //初始化系统的时间，为显示今天标为灰色准备,改时间设置之后不会改变
	        this.data.constTody = constTody


            //计算页面要渲染的三个月的日历
            this.calcPageDate()




            //计算并显示页面中的月份详情
            this.calcMonth(dom)







	        this.setHead()
	        this.setWeek()
	        this.setFooter()

            //渲染
	        //---条件渲染头部
	        if(this.data.config.header == true){
		        dom.pop_date_box.appendChild(dom.date_head)
	        }
	        //---条件渲染星期
	        if(this.data.config.week == true){
		        dom.pop_date_box.appendChild(dom.date_week)
	        }
            dom.pop_date_box.appendChild(dom.date_content)

	        //渲染底部
	        dom.pop_date_box.appendChild(dom.date_footer)






            //渲染到页面  ,如果传入了ID,则渲染到对应的DOM，否则渲染到body
	        if(this.data.config.el){
            	var elem = document.querySelector(this.data.config.el)
		        elem.innerHTML = ''//避免重复渲染

		        elem.appendChild(dom.pop_date_box)
		        if(this.data.config.mask){
			        elem.appendChild(dom.mask)
		        }
	        }else{
            	//避免重复渲染
		        var iantooDate = document.querySelector('.iantooDate')
		        iantooDate.outerHTML = ''

		        document.body.appendChild(dom.pop_date_box)
		        if(this.data.config.mask){
			        document.body.appendChild(dom.mask)
		        }
	        }







            //修改提示点的背景颜色,date_sign为正常的提示颜色，date_sign overdue为过期的提示颜色
            styleSheets.insertRule('.month_box p a span { background: '+ this.data.config.theme.selectGB +' }', 0);
            styleSheets.insertRule('.month_box p a.overdue span { background: '+ this.data.config.theme.overdueRemindingColor +' }', 0)

            //渲染结束调用方法
            this.renderEnd(dom)
            //添加事件监听
            this.event()
            //首次渲染完成之后回调
            this.data.config.render({
                date:dateNode,
                systemDate:this.data.constTody
            }) //回调系统当前时间
        },




        //渲染结束
        renderEnd:function(dom) {

            var month_box = dom.date_content.getElementsByClassName('month_box'),
                box_height_one = month_box[0].offsetHeight, //第一个月份需要往上推自身的高度
                box_height = month_box[1].offsetHeight,
                box_width = month_box[1].offsetWidth
            this.data.slider.H = box_height
            this.data.slider.W = box_width

            if(this.data.config.rollDirection == 'LR'){
	            dom.date_content.style.maxHeight = box_height+'px'
	            dom.date_content.style.minHeight = box_height+'px'

	            month_box[0].style.transform = "translateX(-"+box_width+"px)"
	            month_box[1].style.transform = "translateX(0px)"
	            month_box[2].style.transform = "translateX("+box_width+"px)"
            }else{
	            dom.date_content.style.maxHeight = box_height+'px'
	            dom.date_content.style.minHeight = box_height+'px'

	            month_box[0].style.transform = "translateY(-"+box_height_one+"px)"
	            month_box[1].style.transform = "translateY(0px)"
	            month_box[2].style.transform = "translateY("+box_height+"px)"
            }
        },




        //计算页面显示的三个月的日历数组
        calcPageDate:function() {
            var currentDate = this.data.currentDate,  //当前显示的是那个月
                pageMonthArr = this.data.pageMonthArr, //显示的三个月份的数组
                year = currentDate.Y,
                month = currentDate.M


            //arr[0]
            if((month - 1)<=0){
                pageMonthArr[0] = {
                    year:year-1,
                    month:12
                }
            }else{
                pageMonthArr[0] = {
                    year:year,
                    month:month-1
                }
            }


            //arr[1]
            pageMonthArr[1] = {
                year:year,
                month:month
            }

            //arr[2]
            if((month+1)>12){
                pageMonthArr[2] = {
                    year:year+1,
                    month:1
                }
            }else{
                pageMonthArr[2] = {
                    year:year,
                    month:month+1
                }
            }
        },




        //计算页面上显示月的详细内容
        calcMonth:function() {
        	//每次渲染的时候先清空之前的内容
	        _dom.date_content.innerHTML = ''
            var pageMonthArr = this.data.pageMonthArr,
                that = this


            for(var pi in pageMonthArr){
                var monthBox = that.renderMonth(_dom,{
                    year:pageMonthArr[pi].year,
                    month:pageMonthArr[pi].month
                })

                _dom.date_content.appendChild(monthBox)
            }
        },





        //更新渲染
        updataRender:function(type,dom) {
            var that = this,
                currentDate = this.data.currentDate,
                year = currentDate.Y,
                month = currentDate.M,
                newYear,newMonth


            if(type == 'up' || type == 'left'){
                //计算上滑翻页之后的月份
                if((month+1)>12){
                    newYear = year+1
                    newMonth = 1
                }else{
                    newYear = year
                    newMonth = month + 1
                }



                //渲染新的月份
                /*
                新的月份必须是当前的月份还要往日历之后推一个月
                 */

                var monthBox = this.renderMonth(dom,{
                    year:(newMonth+1)>12 ? newYear+1 : newYear,
                    month:(newMonth+1)>12 ? 1 : newMonth+1
                })


                //在DOM之后插入新的月份
                dom.date_content.appendChild(monthBox)



            }else{
                //计算下滑翻页之后的月份
                if((month-1)<=0){
                    newYear = year-1
                    newMonth = 12
                }else{
                    newYear = year
                    newMonth = month - 1
                }

                //渲染新的月份
                var monthBox = this.renderMonth(dom,{
                    year:(newMonth-1)<=0 ? newYear-1 : newYear,
                    month:(newMonth-1)<=0 ? 12 : newMonth-1
                })

                //在DOM之前插入新的月份
                dom.date_content.insertBefore(monthBox,dom.date_content.childNodes[0])

            }


            //设置当前显示的年月
            currentDate.Y = newYear
            currentDate.M = newMonth




            //重新渲染头部模块
	        if(this.data.config.header === true){
		        this.setHead()
	        }



            //更新渲染结束重新计算
            this.renderEnd(dom)



            //更新渲染结束回调方法
            that.data.config.slide({
                type:type,
                date:{
                    Y:newYear,
                    M:newMonth
                }
            })
        },






        //渲染当单个月份的信息
        renderMonth:function(dom,opction) {
            var that = this,
                move = this.data.config.move,
                monthBox = elem.dom('div',{class:'month_box'}),
                year = opction.year,
                month = opction.month,
                totalDay = this.fmtDate(year + '-' + month + '-1 08:00:01'), //获取当月一号对应的相关信息
                date_one_week = totalDay.w,  //得到当月的一号是星期几
                arrMonth = this.data.arrMonth(year),
                month_day = arrMonth[month-1], //得到当月有多少天
                //row = (month_day == 28 && date_one_week==0) ? 5 : 6 //显示多少行，其实有456行三种情况
                row = 6, //为防止页面上下跳动，统一渲染6行,
                today = that.data.today,
                system_year = today.Y, //系统当前的年
                system_month = today.M, //系统当前的月
                system_day = today.D, //系统当前的天
                isY_M = false,
	            constTody = this.data.constTody,   //系统对应今天的时间
                const_system_year = constTody.Y,
                const_system_month = constTody.M,
                const_system_day = constTody.D





            //判断是否为当前系统的年-月
            if(system_year == year && system_month == month){
                isY_M = true
            }





            for(var ri = 0;ri<row;ri++){
                var p = elem.dom('p')
                for(var di = 0;di<7;di++){
                    var a = elem.dom('a'),
                        nodeA = (ri*7)+di+1,
                        showDay = nodeA - date_one_week  //显示的日期--天

	                if(nodeA > date_one_week && nodeA <= (month_day+date_one_week)){
                        a.innerText = showDay

                        // 如果计算的时间是系统的今天，则灰色标注
                        if(const_system_year == year && const_system_month == month && const_system_day == showDay){
	                        a.style.backgroundColor = this.data.config.theme.systemBG
	                        a.style.color = this.data.config.theme.systemFontColor
                        }



                        //这里先设置灰色，在设置主题色，避免传入时间 === 系统对应的今天的时候，优先显示主题色

                        //如果是系统当前时间则选中当前的天
                        if(isY_M && showDay==system_day){
                            a.style.backgroundColor = this.data.config.theme.selectGB
                            a.style.color = this.data.config.theme.selectFontColor
                            elem.addClass(a,'day')
                            //将当前的标签放在JS中存储
                            that.data.selectDom = a
                        }


                        //去设置当天是否背标记提醒事件
                        that.signDay(a,{
                            Y:year,
	                        M:month,
                            D:showDay
                        })


		                a.onclick = function (e) {
			                that.clickDay(e,this)
		                };//对所有的天绑定点击事件


                    }else{
                        a.innerText = ' '
                    }

                    p.appendChild(a)
                }
                monthBox.appendChild(p)
            }

            //添加监听方法
            monthBox.addEventListener('touchstart',function(e){
            	that.touchstartFun(e,dom,that);
            },true)
            if(move){
                monthBox.addEventListener('touchmove',function(e){
                	that.touchmoveFun(e,dom,that);
	                e.preventDefault();
	                e.stopPropagation();
                },false)
            }
            monthBox.addEventListener('touchend',function(e){
            	that.touchendFun(e,dom,that);
            },true)
            return monthBox
        },




        //判断当天是不是背标记,该方法为高频次调用，不能阻塞
        signDay:function (a_dom,opction) {
            var signArr = this.data.config.sign,  //是否标记的年月日的数组,
	            constTody = this.data.constTody,
                signSpan = elem.dom('span')




            for(var si in signArr){
                var sign = signArr[si].split(/\D/),
                    year = parseInt(sign[0]),
                    month = parseInt(sign[1]),
	                day = parseInt(sign[2])

                if(year == opction.Y && month == opction.M && day == opction.D){
	                //如果是提醒的日期需要标记一个样式,改样式的背景会背::befor属性渲染
	                //a_dom.className = 'date_sign'
                    a_dom.appendChild(signSpan)



	                // 如果提醒的时间小于系统对应的今天时间，则显示颜色不同
	                var opctionDate = new Date(opction.Y,opction.M,opction.D),
		                constDate = new Date(constTody.Y,constTody.M,constTody.D),
		                opctionDate_ms = opctionDate.getTime(),
		                constDate_ms = constDate.getTime()

	                if(opctionDate_ms < constDate_ms){
		                a_dom.className = 'overdue'
	                }
                }
            }
        },




        //事件监听
        event:function() {
        	var that = this
            if(this.data.config.maskClosePage === true){
	            _dom.mask.onclick = function (ev) { //点击这招关闭日历 
					that.close() 
	            }
            }
        },



	    //关闭日历页面
	    close:function () {
        	try{ //在部分情况下会因为没有父节点报错
		        _dom.pop_date_box.outerHTML = ''
		        _dom.mask.outerHTML = ''
	        }catch (e){
		        document.querySelector(D.data.config.el).innerHTML = ''
	        }finally {
		        //关闭了页面回调
		        this.data.config.close()
	        }
	    },



        touchstartFun:function(e,dom,that) {
            var clientY = e.changedTouches[0].clientY,
	            clientX = e.changedTouches[0].clientX,
                month_box = dom.date_content.getElementsByClassName('month_box'),
                translate = window.getComputedStyle(month_box[1], null).getPropertyValue("transform");

                translate = translate.substring(0,translate.length-1)
                translate = translate.split(',')


                var translateY = parseInt(translate[5]), //一直在获取translateY属性的值
                    translateX = parseInt(translate[4])
            //----------
            that.data.slider.Y = clientY
	        that.data.slider.X = clientX
            that.data.translateY = translateY
	        that.data.translateX = translateX
        },
        touchmoveFun:function(e,dom,that) {
            var clientY = e.changedTouches[0].clientY, //当前的Y坐标
	            clientX = e.changedTouches[0].clientX, //当前的X坐标
	            Y = that.data.slider.Y, //点击时候的Y坐标
                X= that.data.slider.X,
                H = that.data.slider.H,  //每个月份的高度
                W = that.data.slider.W,
                translateY = that.data.translateY,
	            translateX = that.data.translateX,
                month_box = dom.date_content.getElementsByClassName('month_box'),
                coordinateY = translateY + clientY - Y,
	            coordinateX = translateX + clientX - X


            if(that.data.config.rollDirection == 'LR'){
	            month_box[0].style.transform = "translateX("+(coordinateX-W)+"px)"
	            month_box[1].style.transform = "translateX("+coordinateX+"px)"
	            month_box[2].style.transform = "translateX("+(coordinateX+W)+"px)"

            }else{
	            month_box[0].style.transform = "translateY("+(coordinateY-H)+"px)"
	            month_box[1].style.transform = "translateY("+coordinateY+"px)"
	            month_box[2].style.transform = "translateY("+(coordinateY+H)+"px)"
            }
        },
        touchendFun:function(e,dom,that) {
            var clientY = e.changedTouches[0].clientY, //当前的Y坐标
	            clientX = e.changedTouches[0].clientX,
                Y = that.data.slider.Y, //点击时候的Y坐标
                X = that.data.slider.X,
                H = that.data.slider.H,  //每个月份的高度
                W = that.data.slider.W,
                month_box = dom.date_content.querySelectorAll('.month_box'),
                elastic = that.data.config.elastic, //弹性比
                proportion = Math.abs(clientY - Y)/H,  //获取纵向滑动的绝对值
	            proportionX = Math.abs(clientX - X)/W,  //获取横向滑动的绝对值
	            sliderStatus = '',//滑动的方向和状态，对应的值分别为up\down\left\right
	            springback = true //是否因为弹力不够而回弹

			//优化代码
	        if(that.data.config.rollDirection == 'LR'){//横向滚动
		        if(proportionX > elastic){ //超过了弹性值
			        if((clientX - X)<0) {//向左滑动
				        sliderStatus = 'left'
				        springback = false
				        month_box[1].style.transform = "translateX(-"+W+"px)"
				        month_box[2].style.transform = "translateX(0px)"
                        month_box[0].innerHTML = ''
				        month_box[0].outerHTML = '' 
			        }else{//向右滑动
				        sliderStatus = 'right'
				        springback = false
				        month_box[0].style.transform = "translateX(0px)"
				        month_box[1].style.transform = "translateX("+W+"px)"
                        month_box[2].innerHTML = ''
				        month_box[2].outerHTML = ''
			        }

		        }else{//没有超过弹性值,回弹回去
			        springback = true
			        month_box[0].style.transform = "translateX(-"+W+"px)"
			        month_box[1].style.transform = "translateX(0px)"
			        month_box[2].style.transform = "translateX("+W+"px)"
		        }
	        }else{//纵向滚动
		        if(proportion > elastic){ //超过了弹性值
			        if((clientY - Y)>0){//向下滑动
				        sliderStatus = 'down'
				        springback = false
				        month_box[0].style.transform = "translateY(0px)"
				        month_box[1].style.transform = "translateY("+H+"px)"
                        month_box[2].innerHTML = ''
				        month_box[2].outerHTML = ''
			        }else{//向上滑动
				        sliderStatus = 'up'
				        springback = false
				        month_box[1].style.transform = "translateY(-"+H+"px)"
				        month_box[2].style.transform = "translateY(0px)"
                        month_box[0].innerHTML = ''
				        month_box[0].outerHTML = ''  
			        }

		        }else{//没有超过弹性值
			        //如果弹力不够，则会退回去
			        springback = true
			        month_box[0].style.transform = "translateY(-"+H+"px)"
			        month_box[1].style.transform = "translateY(0px)"
			        month_box[2].style.transform = "translateY("+H+"px)"
		        }
	        }



			//所有日历DOM设置弹性动画
	        /*
	        此处的循环需要注意。month_box的length为3，但是有时候可能会把DOM清除掉，不能设置样式，就会报错，
	        所以需要判断是否为一个DOM对象
	         */
	        for(var bi=0;bi<month_box.length;bi++){
            	if(typeof month_box[bi] === 'object'){
		            month_box[bi].style.transition = "all 0.2s ease-in"
	            }
	        }

	        //恢复动画为0
	        setTimeout(function () {
		        for(var boi=0;boi<month_box.length;boi++){
		        	if(typeof month_box[boi] === 'object'){
				        month_box[boi].style.transition = "all 0s ease-in"
			        }
		        }
	        },200)

	        if(springback === false){ //弹力足够
		        //重新渲染页面的月份内容
		        that.updataRender(sliderStatus,dom)
	        }
        },



        //点击了某一天的日期
        clickDay:function(e,clickDom) {
            var that = this,
	            currentDate = this.data.currentDate,
	            constTody = this.data.constTody,
	            today = this.data.today,
                selectDom = this.data.selectDom,
                callbackData = {
                    Y:currentDate.Y,
                    M:currentDate.M,
                    D:parseInt(clickDom.innerText)
                }

                //移除之前DOM的样式
                elem.removeClass(selectDom,'day')
                selectDom.removeAttribute('style')


                //如果对应的是系统时间，需要恢复之前的灰色样式
                if(constTody.Y == today.Y && constTody.M == today.M && constTody.D == today.D){
	                selectDom.style.backgroundColor = this.data.config.theme.systemBG
	                selectDom.style.color = this.data.config.theme.systemFontColor
                }



                //给新点击的DOM添加样式
                if(clickDom.innerText){
                    elem.addClass(clickDom,'day')
                    clickDom.style.backgroundColor = this.data.config.theme.selectGB
                    clickDom.style.color = this.data.config.theme.selectFontColor
                }

                //重新记录点击的DOM
                this.data.selectDom = clickDom
                this.data.today = callbackData


                //回传到API中
                this.data.config.clickDay(callbackData,function () {
    	            that.close()
                })
        },


        //获取指定格式的时间
        fmtDate:function(DateStr){
            var getdate;
            if(DateStr){
                getdate = dayjs(DateStr)
            }else{
                getdate = dayjs()
            }
            return {
                Y:getdate.$y,
                M:getdate.$M + 1,
                D:getdate.$D,
                h:getdate.$H,
                m:getdate.$m,
                s:getdate.$s,
                w:getdate.$W
            }
        },
    }



    const E = {
        update(opction){
        },
        close(){
            D.close()
        },
        fmtDate(date){
            return D.fmtDate(date)
        }
    }


    //------------------------------------------------//
    iantoo.date = function(opction){
        return new D.init(opction)
    }
    iantoo.date.__proto__ = E
    D.init.prototype = D
    w.iantoo = iantoo

})(window)
