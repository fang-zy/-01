$(function () {
    // 1获取文章分类
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
    // 2.初始化富文本编辑器
    initEditor()

    // 3.1. 初始化图片裁剪器
    var $image = $('#image')
    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    // 4.选择图片
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click();
    })

    // 5.选择文件，同步修改图片预览区
    $("#coverFile").on("change", function (e) {
        var file = e.target.files[0]
        // 非空校验
        if (file === undefined) {
            // $image
            // .cropper('destroy')  
            // .attr('src', "")
            return layer.msg("您可以选择一张图片，作为文章封面！")
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 6.参数状态值处理
    let state = "已发布";
    // $("#btnSave1").on("click", function () {
    //     state = "已发布";
    // })
    $("#btnSave2").on("click", function () {
        state = "草稿";
    })

    // 7.发布文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // ajax做文件上传，需要配合  FormData来构造数据
        let fd = new FormData(this);
        console.log(...fd);
        // 已经有3个参数，还需要把剩下的2个加进去
        // 把参数状态加进去
        fd.append("state", state);
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 把最后一个属性加进去
                fd.append("cover_img", blob);
                // console.log(...fd);
                // 封装发布文章的ajax
                publishArticle(fd);
            });
    })
    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/add',
            type: 'post',
            data: fd,
            processData: false,
            contentType: false,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 成功：提示，页面跳转
                layer.msg("恭喜您，发表文章成功！")
                // location.href = '/article/art_list.html';
                // 设置定时器，执行完弹出窗之后再执行页面跳转(刷新)
                setTimeout(function () {
                    window.parent.document.querySelector("#art_list").click();
                }, 1000);
            }
        })
    }
})