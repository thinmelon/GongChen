/**
 * 邮递员
 * @type {{xhr: null, createXmlHttpRequest: postman.createXmlHttpRequest, sendRequest: postman.sendRequest, abortRequest: postman.abortRequest}}
 */
var postman = {

    xhr: null,

    createXmlHttpRequest: function (_successCallback, _failedCallback) {
        // $("debug-message").innerHTML += "<br/>" + "postman    ==>    createXmlHttpRequest";
        if (postman.xhr !== null) {
            postman.abortRequest();
        } else {
            try {
                if (window.XMLHttpRequest) {
                    // code for IE7+, Firefox, Chrome, Opera, Safari
                    postman.xhr = new XMLHttpRequest();
                } else {
                    // code for IE6, IE5
                    postman.xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
            } catch (err) {
                throw "Create XMLHttpRequest failed! message:" + err.message;
            }
        }

        /**
         * readyState 存有 XMLHttpRequest 的状态。从 0 到 4 发生变化。
         0: 请求未初始化
         1: 服务器连接已建立
         2: 请求已接收
         3: 请求处理中
         4: 请求已完成，且响应已就绪
         status 状态
         200: "OK"
         400: 无法找到请求的资源
         401: 访问资源的权限不够
         403: 没有权限访问资源
         404: 未找到页面
         405: 需要访问的资源被禁止
         407: 访问的资源需要代理身份验证
         414: 请求的URL太长
         500: 服务器内部错误
         * */
        postman.xhr.onreadystatechange = function () {
            // $("debug-message").innerHTML += "<br/>" + "readyState ==> " + postman.xhr.readyState + " status ==>  " + postman.xhr.status;
            var
                contentType = "";

            if (postman.xhr.readyState === 4) {
                if (postman.xhr.status === 200) {
                    contentType = postman.xhr.getResponseHeader("Content-type");
                    // $("debug-message").innerHTML += "<br/>" + " ==>  success ==> Content-type: " + contentType + " ResponseType: " + postman.xhr.responseType;
                    if (contentType && contentType.indexOf("xml") >= 0) {
                        _successCallback(postman.xhr.responseXML);
                    } else {
                        _successCallback(postman.xhr.responseText);
                    }
                } else if (postman.xhr.status === 404) {
                    // $("debug-message").innerHTML += "<br/>" + " ==>  failed";
                    var _result = {
                        errcode: 404,
                        errmsg: "Not found! "
                    }
                    _failedCallback(JSON.stringify(_result));
                }
                // // $("debug-message").innerHTML += "<br/>" + " ==>  complete ==> ResponseText: " + postman.xhr.responseText;
            }
        }
    },

    sendRequest: function (_method, _url, _data) {
        // $("debug-message").innerHTML += "<br/>" + "postman    ==>    sendRequest";
        // 规定请求的类型、URL 以及是否异步处理请求
        postman.xhr.open(_method, _url, true);
        if ("GET" === _method) {
            postman.xhr.send(null);
        } else {
            // 向请求添加 HTTP 头（必需）
            // header: 规定头的名称
            // value: 规定头的值
            postman.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            // 将请求发送到服务器
            postman.xhr.send(_data);
        }
    }
    ,

    abortRequest: function () {
        if (postman.xhr !== null) {
            // $("debug-message").innerHTML += "<br/>" + "postman    ==>    abortRequest";
            postman.xhr.abort();        // 中止异步请求

        }
    }
};