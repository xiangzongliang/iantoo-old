/**
 * 惯性算法文件
 */
module.exports = {
    inertia(opction){
        let a_time = opction.time,
            a_tatol = opction.tatol,
            a_elastic = opction.elastic,
            fiboNum = 0,    //斐波那契数列
            increase = 0.1,   //自动增长数列
            inertiaFun = setInterval(()=>{
                fiboNum = fiboNum + increase
                increase = increase + a_elastic
                if(fiboNum > a_tatol){
                    console.log(fiboNum,a_tatol)
                    clearInterval(inertiaFun);
                    opction.callback(0)
                    opction.done(0)
                    return;
                }else{
                    console.log(fiboNum,a_tatol)
                    opction.callback(a_tatol-fiboNum)
                } 
            },10)
    }
}


// IA.inertia({
    // 	elastic:0.5,
    // 	state:'uniformity',		//取值 'quicken'加速、'deceleration'减速、'uniformity'匀速
    // 	tatol:clientY - touchY,		//运动的总量,会被callback带回来不同的值
    // 	callback(data){		//高频率回调方法
    // 		// console.log(data)
            
    // 	},
    // 	done(data){		//完成之后 data一定等于0
    // 		console.log(data)
    // 	}
    // })