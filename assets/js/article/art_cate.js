$(function () {
    var layer = layui.layer;
    var form = layui.form;

    intiArtCateList();
    function intiArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })
    //通过代理，因为form是在点击之后才出现的
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败!');
                }
                intiArtCateList();
                layer.msg('新增分类成功!');
                layer.close(indexAdd);
            }
        })
    })

    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id');
        $.ajax({
            url: '/my/article/cates/' + id,
            method: 'GET',
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            url:'/my/article/updatecate',
            method:'POST',
            data:$(this).serialize(),
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新分类数据失败!');
                }
                intiArtCateList();
                layer.msg('更新分类数据成功!');
                layer.close(indexEdit);
            }
        })
    })

    $('tbody').on('click','.btn-delete',function() {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                url:'/my/article/deletecate/' + id,
                method:'GET',
                success:function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除分类失败!');
                    }
                    layer.msg('删除分类成功!');
                    layer.close(index);
                    intiArtCateList();
                }
            })
          });
    })
})