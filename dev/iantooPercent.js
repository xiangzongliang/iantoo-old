;(function (win,undefined) {


	var iantoo = win.iantoo || {},
		_dom;

	var P = {
			//初始化
			init: function (opction) {
				if (opction == '' || opction.el == undefined || opction.el == '') {
					console.error('iantoo.percent();缺失参数el')
					return;
				}

				this.data.canvasDom = opction.el || ''
				if(opction.line){
					this.data.line.size =  opction.line.size || 4
					this.data.line.color = opction.line.color || '#D3EDFD'
				}

				if(opction.subject){
					this.data.subject.size =  opction.subject.size || 8
					this.data.subject.color = opction.subject.color || '#57C0FD'
					this.data.subject.Start_Position =  opction.subject.Start_Position || 0
					this.data.subject.percentage = opction.subject.percentage || 0
					this.data.subject.content = opction.subject.content || '附加文字'
				}


				if(opction.perStyle){
					this.data.perStyle.fontSize = opction.perStyle.fontSize || 30
					this.data.perStyle.color = opction.perStyle.color || '#EF5A3C'
				}


				if(opction.contentStyle){
					this.data.contentStyle.fontSize = opction.contentStyle.fontSize || 16
					this.data.contentStyle.color = opction.contentStyle.color || '#77828C'
				}


				this.render();
			},


			data: {
				canvasDom: '',       //绘图区域主要渲染的区域
				line: {              //背景线条显示的参数
					size: 4,        //背景线条的宽度
					color: '#D3EDFD',       //背景线条的颜色
				},
				subject: {           //主要绘图区域的参数
					size: 8,        //主要圆形的边线大小
					color: '#57C0FD',       //主要圆形区域的颜色
					Start_Position: 0,  //绘制的起始位置
					percentage: 0.86,      //百分比
					content: '附加文字',         //附加文字
				},
				perStyle: {  //百分比文字样式
					fontSize: 30,
					color: '#EF5A3C'
				},
				contentStyle: { //附加显示内容文字样式
					fontSize: 16,
					color: '#77828C'
				}
			},


			//页面检查
			inspect: function () {

			},


			//页面渲染
			render: function () {
				var that = this,
					canvasDom = document.querySelector('#' + that.data.canvasDom);
				if (canvasDom == null) {
					console.error('页面上没有找到标签:<canvas id="' + that.data.canvasDom + '"></canvas>')
					return;
				}

				var Dom_width = canvasDom.offsetWidth,
					Dom_height = canvasDom.offsetHeight,
					radius = ''; //半径


				canvasDom.width = Dom_width * 4;
				canvasDom.height = Dom_height * 4


				//计算半径
				if (Dom_width >= Dom_height) {
					radius = Dom_height * 2 - Dom_height / 4
				} else {
					radius = Dom_width * 2 - Dom_width / 4
				}



				var ctx = canvasDom.getContext("2d")




				function toer(pi, text) {
					ctx.clearRect(0, 0, Dom_width * 4, Dom_height * 4) //清空画布

					//绘制第一个圆形
					ctx.beginPath();
					ctx.lineWidth = that.data.line.size * 4;  //线条的粗细
					ctx.strokeStyle = that.data.line.color; // 线条的颜色
					ctx.arc(Dom_width * 2, Dom_width * 2, radius, 0, 2 * Math.PI, false);
					/**
					 * X
					 * Y
					 * r 半径
					 * sAngle  起始角度
					 * eAngle  结束角度
					 * counterclockwise  False = 顺时针，true = 逆时针。
					 */
					ctx.stroke();


					//绘制第二个圆形
					if (that.data.subject.percentage != 0) {
						ctx.beginPath();
						ctx.lineWidth = that.data.subject.size * 4;  //线条的粗细
						ctx.strokeStyle = that.data.subject.color; // 线条的颜色

						//lineJoin 属性,可以设置线的交汇处的样式，lineJoin有3个属性值：miter(尖角，默认)，bevel（斜角）,round（圆角）
						//lineCap 属性，定义线条的端点。lineCap有3个属性值：butt（平，默认）,round（圆）,square（方）

						ctx.lineCap = 'round'; //线条终点处用圆角
						ctx.arc(Dom_width * 2, Dom_width * 2, radius, -0.5 * Math.PI, pi * Math.PI, false);
						ctx.stroke();
					}


					//绘制百分比文字
					ctx.font = that.data.perStyle.fontSize * 4 + 'px ' + 'Arial'; //此处注意空格
					ctx.fillStyle = that.data.perStyle.color;
					ctx.textAlign = 'center';
					ctx.fillText(text + "%", Dom_width * 2, Dom_height * 2 - that.data.perStyle.fontSize / 2);
					/**
					 * text
					 * X
					 * Y
					 * maxWidth  //选填
					 */
					ctx.font = that.data.contentStyle.fontSize * 4 + 'px ' + 'Arial'; //此处注意空格
					ctx.fillStyle = that.data.contentStyle.color;
					ctx.textAlign = 'center';
					ctx.fillText(that.data.subject.content, Dom_width * 2, Dom_height * 2 + that.data.perStyle.fontSize * 3);


				}


				var PI = 0,
					percentage = that.data.subject.percentage;      //要显示的百分比

				if (percentage == 0) {
					toer(-0.5, 0)
				} else {
					var interval = setInterval(function () {
						PI = PI + 0.01
						if (PI <= (percentage * 2)) {
							toer(PI - 0.5, parseInt(Math.ceil(PI * 100) / 2))
						} else {
							clearInterval(interval);
						}

					}, 10)
				}
			}
		}

	//------------------------------------------------//
	iantoo.percent = function(opction){
		return new P.init(opction)
	}
	// iantoo.percent.__proto__ = E
	P.init.prototype = P
	win.iantoo = iantoo
})(window)