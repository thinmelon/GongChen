/**
 * 邮递员
 * @type {{xhr: null, createXmlHttpRequest: postman.createXmlHttpRequest, sendRequest: postman.sendRequest, abortRequest: postman.abortRequest}}
 */
function Postman() {
    var that = this;

    this.xhr = null;
    this.method = "";

    this.createXmlHttpRequest = function (_successCallback, _failedCallback) {
        var that = this;

        document.getElementById("debug-message").innerHTML += "<br />" + "postman    ==>    createXmlHttpRequest";
        if (this.xhr !== null) {
            this.abortRequest();
        } else {
            try {
                if (window.XMLHttpRequest) {
                    // code for IE7+, Firefox, Chrome, Opera, Safari
                    this.xhr = new XMLHttpRequest();
                } else {
                    // code for IE6, IE5
                    this.xhr = new ActiveXObject("Microsoft.XMLHTTP");
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
        this.xhr.onreadystatechange = function () {
            document.getElementById("debug-message").innerHTML += "<br/>" + "readyState ==> " + that.xhr.readyState + " status ==>  " + that.xhr.status;
            var
                contentType = "";

            if (that.xhr.readyState === 4) {
                if (that.xhr.status === 200) {
                    contentType = that.xhr.getResponseHeader("Content-type");
                    document.getElementById("debug-message").innerHTML += "<br/>" + " ==>  success ==> Content-Type: " + contentType + " ResponseType: " + that.xhr.responseType;
                    document.getElementById("debug-message").innerHTML += "<br/>" + " responseXML: " + that.xhr.responseXML + " Type: " + typeof(that.xhr.responseXML);
                    document.getElementById("debug-message").innerHTML += "<br/>" + " responseText: " + that.xhr.responseText + " Type: " + typeof(that.xhr.responseText);
                    if (contentType && contentType.indexOf("xml") >= 0) {
                        _successCallback(that.xhr.responseXML);
                    } else {
                        if (that.method === "POST") {
                            _successCallback(that.xhr.responseXML);
                        }
                        else {
                            _successCallback(that.xhr.responseText);
                        }
                    }
                } else if (that.xhr.status === 404) {
                    document.getElementById("debug-message").innerHTML += "<br/>" + " ==>  failed";
                    _failedCallback("资源未找到");
                } else {
                    document.getElementById("debug-message").innerHTML += "<br/>" + " ==>  failed";
                    _failedCallback("错误");
                }
            }
        }
    };

    this.sendRequest = function (_method, _url, _data) {
        document.getElementById("debug-message").innerHTML += "<br/>" + "Postman    ==>    sendRequest";
        that.method = _method;
        // 规定请求的类型、URL 以及是否异步处理请求
        this.xhr.open(_method, _url, true);
        if ("GET" === _method) {
            this.xhr.send(null);
        } else {
            // 向请求添加 HTTP 头（必需）
            // header: 规定头的名称
            // value: 规定头的值
            // this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            this.xhr.setRequestHeader("Content-type", "application/xml;charset=utf-8");
            // 将请求发送到服务器
            this.xhr.send(_data);
        }
    };

    this.abortRequest = function () {
        if (this.xhr !== null) {
            document.getElementById("debug-message").innerHTML += "<br/>" + "postman    ==>    abortRequest";
            this.xhr.abort();        // 中止异步请求

        }
    }
}