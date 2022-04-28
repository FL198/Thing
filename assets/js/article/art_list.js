$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    //定义时间过滤器
    template.defaults.imports.dateForm = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    initTable();
    initCate();

    function initTable() {
        $.ajax({
            url: '/my/article/list',
            method: 'GET',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!');
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }

    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败!');
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);

                //通知layui重新渲染表单区域的UI结构
                form.render();
            }
        })
    }

    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //触发jump回调的方式有两种：
            //1. 点击页码的时候，会触发,first处于undefined
            //2. 调用laypage.render()方法，就会触发 first处于true
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit; //最新的条目数
                if (!first) {
                    initTable();
                }
            }
        });

        $('body').on('click', '.btn-delete', function () {
            var len = $('.btn-delete').length;
            var id = $(this).attr('data-id');

            layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
                $.ajax({
                    url: '/my/article/delete/' + id,
                    method: 'GET',
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg('删除文章失败!');
                        }
                        layer.msg('删除文章成功!');
                        if (len === 1) {
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                        }
                        initTable();
                    }
                })
                layer.close(index);
            });
        })
    }
})