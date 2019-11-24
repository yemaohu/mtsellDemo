export function formatDate(date,fmt) {
    if(/(y+)/.test(fmt)){//用/(y+)/正则表达式匹配fmt,分组捕获后RegExp.$1是yyyy,
                         //然后replace成date.getFullYear()+''，substr分割字符
        fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
    }
    let o ={
        'M+':date.getMonth()+1,
        'd+':date.getDate(),
        'h+':date.getHours(),
        'm+':date.getMinutes(),
        's+':date.getSeconds()
    };
    for(let k in o){
        if(new RegExp(`(${k})`).test(fmt)){
            let str = o[k]+'';
            fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1)?str:padLeftZero(str));
        }
    }
    return fmt;
}
function padLeftZero(str) {
    return ('00'+str).substr(str.length);
}







