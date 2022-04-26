//每次调用ajax前会先调用ajaxPrefilter函数，便于整体修改路径
$.ajaxPrefilter(function(options) { 
    options.url = "http://www.liulongbin.top:3007" + options.url;
})