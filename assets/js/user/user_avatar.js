$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 2点击按钮，选择图片
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })
    // 3选择图片后，修改裁剪区域的图片
    let layer = layui.layer;
    $('#file').on('change', function (e) {
        // 拿到用户选择的文件
        let file = e.target.files[0];
        // console.log(file);
        // 非空校验
        if (file === undefined) {
            return layer.msg("用户头像为必传值！")
        }
        // 根据文件创建一个对应的URL路径
        let newImgURL = URL.createObjectURL(file);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 4修改头像
    $('#btnUpload').on('click', function () {
        // 获取 base64 格式的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // console.log(typeof dataURL)
        // console.log(dataURL)
        $.ajax({
            url: '/my/update/avatar',
            type: 'post',
            data: {
                avatar: dataURL
            },
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg(res.message, { icon: 6 });
                // 调用getUserInfo方法更换头像
                window.parent.getUserInfo();
            }
        })
    })
})