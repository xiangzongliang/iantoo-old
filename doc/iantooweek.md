[TOC]

## 简介

`iantooweek`是一款基于移动端的横向滚动手机日历控件,不依赖于任何三方模块或框架。

[github连接](https://github.com/xiangzongliang/iantoo "github连接")

[========]



## 体验

![](http://p9hbij6zd.bkt.clouddn.com/iantooDate_Url.png)



## 快速使用

只需要在页面引入如下文件即可：

```html
./build/js/iantooweek.js
./build/css/iantooweek.css
```
并在页面上使用如下方法进行调用：

```javascript
iantoo.week()
```
通过调用全局`window`上的`iantoo`对象上的`week`属性即可在页面渲染出效果


## API


### el

> 非必填、`string`,默认会直接插入到`body`中。	

指定日历模块所渲染的`element`,传入格式入`'.className'`或`#idName`,最终会通过`querySelector`方法进行查找。



#### date

> 非必填、默认值：系统的当前时间，即：`new Date()`得到的时间。 、`type:string`

默认初始化的时间,格式必须为“`yyyy`-`mm`-`dd` `hh`:`mm`:`ss`” 或 “`yyyy`-`mm`-`dd`”。




### showWeek

> 非必填、`boolean`,默认`true`。

是否显示星期栏,默认显示。




### sign

> 非必填、`array`,默认`[]`。

用于标示某一天提醒,被标记的某一天下面会生成一个圆点提示。传入格式如：`“['2018-06-5','2018-6-23']”`




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
	clickDate:function(data){
		
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

每次滑动一星期之后回调的方法。返回当前显示的一星期的时间数组。





