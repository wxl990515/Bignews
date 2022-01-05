$(function() {
    getUserInfo()

    var layer = layui.layer
    $('#btnLogout').on('click', function() {
        // 提示用户是否退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //确定退出后做的事情
            localStorage.removeItem('token')
            location.href = "/login.html"
            layer.close(index)
        });
    })
})

// 获取用户基本信息

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!')
                }
                renderAvatar(res.data)
            }
            // complete: function(res) {
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            //         // 强制清空token
            //         localStorage.removeItem('token')
            //             //强制跳转会登录界面
            //         location.href = '/login.html'
            //     }
            // }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    var name = user.nickname || user.username
        // 设置欢迎文本
    $('.welcome').html('欢迎 ' + name)
        // 按需渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}