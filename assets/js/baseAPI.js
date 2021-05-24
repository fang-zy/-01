// $.ajaxPrefilter() 可以在调用 $.get() $.post() $.ajax() 方法之后，立即触发;
//   接收到 ajax 响应以后，也会触动这个方法;

// 开发环境服务器路径地址
let baseURL = 'http://api-breakingnews-web.itheima.net';
// // 测试环境服务器路径地址
// let baseURL = 'http://api-breakingnews-web.itheima.net';
// // 生产环境服务器路径地址
// let baseURL = 'http://api-breakingnews-web.itheima.net';


$.ajaxPrefilter(function (options) {
    // 如果是index.html页面，不需要添加前缀
    if (options.url === 'http://127.0.0.1:5500/index.html') {
        return;
    }
    // console.log(options);
    // 手动为 url 添加路径前缀
    // console.log('http://api-breakingnews-web.itheima.net' + options.url)
    options.url = baseURL + options.url;
    // 2. 包含 /my/ 路径的请求，就要手动添加 Authorization
    if (options.url.indexOf('/my/') != -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }
    // 3. 如果身份认证失败跳转到登录页面（登录拦截）
    // 无论请求成功还是请求失败，都会执行 complete
    options.complete = function (res) {
        // console.log(res.responseJSON)
        // 判断，如果状态码是1，错误信息是身份认证失败，那么就跳转到登录页面
        let obj = res.responseJSON;
        if (obj.status == 1 && obj.message === "身份认证失败！") {
            // 跳转到登录页面，销毁token
            localStorage.removeItem("token");
            location.href = "/login.html";
        }
    }
});


