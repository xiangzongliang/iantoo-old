!function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/",n(n.s=4)}({4:function(t,e,n){"use strict";!function(t,e){var n=t.iantoo||{},o={init:function(t){""!=t&&void 0!=t.el&&""!=t.el?(this.data.canvasDom=t.el||"",t.line&&(this.data.line.size=t.line.size||4,this.data.line.color=t.line.color||"#D3EDFD"),t.subject&&(this.data.subject.size=t.subject.size||8,this.data.subject.color=t.subject.color||"#57C0FD",this.data.subject.Start_Position=t.subject.Start_Position||0,this.data.subject.percentage=t.subject.percentage||0,this.data.subject.content=t.subject.content||"附加文字"),t.perStyle&&(this.data.perStyle.fontSize=t.perStyle.fontSize||30,this.data.perStyle.color=t.perStyle.color||"#EF5A3C"),t.contentStyle&&(this.data.contentStyle.fontSize=t.contentStyle.fontSize||16,this.data.contentStyle.color=t.contentStyle.color||"#77828C"),this.render()):console.error("iantoo.percent();缺失参数el")},data:{canvasDom:"",line:{size:4,color:"#D3EDFD"},subject:{size:8,color:"#57C0FD",Start_Position:0,percentage:.86,content:"附加文字"},perStyle:{fontSize:30,color:"#EF5A3C"},contentStyle:{fontSize:16,color:"#77828C"}},inspect:function(){},render:function(){var t=this,e=document.querySelector("#"+t.data.canvasDom);if(null!=e){var n=e.offsetWidth,o=e.offsetHeight,r="";e.width=4*n,e.height=4*o,r=n>=o?2*o-o/4:2*n-n/4;var a=e.getContext("2d"),i=0,c=t.data.subject.percentage;if(0==c)s(-.5,0);else var l=setInterval(function(){(i+=.01)<=2*c?s(i-.5,parseInt(Math.ceil(100*i)/2)):clearInterval(l)},10)}else console.error('页面上没有找到标签:<canvas id="'+t.data.canvasDom+'"></canvas>');function s(e,i){a.clearRect(0,0,4*n,4*o),a.beginPath(),a.lineWidth=4*t.data.line.size,a.strokeStyle=t.data.line.color,a.arc(2*n,2*n,r,0,2*Math.PI,!1),a.stroke(),0!=t.data.subject.percentage&&(a.beginPath(),a.lineWidth=4*t.data.subject.size,a.strokeStyle=t.data.subject.color,a.lineCap="round",a.arc(2*n,2*n,r,-.5*Math.PI,e*Math.PI,!1),a.stroke()),a.font=4*t.data.perStyle.fontSize+"px Arial",a.fillStyle=t.data.perStyle.color,a.textAlign="center",a.fillText(i+"%",2*n,2*o-t.data.perStyle.fontSize/2),a.font=4*t.data.contentStyle.fontSize+"px Arial",a.fillStyle=t.data.contentStyle.color,a.textAlign="center",a.fillText(t.data.subject.content,2*n,2*o+3*t.data.perStyle.fontSize)}}};n.percent=function(t){return new o.init(t)},o.init.prototype=o,t.iantoo=n}(window)}});