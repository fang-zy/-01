$(function () {
    let form = layui.form;
    // 校验用户昵称
    form.verify({
        nickname: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value.trim().length < 1 || value.trim().length > 6) {
                return '用户昵称必须在 1 ~ 6 位之间！';
            }
        }
    });
    // 展示用户信息（后面这个功能还要用，所以封装成函数）
    let layer = layui.layer;
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 6 });
                }
                // 获取信息成功则将信息渲染到页面上
                form.val("formUserInfo", res.data);
            }
        })
    }
    // 重置
    // way1：给form表单绑定reset事件，然后阻止表单默认事件
    // $('form').on('reset',function (e) 
    // way2：给重置按钮绑定点击事件，然后阻止表单默认事件
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        // 用上面展示用户信息的方法重新渲染
        initUserInfo();
    })

    // 修改用户信息
    $('form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/userinfo',
            type: 'post',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg(res.message, { icon: 6 });
                console.log(window);
                console.log(window.parent);
                // 通过本页面的window找到父页面上window挂载的getUserInfo方法
                window.parent.getUserInfo();
            }
        })
    })
})