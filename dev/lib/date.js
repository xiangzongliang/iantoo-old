var fmtDate = function(DateStr){
    var date;

    if(DateStr){
        try{
            var splitDate = DateStr.split(/\D/),  //得到的格式[2018,11,11,22,33,44]
	            m_y = parseInt(splitDate[0]),
	            m_m = parseInt(splitDate[1])-1,   //月份的参数是0-11，所以要减去1
	            m_d = parseInt(splitDate[2]),
	            m_h = parseInt(splitDate[3]),
	            m_month = parseInt(splitDate[4]),
	            m_s = parseInt(splitDate[5])
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
}