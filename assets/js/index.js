// 入口函数
$(function () {
    // 需求1: ajax获取用户信息，渲染到页面
    //   这个功能，后面其他的页面/模块还要用，所以必须设置为全局函数;
    getUserInfo();
    $('#btnLogout').click(() => {
        layui.layer.confirm('是否确定退出登录？?', { icon: 3, title: '提示' }, function (index) {
            //销毁token并跳转到登录页面
            localStorage.removeItem('token');
            location.href = '/login.html'
            // 关闭弹窗
            layer.close(index);
        });
    });

});


// 必须保证这个函数是全局的，后面其他功能要用
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     // 配置头信息，设置token，身份识别认证！
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: (res) => {
            // console.log(res);
            if (res.status == 0) {
                // 头像和用户名渲染
                renderAvatar(res.data);
            } else if (res.status != 0) {
                return layui.layer.msg(res.message, { icon: 5 });
            }
        }
        // complete: (res) => {
        //     // console.log(res.responseJSON);
        //     if(res.responseJSON.status==1){
        //          跳转到登录页面，销毁token
        //          localStorage.removeItem("token");
        //          location.href = "/login.html";
        //     }
        // }
    })
}

// 头像和文字渲染封装
function renderAvatar(user) {
    // console.log(user);
    // 1.渲染用户名，如果有昵称以昵称为准
    let name = user.nickname || user.username;
    $('#welcome').html("欢迎&nbsp;&nbsp;" + name);
    // 2.渲染头像; 判断图片头像是否存在
    if (user.user_pic == null) {
        // 头像照片为空，隐藏头像显示名字的第一个
        $('.layui-nav-img').hide();
        $('.text-avatar').show().html(name[0]);
    } else {
        $('.text-avatar').hide();
        $('.layui-nav-img').show().attr('src', user.user_pic);
    }

}
