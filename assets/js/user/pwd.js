// 自定义密码校验规则
$(function() {
    var form = layui.form
    var layer = layui.layer

    form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            samePwd: function(value) {
                if (value === $('[name=oldPwd]').val()) {
                    return '新旧密码不能相同！'
                }
            },
            rePwd: function(value) {
                if (value !== $('[name=newPwd]').val()) {
                    return '两次密码不一致！'
                }
            }
        })
        // 给表单添加一个提交监听事件
    $('.layui-form').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('密码重置失败！')
                }
                layer.msg('密码重置成功！')
                $('.layui-form')[0].reset()
            }
        })
    })
})