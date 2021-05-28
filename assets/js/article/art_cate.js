$(function () {
    // 1.渲染文章分类列表(后面添加，删除，修改还要范霍夫调用，封装成函数)
    let layer = layui.layer;
    initArtCateList();
    // 1、函数封装
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: (res) => {
                console.log(res);
                let htmlStr = template('tpl-art-cate', {
                    data: res.data
                });
                $('tbody').html(htmlStr);
            }
        })
    }
    // 2、添加文章分类
    let indexAdd = null;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });
    // 3、因为添加分类是动态生成的，因此需要事件委托
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/addcates',
            type: 'post',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                // 清空form，重构文章分类列表，关闭对话框
                $('#form-add')[0].reset();
                initArtCateList();
                layer.close(indexAdd);
                layer.msg(res.message, { icon: 6 });
            }
        })
    })
    // 4.修改文章分类 html结构 （事件代理）
    let indexEdit = null;
    let form = layui.form;
    $('body').on('click', '.btn-edit', function () {
        // 先弹出form表单
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        let Id = $(this).attr('data-id');
        $.ajax({
            url: '/my/article/cates/' + Id,
            type: 'get',
            data: { id: Id },
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染
                form.val("form-edit", res.data);
            }
        })
    })
    // 5.用事件代理完成 修改文章分类
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/updatecate',
            type: 'post',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                // 关闭窗口并重新渲染页面
                initArtCateList();
                layer.close(indexEdit);
                layer.msg(res.message, { icon: 6 });
            }
        })
    })
    // 6.删除btn-delete
    $('body').on('click', '.btn-delete', function () {
        let Id = $(this).attr('data-id');
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                type: 'get',
                // data: $(this).serialize(),
                success: (res) => {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 关闭窗口并重新渲染页面
                    initArtCateList();
                    layer.msg(res.message, { icon: 6 });
                }
            })
        })
    })
})