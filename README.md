### 项目简介


`iantoo`系列是基于移动手机端的各种组件集合,该集合中的每个模块都不依赖于任何三方模块。在不同的版本中所对应的API有所不同,建议使用时对应版本的API进行配置。`dev`分支对应的最新开发版,`master`分支对应当前最新稳定版,其余`pro.V.*.*.0`分支对应的不同历史稳定版本的分支。





### 目录介绍

```
|-- assets				//静态文件存放目录 
|-- build				//打包生成的目录,通常用于生产引入使用  
|--	 |-- css   			
|--	 |-- js	   		
|-- dev					//开发目录   
|--	 |-- \*.js    
|-- less				//less目录   
|-- page				//页面,对应每个模块的使用方法调用   
|-- template			//模版目录,主要用于生成模板html   
|--	 |-- index.html    	
|-- 404.html 			//404   
|-- main.js				//入口打包文件   
|-- package.jsom   
```



### API 
 
[iantooweek](https://github.com/xiangzongliang/iantoo/tree/prod_1.0/page/iantooweek)   
[iantooDate](https://github.com/xiangzongliang/iantoo/tree/prod_1.0/page/iantooDate)   





### 开发与编译

clone项目之后,运行
```
npm i
```
开发模块
> 开发模式自动配置了热更新
```
npm run dev
```
打包编译
>每次打包编译会删除之前`build`目录下的所有文件,并重新写入
```
npm run build
```






### 模块介绍


##### iantooweek

`iantooweek`是一个横版滚动的日历插件,每次会按照一周的时间进行滑动


##### iantooDate

`iantooDate`是一款接近ios原生日历的空间,一次滑动一个月的时间,可以配置纵向或者横向滚动方式。






### 当前版本

V.1.0.1





### 维护与更新

下一个版本,维护兼容性。   
...   
发布 npm 包   



