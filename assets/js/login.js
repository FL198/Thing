$(function () {
    $("#link_reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })
    $("#link_login").on("click", function () {
        $(".login-box").show();
        $(".reg-box").hide();
    })

    //从layui获取form对象
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        repwd: function (value) {
            var pwd = $(".reg-box [name=password]").val();
            if (pwd !== value)
                return "两次密码不一致!"
        }
    })

    // 监听注册表单提交事件
    $("#form_reg").on("submit", function(e) {
        e.preventDefault();
        var data = $("#form_reg").serialize();
        $.post("/api/reguser",
        data,
        function(res) {
            if(res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg("注册成功，请登录！");
            $("#link_login").click();
        })
    })

    // 监听登录表单提交事件
    $("#form_login").on("submit", function(e) {
        e.preventDefault();
        var data = $("#form_login").serialize();
        $.post("/api/login",
        data,
        function(res) {
            if(res.status !== 0) {
                return layer.msg("登录失败!");
            }
            layer.msg("登录成功!");
            localStorage.setItem("token",res.token);
            location.href = "/index.html";
        })
    })
})