[TOC]

### [最新官方文档](http://xiangzongliang.com/toolArr/DOC?tool=100)

### 使用

引入文件:
```
./build/js/iantooPercent.js
```
并在页面执行
```html
<canvas id="iantooPercent" style="width: 150px;height: 150px"> </canvas>
<script type="text/javascript" src="../../build/js/iantooPercent.js"></script>
<script type="text/javascript">
	iantoo.percent({
		el:'iantooPercent'
	})

```
既可正常显示如下
![haha](http://7xqb1s.com1.z0.glb.clouddn.com/1532426438067iantooPercent.jpg)
该模块不依赖任何三方模块，并于`iantoo`系列其它功能可同时存在。

### 兼容性

> 所有支持`canvas`的浏览器均支持该模块

可以参考`canvas`基本支持属性
![haha](http://7xqb1s.com1.z0.glb.clouddn.com/1532425383563WX20180724-174218@2x.png)

### 预览

![haha](http://7xqb1s.com1.z0.glb.clouddn.com/1532425483940iantooPercent.png)

[iantooPercent](http://xiangzongliang.com/iantoo/page/iantooPercent/ "iantooPercent")

### [Github](https://github.com/xiangzongliang/iantoo-old/tree/master/page/iantooPercent)

### API

#### el

`canvas`对应的ID名称,必填。
>模块最终使用`querySelector`方法进行DOM 查找,并自动添加`#`为id查找。

#### line
指边线,也就是背景中的整圆。


##### line.size
> 非必填、`number`,默认:4

边线的粗细。

##### line.color
> 非必填、`string`,默认:'#D3EDFD'，十六进制颜色值。

边线的颜色。

#### subject
主要旋转部分的样式设置

##### subject.size
> 非必填、`number`,默认:8。

旋转主线条的粗细。

##### subject.color
> 非必填、`string`,默认:'#57C0FD'，十六进制颜色值。

旋转的主线条的颜色。

##### subject.Start_Position
> 非必填、`number`,默认:0，取值:0,1,2,3。

制旋转主线条的开始位置，取值:0,1,2,3 ;按照时钟的时间说明 0代表从00点钟方向开始; 1代表是3点钟方向,依此类推 。

##### subject.percentage
> 非必填、`number`,默认:0，取值:0～1。

旋转的百分比，取值在0～1之间，如果浮点数在小数点后三位的数，不会进行四舍五入，而是通过直接取小数点后面两位数为准。

##### subject.content
> 非必填、`string`,默认:'附加文字'

除显示百分比数字以外，的附加内容显示文字，将显示在百分比内容下面，此处并未对传入字符长度做限制。

#### perStyle

百分比文字样式

##### perStyle.fontSize
> 非必填、`number`,默认:30。

百分比文字大小,会通过`subject.percentage`的值自动计算百分数的数字并添加百分号。

##### perStyle.color
> 非必填、`string`,默认:'#EF5A3C'。

百分比文字现实的颜色。

#### contentStyle.
附加内容的样式

##### contentStyle.fontSize
> 非必填、`number`,默认:16。

附加文字内容显示的字体大小

##### contentStyle.color
> 非必填、`string`,默认:'#77828C'。

附加内容的文字颜色。


注：该模块必须对`canvas`标签设置`style`的宽高属性，或者通过`class`属性指定宽高。源码中会通过获取`canvas`的`offsetWidth`和`offsetHeight`去重新设置`canvas`的`width`和`height`属性，但这并不影响自身`style`属性下所对应显示的大小。


