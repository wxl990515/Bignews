$(function() {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function(res) {
                if (res.status !== 0) {

                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res);
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    //    实现表单的重置效果
    $('#btnReset').on('click', function(e) {
            // 阻止表单重置的默认行为
            e.preventDefault()
            initUserInfo()
        })
        // 实现表单数据的提交
        // 监听表单的提交事件
    $('.layui-form').submit(function(e) {
        e.preventDefault()
            // 发起ajax数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息更新失败！')
                }
                layer.msg('用户信息更新成功！')
                    // 调用父页面的函数方法
                window.parent.getUserInfo()

            }
        })
    })
})