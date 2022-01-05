$(function() {
    var layer = layui.layer
    var form = layui.form

    // 获取文章分类列表
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }



    // 为弹出层绑定一个点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        var indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#diglog-add').html(),
        });

    })


    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })
    var indexEdit = null
        // 通过代理的形式给btn-edit按钮绑定点击事件
    $('tbody').on('click', '#btn-edit', function(e) {
            e.preventDefault()
            var indexEdit = layer.open({
                type: 1,
                area: ['500px', '300px'],
                title: '添加文章分类',
                content: $('#diglog-edit').html(),
            });
            var id = $(this).attr('data-id')
            $.ajax({
                    method: 'GET',
                    url: '/my/article/cates/' + id,
                    // headers: {
                    //     Authorization: localStorage.getItem('token') || ''
                    // },
                    success: function(res) {
                        form.val('form-edit', res.data)
                    }
                })
                // 通过代理的形式给btn-edit按钮绑定点击事件
            $('body').on('submit', '#form-edit', function(e) {
                e.preventDefault()
                $.ajax({
                    method: 'POST',
                    url: '/my/article/updatecate',
                    // headers: {
                    //     Authorization: localStorage.getItem('token') || ''
                    // },
                    data: $(this).serialize(),
                    success: function(res) {
                        if (res.status !== 0) {
                            layer.msg('文章分类更新失败')
                        }
                        initArtCateList()
                        layer.msg('文章分类更新成功')
                            // 根据索引，关闭对应的弹出层
                        layer.close(indexEdit)
                    }
                })
            })

        })
        // 通过代理的形式给btn-delete按钮绑定点击事件
    $('tbody').on('click', '#btn-delete', function(e) {
        var id = $(this).attr('data-id')
        console.log(id);
        layer.confirm('确定删除此分类吗？', { icon: 3, title: '删除文章分类' }, function(index) {
            // 获取到对应的id然后发起ajax请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                // headers: {
                //     Authorization: localStorage.getItem('token') || ''
                // },
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }

                    layer.msg('删除分类成功')
                    initArtCateList()
                    layer.close(index);
                }
            })


        });
    })

})