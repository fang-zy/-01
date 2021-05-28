$(function () {
    // 2. 向模板引擎中导入 变量/函数
    template.defaults.imports.dataFormat = function (dataStr) {
        let dt = new Date(dataStr);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());
        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    // 月日时分秒若小于10，则在前面+0，否则保持原样
    function padZero(num) {
        return num < 10 ? "0" + num : num;
    }
    // 文章列表和筛选和分页都要用到参数，所以提升为全局的
    let q = {
        pagenum: 1,   // 是	int	    页码值
        pagesize: 2,	// 是	int	    每页显示多少条数据
        cate_id: "",   // 否	string	文章分类的 Id
        state: "",   // 否	string	文章的状态，可选值有：已发布、草稿
    }


    // 1.初始化文章列表（后面还要用，封装成函数）
    let layer = layui.layer;
    initTable();
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            type: 'get',
            data: q,
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                let htmlStr = template('tpl-table', {
                    data: res.data
                });
                $('tbody').html(htmlStr);
                // 文章列表初始化完毕做分页
                renderPage(res.total);
            }
        })
    }
    // 3.初始化文章分类
    initCate();
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 渲染
                let htmlStr = template('tpl-cate', {
                    data: res.data
                })
                $('[name=cate_id]').html(htmlStr);
                layui.form.render();
            }
        })
    }

    // 4.筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 将选中的分类和状态存入变量并赋值给获取文章列表时要用到的参数
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        // 再次渲染文章列表
        initTable();
    })

    // 5.分页
    function renderPage(total) {
        // console.log(total);
        layui.laypage.render({
            elem: 'pageBox', // 注意，这里的 pageBox 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条
            curr: q.pagenum, // 初始化页面
            // 自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                //首次不执行
                if (!first) {
                    //do something
                    q.pagenum = obj.curr;
                    q.pagesize = obj.limit;
                    // 重新渲染列表
                    initTable();
                }
            }
        });
    }

    // 6.删除
    $('tbody').on('click', '.btn-delete', function () {
        let Id = $(this).attr('data-id');
        console.log(1);
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + Id,
                type: 'get',
                data: { id: Id },
                success: (res) => {
                    console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    // 成功：提示，更新页面数据
                    layer.msg("恭喜您，删除文章成功！");
                    if ($(".btn-delete").length === 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }
                    initTable();
                    layer.close(index);
                }
            })
        });
    })


})