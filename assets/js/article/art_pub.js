$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()

    //定义文章加载分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: 'http://api-breakingnews-web.itheima.net/my/article/cates',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('文章分类获取失败')
                }
                // 调用模板引擎渲染分类下拉选择框
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 注意！一定要调用form.render()函数
                form.render()
            }
        })
    }
    //初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮绑定点击事件处理函数
    $('#btn-Submit').on('click', function(e) {
            $('#coverFile').click()
        })
        // 为文件选择框绑定 change 事件
    $('#coverFile').on('change', function(e) {
        // 获取用户选择的文件
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择照片！')
        }

        // 1. 拿到用户选择的文件
        var file = e.target.files[0]
            // 2. 将文件，转化为路径
        var imgURL = URL.createObjectURL(file)
            // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'
        // 为存为草稿按钮绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 为表单绑定submit 提交事件
    $('#form-pub').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault()
            // 基于form表单快速创建一个FormData对象
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将得到的图片文件追加到FormData对象当中
                fd.append('cover_img', blob)
                    //发起ajax请求
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: 'http://api-breakingnews-web.itheima.net/my/article/add',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发表文章失败')
                }
                location.href = 'art_list.html'
            }
        })

    }
})