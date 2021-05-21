// 入口函数
$(function () {
    // 需求1: ajax获取用户信息，渲染到页面
    //   这个功能，后面其他的页面/模块还要用，所以必须设置为全局函数;
    getUserInfo();

});


// 必须保证这个函数是全局的，后面其他功能要用
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        // 配置头信息，设置token，身份识别认证！
        headers: {
            Authorization: localStorage.getItem("token") || ""
        },
        success: function (res) {
            // console.log(res);
            if (res.status != 0) {
                return layui.layer.msg(res.message, {icon: 5});
            }
            // 头像和文字渲染
            renderAvatar(res.data);
        }
    });
}

// 头像和文字渲染封装
function renderAvatar(user) {
    // console.log(user);
    // 1.渲染用户名，如果有昵称以昵称为准
    let name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    // 2.渲染头像; 判断图片头像是否存在
    if (user.user_pic == null) {
        // 隐藏图片头像, 渲染文字头像
        $(".layui-nav-img").hide();
        $(".text-avatar").show().html(name[0].toUpperCase());
    } else {
        // 渲染图片头像，隐藏文字头像
        $(".layui-nav-img").show().attr("src", user.user_pic);
        $(".text-avatar").hide();
    }
}
