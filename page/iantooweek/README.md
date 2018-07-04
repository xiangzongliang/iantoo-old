## 目录
* [快速使用](#使用)
* [API](#api)
	* [el](#el)
	* [date](#date)
	* [setSystemDate](#setSystemDate)
	* [showWeek](#showWeek)
	* [sign](#sign)
	* [theme](#theme)
	* [clickDate](#clickDate)
	* [render](#render)
	* [updataRender](#updataRender)
	* [scroll](#scroll)
	* [touchStartFun](#touchStartFun)
	* [touchEndFun](#touchEndFun)

* [维护与更新](#维护与更新)





### 使用

引入文件:
```text
./build/css/iantooweek.css
./build/js/iantooweek.js
```

并在页面上调用:
```javascript
iantoo.week()
```
详细使用方法见`page/iantooweek/index.html`





## API


### el

> 非必填、`string`,默认会直接插入到`body`中。	

指定日历模块所渲染的`element`,传入格式入`'.className'`或`#idName`,最终会通过`querySelector`方法进行查找。



#### date

> 非必填、默认值：系统的当前时间，即：`new Date()`得到的时间。 、`type:string`

默认初始化的时间,格式必须为“`yyyy-mm-dd hh:mm:ss`” 或 “`yyyy-mm-dd`”。



####setSystemDate

>`type:string`    默认 系统时间    `yyyy-mm-dd hh:mm:ss  |  yyyy-mm-dd  | 时间戳`

手动设置系统时间,通常情况不适用该功能。
主要是为了避免用户修改了手机日历之后，获取的本地与服务器时间不统一,可以通过获取服务器时间进行手动设置。将不在获取本地时间




### showWeek

> 非必填、`boolean`,默认`true`。

是否显示星期栏,默认显示。




### sign

> 非必填、`array`,默认`[]`。

用于标示某一天提醒,被标记的某一天下面会生成一个圆点提示。传入格式如：`“['2018-06-5','2018-6-23']”`




### RootNoScroll

> 非必填 、`boolean`,默认`true`可滚动。

`false`时禁止左右滚动,禁止滚动之后不会在左右滑动,将不会触发`scroll`、`touchStartFun` 和 `touchEndFun`方法。只有在兼容部分机型的时候才会调用。






### theme 

主题颜色

##### theme.selectGB

> 非必填、`string`,默认:会随着版本的不同而变化

被选择的某一天的背景色,可传入颜色值的方式可分为16进制、RGB、RGBA等颜色模式,最终以`element.style.background = color`的形式赋值。

##### theme.selectFontColor

> 非必填、`string`,默认:`'#ffffff'`

被选中的某一天的文字颜色,格式同`theme.selectGB`

##### theme.systemBG

> 非必填、`string`,默认:会随着版本的不同而变化

系统时间的背景颜色,当系统的当前时间被选中时,会以`theme.selectGB`的颜色优先显示。格式同`theme.selectGB`

##### theme.systemFontColor

> 非必填、`string`,默认:会随着版本的不同而变化

系统时间的文字颜色,被点击时会以`theme.selectFontColor`颜色优先显示。格式同`theme.selectGB`




### clickDate

> 非必填、`function`。

当点击某一天的时候会回调该方法。如下

```javascript
iantoo.week({
	clickDate:function(date){
		console.info(date) 		//{year: 2018, month: 6, day: 29}
	}
})

```
返回对应的当天的年月日时间






### render

> 非必填、`function`。

日历在调用时渲染完成之后自动触发该方法,示例:

```javascript
iantoo.week({
	render:function(data,systemDate){

	}
})

```
`data`返回的是当前页面渲染的星期的时间数组列表
`systemDate`返回当前电脑系统对应的时间年月日






### updataRender

> 非必填、`function`。


日历控件更新之后哦调用,只有在调用了iantoo.week.update()的时候才会被触发


### scroll

> 非必填、`function`。

每次滑动之后调用的方法,返回当前显示的七天的日期。



### touchStartFun

> 非必填、`function`。

滑动开始触发的方法。

### touchEndFun

> 非必填、`function`。

滑动结束触发的方法

>注：`touchStartFun` 和 `touchEndFun`方法对应的则是`touchstart`和`touchend`,通常用在安卓设备上。当打开一个`activity`的以后，如果有原生的横向滑动方法,需要原生支持方来来禁止滚动,则可以通过这两个方法来控制是否禁止原生的滑动。对于`IOS`设备已经通过阻止冒泡事件进行控制,不需要再做控制。



### 维护与更新
...




