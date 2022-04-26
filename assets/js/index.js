$(function () {
    getUserInfo();
    $('#btnLogout').on('click', function () {
        layui.layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
        });
    })
})

function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！');
            }
            renderAvatar(res.data);
        }
    })
}

function renderAvatar(userinfo) {
    var name = userinfo.nickname || userinfo.username;
    $('#welcome').html("欢迎&nbsp;&nbsp;" + name);
    if (userinfo.user_pic !== null) {
        $('.layui-nav-img').attr('src', userinfo.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}   
