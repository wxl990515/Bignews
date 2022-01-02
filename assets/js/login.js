// 点击'去注册账号'的链接
$('#link_reg').on('click', function() {
    $('.login-box').hide()
    $('.reg-box').show()
})

// 点击“去登录”的链接
$('#link_login').on('click', function() {
    $('.reg-box').hide()
    $('.login-box').show()
})

// 从layui中获取from对象
var form = layui.form
var layer = layui.layer
form.verify({
    pass: [
        /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
    ],
    repass: function(value) {
        var pass = $('.reg-box [name=password]').val()
        if (pass !== value) {
            return '两次密码不一致！'
        }
    }
})


// 监听注册表单的提交事件
$('#form_reg').on('submit', function(e) {
    e.preventDefault()
    var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    $.post('/api/reguser', data, function(res) {
        if (res.status !== 0) {
            return layer.msg(res.message)
        }
        layer.msg('注册成功！')
            // 注册成功自动跳转到登录界面
        $('#link_login').click()
    })
})

// 监听登录表单的登录事件
$('#form_login').submit(function(e) {
    e.preventDefault()
    $.ajax({
        method: 'POST',
        url: '/api/login',
        data: $('#form_login').serialize(),
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('登录失败！')
            }
            layer.msg('登陆成功！')
                // 将登陆成功得到的token字符串保存到localStorage
            localStorage.setItem('token', res.token)
            location.href = "/index.html"
        }
    })
})