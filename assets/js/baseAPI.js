//每次调用ajax前会先调用ajaxPrefilter，便于整体根路径修改
$.ajaxPrefilter(function(options) { 
    options.url = "http://www.liulongbin.top:3007" + options.url;
})