$(function () {
    // 需求1：点击a链接，显示隐藏盒子
    $('#link_reg').click(function () {
        $('.login-box').hide();
        $(".reg-box").show();
    })
    $('#link_login').click(() => {
        $('.login-box').show();
        $(".reg-box").hide();
    })
    // 需求2：自定义layui校验规则
    let form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value, item) { //value：表单的值、item：表单的DOM对象
            let pwd = $('.reg-box input[name=password]').val();
            // console.log(value, pwd);
            if (value != pwd) {
                // 只要密码与确认密码不一致，就要用return结束，否则还会执行表单提交里面的内容
                return '两次输入的密码不一致';
            }
        }
    })
    // 需求3：注册用户
    let layer = layui.layer;
    $('#form_reg').on("submit", function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            url: '/api/reguser',
            type: 'post',
            data: {
                username: $(".reg-box input[name=username]").val(),
                password: $(".reg-box input[name=password]").val()
            },
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.alert(res.message, { icon: 5 });
                }
                layer.alert(res.message, { icon: 6 });
                // 跳转回登录页面
                $('#link_login').click();
                // 清空表单
                $('#form_reg')[0].reset();
            }
        })
    })
    // 需求4：用户登录
    $('#form_login').on("submit", function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            url: '/api/login',
            type: 'post',
            data: {
                username: $(".login-box input[name=username]").val(),
                password: $(".login-box input[name=password]").val()
            },
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.alert(res.message, { icon: 5 });
                }
                //跳转到后台页面
                location.href = "/index.html"
                //存储token
                localStorage.setItem('token', res.token)
            }
        })
    })
})