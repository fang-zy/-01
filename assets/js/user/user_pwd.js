$(function () {
    let form = layui.form;
    // 校验用户昵称
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 新密码(不能和原密码重复)
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码不能和旧密码一致';
            }
        },
        // 确认新密码(必须和新密码一致)
        rePwd: function (value) {
            if (value != $('[name=newPwd]').val()) {
                return '两次输入的密码不一致';
            }
        }
    });
    // 2.修改密码
    $('form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/updatepwd',
            type: 'post',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg(res.message, { icon: 6 });
                // 页面中第一个form表单
                $('form')[0].reset();
            }
        })
    })
})