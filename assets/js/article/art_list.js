$(function() {
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询参数对象，将来请求数据的时候需要将这个对象发到服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几行数据
        cate_id: '', //文章分类id
        state: '', //文章发布状态
    }

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    initTable()
    initCate()


    //    获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败')
                }
                // 使用模板引擎渲染文章数据
                var htmlStr = template('tpl-list', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }


    // 获取分类下拉列表框的文章分类数据
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败')
                }

                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }


    // 实现筛选功能
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 重新向q对象里面赋值
        q.cate_id = cate_id
        q.state = state
        initTable()
    })


    // 渲染分页的功能
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几行数据
            limits: [2, 3, 5, 10],
            curr: q.pagenum, //默认显示第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
            // 分页发生切换时触发jump回调
            jump: function(obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    //do something
                    // 根据最新的q发起最新的ajax请求
                    initTable()
                }
            }
        });

    }

    // 通过代理的方式为删除按钮绑定点击事件（删除文章功能）
    $('body').on('click', '#btn-delete', function() {
        var len = $('#btn-delete').length;
        var id = $(this).attr('data-id')
        layer.confirm('确定要删除这条数据吗？', { icon: 3, title: '提示' }, function(index) {
            //调用删除文章数据的ajax请求
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        // 如果len的值等于1，证明删除过后页面上就没有任何数据了，所以页码值应该-1，然后重新调用initTable()请求文章列表数据
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }

            })
            layer.close(index);
        });
    })
})