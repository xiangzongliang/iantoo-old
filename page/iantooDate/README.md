### 使用

引入文件:
```text
./build/css/iantooDate.css
./build/js/iantooDate.js
```

并在页面上调用:
```javascript
iantoo.date()
```
详细使用方法见`page/iantooDate/index.html`



### API

#### el

>`type:string`    默认 `body`    `class | id`

日历控件被渲染的地方,`element`	。




#### date:'2018-06-22'

>`type:string`    默认 当前时间    `yyyy-mm-dd hh:mm:ss  |  yyyy-mm-dd`

初始化时间的,不设置为初始化系统当前的时间。



####setSystemDate

>`type:string`    默认 系统时间    `yyyy-mm-dd hh:mm:ss  |  yyyy-mm-dd  | 时间戳`

手动设置系统时间,通常情况不适用该功能。
主要是为了避免用户修改了手机日历之后，获取的本地与服务器时间不统一,可以通过获取服务器时间进行手动设置。将不在获取本地时间




#### lang

>`type:string`    默认 `'cn'`    `cn | en`

选择日历的语言,支持中英文,默认中文




#### rollDirection 

>`type:string`    默认 `'UD'`    `UD | LR`

日历控件滚动的方向,默认纵向滚动,`LR`为横向滚动;注:字母为大写。




#### header

>`type:boolean`    默认 `true`

是否显示头信息。




#### week

>`type:boolean`    默认 `true`

是否显示星期栏




#### mask

遮罩层设置



##### mask.show

>`type:boolean`    默认 `true`

是否显示遮罩层。



##### mask.closePage

>`type:boolean`    默认 `true`

点击遮罩层是否关闭日历控件。




#### elastic

>`type:number`    默认 `0.3`  ` 0~1 `

弹性值,是指滑动的距离占整个日历高度的百分比，超过一定百分比之后才可以滚动,否则弹回。




#### theme

主题颜色配置



##### theme.selectGB

>`type:string`    默认 不同版本颜色值不同。 

被选择的某一天的背景颜色,设置方式可以是 `十六进制 #ff8800`、`rgb`、`rgba`、最终以`element.style.background = color`的形式设置。



##### theme.selectFontColor

>`type:string`    默认 `#ffffff`

被选择的某一天的恶文字颜色,设置方式同`theme.selectGB`



##### theme.systemBG

>`type:string`

系统对应的时间背景颜色。   

例如：今天的时间是`2018-06-20`,通过上面的参数`date:'2018-06-22'`,那么`06-22`为选中的某一天,`06-20`为系统时间。当选中的某一天雨系统时间重合时，会以选中的时间`theme.selectGB`优先显示。



##### theme.systemFontColor

>`type:string`

系统时间对应的文字颜色。



##### theme.overdueRemindingColor  `已被移除`

>`type:string`

过时的提醒时间的颜色。该效果之后再设置了提醒时间`sign`之后才会生效。

例如:
```javascript

iantoo.date({
	el:'.newCalendar',
	date:'2018-06-22',
	theme:{
		selectGB:'#33b5e5',
		overdueRemindingColor:'#ececec'
	},
	sign:['2018-06-21','2018-06-23']
})
```
则当前的初始化时间是`2018-06-22`,提醒时间中分别有`2018-06-21 | 2018-06-23` ,21日是初始化时间之前的时间,为过期时间,提示的背景色会以`theme.overdueRemindingColor`的颜色显示,`23`日为还未发生的提示,颜色背景则以`theme.selectGB`显示。




#### move

>`type:boolean`    默认 `true`

当日历控件滑动的时候,是否实时更新日历控件的位置,主要是对部分低端机型做性能处理。
核心代码：禁用之后,主要是对	`touchmove`事件不在监听和执行渲染。




#### sign

>`type:Array`    默认 `[]`    `['yyyy-mm-dd','yyyy-mm-dd']`

提醒事件,添加之后会在对应的天下面添加一个圆点提醒。




#### clickDay

>`type:Function`    `callback : date,close`

点击某一天的时候回调方法。

`date`：返回当前的时间,
`close`：调用该方法关闭日历控件。

使用方法：

```javascript

iantoo.date({
	render:function(date,close){
		//....
		console.info(date)  // {Y: 2018, M: 6, D: 29}

		close()  //关闭日历控件
	}
})
```






#### render

>`type:Function`    `callback : opction`

每次打开日历控件的时候调用一次。
```javascript

iantoo.date({
	render:function(opction){
		/*
		{
            date:date, 				//初始化的时间
            systemDate:systemDate 	//	系统时间
        }
        */
	}
})
```




#### slide

>`type:Function`    `callback : date`

每次滚动日历之后回调,注:是指日历发生了月份滚动,而不是被回弹回去。

`date`:当前显示的年、月





#### clickFooter

>`type:Function`    `callback : systemDate,close`

点击底部的查看今天按钮回调方法。

`systemDate`:系统时间 
`close` : 关闭日历方法





#### close

>`type:Function`

日历控件被关闭 之后调用,没有回调参数。






### 扩展

#### iantoo.date.close()

在页面调用该方法会直接关闭日历控件

#### iantoo.data.fmtDate()

传入不同格式的时间可以转换为如下的形式返回,入参形式参考`dayjs`;通常`yyyy-mm-dd` | `yyyy-mm-dd hh-mm-ss`。传入空会返回系统当前时间。


```javascript
return {
    Y:年,
    M:月,
    D:日,
    h:时,
    m:分,
    s:秒,
    w:星期
}

```



















