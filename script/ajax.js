/****************************ajax���� start**************************************/
function ajaxClass(_url, _successCallback, _failureCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
    /**
     * AJAXͨ��GET��POST�ķ�ʽ�����첽��ͬ����������
     * ע�⣺
     *    1��������240 No Content�Ǳ�HTTP��׼��Ϊ����ɹ���
     *    2��Ҫʹ��responseXML�Ͳ�������_charset����Ҫֱ�Ӵ���null
     *    3��_frame������ʵ�����������ҳ������뾡����֤׼ȷ������������Խ��͵��쳣
     */
    /**
     * @param{string} _url: ����·��
     * @param{function} _successCallback: ����ɹ���ִ�еĻص���������һ������������չһ������new XMLHttpRequest()�ķ���ֵ
     * @param{function} _failureCallback: ����ʧ��/��ʱ��ִ�еĻص�����������ͬ�ɹ��ص�������.status��.statusText
     * @param{string} _urlParameters: ����·������Ҫ���ݵ�url����/����
     * @param{*} _callbackParams: �������ʱ�ڻص������д���Ĳ������Զ�������
     * @param{boolean} _async: �Ƿ��첽���ã�Ĭ��Ϊtrue���첽��false��ͬ��
     * @param{string} _charset: ���󷵻ص����ݵı����ʽ������iPanel�������IE6��֧�֣���Ҫ����XML����ʱ����ʹ��
     * @param{number} _timeout: ÿ�η��������೤ʱ����û�гɹ�����������Ϊ����ʧ�ܶ��������󣨳�ʱ��
     * @param{number} _frequency: ����ʧ�ܺ���೤ʱ����������һ��
     * @param{number} _requestTimes: ����ʧ�ܺ�����������ٴ�
     * @param{object} _frame: ���������Ҫ�ϸ���ƣ�������п��ܳ���ҳ���Ѿ������٣��ص���ִ�е����
     */
    this.url = _url || "";
    this.successCallback = _successCallback || function (_xmlHttp, _params) {
            //Utility.println("[xmlHttp] responseText: " + _xmlHttp.responseText);
        };
    this.failureCallback = _failureCallback || function (_xmlHttp, _params) {
            //Utility.println("[xmlHttp] status: " + _xmlHttp.status + ", statusText: " + _xmlHttp.statusText);
        };
    this.urlParameters = _urlParameters || "";
    this.callbackParams = _callbackParams || null;
    this.async = typeof(_async) == "undefined" ? true : _async;
    this.charset = _charset || null;
    this.timeout = _timeout || 5000; //20s
    this.frequency = _frequency || 500; //10s
    this.requestTimes = _requestTimes || 1;
    this.frame = _frame || window;

    this.timer = -1;
    this.counter = 0;

    this.method = "GET";
    this.headers = null;
    this.username = "";
    this.password = "";

    this.createXmlHttpRequest = function () {
        var xmlHttp = null;
        try { //Standard
            xmlHttp = new XMLHttpRequest();
        } catch (exception) { //Internet Explorer
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (exception) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (exception) {
                    return false;
                }
            }
        }
        return xmlHttp;
    };
    this.xmlHttp = this.createXmlHttpRequest();

    this.requestData = function (_method, _headers, _username, _password) {
        document.getElementById("debug-message").innerHTML += "<br/>" + "===>   requestData     ==> method  ==> " + _method;
        /**
         * @param{string} _method: �������ݵķ�ʽ��POST/GET
         * @param{string} _headers: �������ݵ�ͷ��Ϣ��json��ʽ
         * @param{string} _username: ��������Ҫ��֤ʱ���û���
         * @param{string} _password: ��������Ҫ��֤ʱ���û�����
         */
        this.frame.clearTimeout(this.timer);
        this.method = typeof(_method) == "undefined" ? "GET" : (_method.toLowerCase() == "post") ? "POST" : "GET";
        this.headers = typeof(_headers) == "undefined" ? null : _headers;
        this.username = typeof(_username) == "undefined" ? "" : _username;
        this.password = typeof(_password) == "undefined" ? "" : _password;
        //Utility.println("[xmlHttp] method=" + this.method + "-->headers=" + _headers + "-->username=" + this.username + "-->password=" + this.password);
        var target = this;
        var url;
        var data;
        this.xmlHttp.onreadystatechange = function () {
            target.stateChanged();
        };
        if (this.method == "POST") { //encodeURIComponent
            url = encodeURI(this.url);
            data = this.urlParameters;
        } else {
            url = encodeURI(this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters));
            data = null;
        }
        //Utility.println("[xmlHttp] username=" + this.username + "-->xmlHttp=" + this.xmlHttp + "typeof(open)=" + typeof(this.xmlHttp.open));
        if (this.username != "") {
            this.xmlHttp.open(this.method, url, this.async, this.username, this.password);
        } else {
            this.xmlHttp.open(this.method, url, this.async);
        }
        //Utility.println("[xmlHttp] method=" + this.method + "-->url=" + url + "-->async=" + this.async);
        var contentType = false;
        if (this.headers != null) {
            for (var key in this.headers) {
                if (key.toLowerCase() == "content-type") {
                    contentType = true;
                }
                //Utility.println("common__contentType=" + contentType);
                this.xmlHttp.setRequestHeader(key, this.headers[key]);
            }
        }
        if (!contentType) {
            //Utility.println("[xmlHttp] setRequestHeader");
            //this.xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            //this.xmlHttp.setRequestHeader("Content-type","text/xml;charset=utf-8");
            this.xmlHttp.setRequestHeader("Content-type", "application/xml;charset=utf-8")
        }
        if (this.charset != null) { //Ҫʹ��responseXML�Ͳ������ô�����
            this.xmlHttp.overrideMimeType("text/html; charset=" + this.charset);
        }
        //Utility.println("[xmlHttp] " + this.method + " url: " + url + ", data: " + data);
        this.xmlHttp.send(data);
    };
    this.stateChanged = function () { //״̬����
        if (this.xmlHttp.readyState < 2) {
            //Utility.println("[xmlHttp] readyState=" + this.xmlHttp.readyState);
        } else {
            //Utility.println("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status);
        }

        var target = this;
        if (this.xmlHttp.readyState == 2) {
            this.timer = this.frame.setTimeout(function () {
                target.checkStatus();
            }, this.timeout);
        } else if (this.xmlHttp.readyState == 3) {
            if (this.xmlHttp.status == 401) {
                //Utility.println("[xmlHttp] Authentication, need correct username and pasword");
            }
        } else if (this.xmlHttp.readyState == 4) {
            this.frame.clearTimeout(this.timer);
            if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204) {
                this.success();
            } else {
                this.failed();
            }
        }
    };
    this.success = function () {
        if (this.callbackParams == null) {
            this.successCallback(this.xmlHttp);
        } else {
            this.successCallback(this.xmlHttp, this.callbackParams);
        }
        this.counter = 0;
    };
    this.failed = function () {
        if (this.callbackParams == null) {
            this.failureCallback(this.xmlHttp);
        } else {
            this.failureCallback(this.xmlHttp, this.callbackParams);
        }
        this.counter = 0;
    };
    this.checkStatus = function () { //��ʱ����ָ��ʱ����û�гɹ�������Ϣ����ʧ�ܴ���
        if (this.xmlHttp.readyState != 4) {
            if (this.counter < this.requestTimes) {
                this.requestAgain();
            } else {
                //Utility.println("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status + " timeout");
                this.failed();
                this.requestAbort();
            }
        }
    };
    this.requestAgain = function () {
        this.requestAbort();
        var target = this;
        this.frame.clearTimeout(this.timer);
        this.timer = this.frame.setTimeout(function () {
            //Utility.println("[xmlHttp] request again");
            target.counter++;
            target.requestData(target.method, target.headers, target.username, target.password);
        }, this.frequency);
    };
    this.requestAbort = function () {
        //Utility.println("[xmlHttp] call abort");
        this.frame.clearTimeout(this.timer);
        this.xmlHttp.abort();
        //Utility.println("[xmlHttp] call abort has called");
    };
    this.addParameter = function (_json) {
        /**
         * @param{object} _json: ���ݵĲ������ݴ���ֻ֧��json��ʽ
         */
        var url = this.url;
        var str = this.urlParameters;
        for (var key in _json) {
            if (url.indexOf("?") != -1) {
                url = "";
                if (str == "") {
                    str = "&" + key + "=" + _json[key];
                } else {
                    str += "&" + key + "=" + _json[key];
                }
                continue;
            }
            if (str == "") {
                str += "?";
            } else {
                str += "&";
            }
            str += key + "=" + _json[key];
        }
        this.urlParameters = str;
        return str;
    };
    this.getResponseXML = function () { //reponseXML of AJAX is null when response header 'Content-Type' is not include string 'xml', not like 'text/xml', 'application/xml' or 'application/xhtml+xml'
        if (this.xmlHttp.responseXML != null) {
            return this.xmlHttp.responseXML;
        } else if (this.xmlHttp.responseText.indexOf("<?xml") != -1) {
            return typeof(DOMParser) == "function" ? (new DOMParser()).parseFromString(this.xmlHttp.responseText, "text/xml") : (new ActivexObject("MSXML2.DOMDocument")).loadXML(this.xmlHttp.responseText);
        }
        return null;
    };
}

// function createXHR() {
//     if (typeof XMLHttpRequest !== "undefined") {
//         createXHR = function () {
//             return new XMLHttpRequest();
//         };
//     } else if (typeof ActiveXObject !== "undefined") {
//         createXHR = function () {
//             if (typeof arguments.callee.activeXString !== "string") {
//                 var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
//                 for (var i = 0, len = versions.length; i < len; i++) {
//                     try {
//                         var xhr = new ActiveXObject(versions[i]);
//                         arguments.callee.activeXString = versions[i];
//                         return xhr;
//                     } catch (ex) {
//                         //跳过
//                         if (len - 1 === i) {
//                             throw new Error("there is no xmlhttprequest object available");
//                         }
//                     }
//                 }
//             } else {
//                 return new ActiveXObject(arguments.callee.activeXString);
//             }
//         };
//     } else {
//         createXHR = function () {
//             throw new Error("there is no xmlhttprequest object available");
//         };
//     }
//     return createXHR();
// }
//
// function ajax(_optionsObj, _cfFlag, _time_out) {
//     var time_out = _time_out || new Date().getTime();
//     var optionsObj = {
//         // HTTP 请求类型
//         type: _optionsObj.type || "GET",
//         // 请求的文件类型
//         dataType: _optionsObj.dataType,
//         // 请求的URL
//         url: _optionsObj.url || "",
//         //请求方式，true异步请求，false同步请求
//         requestType: _optionsObj.requestType === false ? false : true,
//         // 请求的超时时间
//         time_out: _optionsObj.time_out || 10000,
//         // 请求成功.失败或完成(无论成功失败都会调用)时执行的函数
//         onComplete: _optionsObj.onComplete || function () {
//         },
//         onError: _optionsObj.onError || function () {
//         },
//         onSuccess: _optionsObj.onSuccess || function () {
//         },
//         // 服务器端默认返回的数据类型
//         data: _optionsObj.data || "",
//         post: _optionsObj.post || ""
//     };
//     var cfFlag = _cfFlag || true;
//
//     var ajaxZXFlag = true;
//     // 强制关闭函数
//     var timeOutRD = setTimeout(function () {
//         clearTimeout(timeOutRD);
//         ajaxZXFlag = false;
//         if (!cfFlag) {
//             ajax(optionsObj, true, time_out);
//         } else {
//             optionsObj.onError();
//
//             //var time_in = new Date().getTime();
//             //var time_c = time_in - time_out;
//             //$("msgvalue").innerHTML = "time : " + time_c + " timeOutRD readyState : " + xml.readyState + " and xml.status : " + xml.status;
//         }
//     }, optionsObj.time_out);
//
//     var xml = createXHR();
//     xml.onreadystatechange = function () {
//         console.info("ajax  ==>     readyState: " + xml.readyState);
//         if (xml.readyState === 4 && ajaxZXFlag) {
//             // 检查是否请求成功
//             clearTimeout(timeOutRD);
//             if (httpSuccess(xml) && ajaxZXFlag) {
//                 // 以服务器返回的数据作为参数执行成功回调函数
//                 optionsObj.onSuccess(httpData(xml, optionsObj.dataType));
//             } else {
//                 optionsObj.onError();
//                 //var time_in = new Date().getTime();
//                 //var time_c = time_in - time_out;
//                 //$("msgvalue").innerHTML = "time : " + time_c + " timeOutRD readyState : " + xml.readyState + " and xml.status : " + xml.status;
//             }
//
//             // 调用完成后的回调函数
//             optionsObj.onComplete(xml);
//             // 避免内存泄露,清理文档
//             xml = null;
//         }
//     };
//     var url;
//     if (optionsObj.url.indexOf("?") > -1) {
//         url = optionsObj.url + "&timestamp=" + new Date().getTime();
//     } else {
//         url = optionsObj.url + "?timestamp=" + new Date().getTime();
//     }
//     xml.open(optionsObj.type, url, optionsObj.requestType);
//     console.info("ajax  ==>     open: " + url);
//
//     if ("GET" === optionsObj.type) {
//         xml.send(null);
//     } else {
//         xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//         xml.send(optionsObj.post);
//     }
// }
//
// // 判断HTTP响应是否成功
// function httpSuccess(r) {
//     var flag = false;
//     try {
//         if ((r.status >= 200 && r.status <= 300) || r.status === 304) {
//             // 如果得不到服务器状态,且我们正在请求本地文件,则认为成功
//             flag = true;
//         } else if (!r.status && location.protocol === "file:") {
//             // 所有200-300之间的状态码 表示成功
//             flag = true;
//         } else if (navigator.userAgent.indexOf('Safari') >= 0 && typeof r.status === "undefined") {
//             // Safari在文档未修改的时候返回空状态
//             flag = true;
//         } else {
//             flag = false;
//         }
//     } catch (e) {
//         flag = false;
//     } finally {
//         return flag;
//     }
//
//     // 若检查状态失败,则假定请求是失败的
// }
//
// // 从HTTP响应中解析正确数据
// function httpData(r, type) {
//     // 获取content-type的头部
//     var ct = r.getResponseHeader("content-type");
//     // 如果没有提供默认类型, 判断服务器返回的是否是XML形式
//     var data = !type && ct && ct.indexOf('xml') >= 0;
//
//     console.info("content-type: " + ct + ",data:" + data);
//     $("message").innerHTML += "<br/>" + "content-type: " + ct + ",data:" + data;
//
//     // 如果是XML则获得XML对象 否则返回文本内容
//     data = type == "xml" || data ? r.responseXML : r.responseText;
//
//     // 如果指定类型是script,则以javascript形式执行返回文本
//     if (type === "script") {
//         eval.call(window, data);
//     }
//
//     // 返回响应数据
//     return data;
// }
//
//
// // 数据串行化 支持两种不同的对象
// // - 表单输入元素的数组
// // - 键/ 值 对应的散列表
// // - 返回串行化后的字符串 形式: name=john& password=test
// function serialize(a) {
//     // 串行化结果存放
//     var s = [];
//     // 如果是数组形式 [{name: XX, value: XX}, {name: XX, value: XX}]
//     if (a.constructor === Array) {
//         // 串行化表单元素
//         for (var i = 0; i < a.length; i++) {
//             s.push(a[i].name + "=" + encodeURIComponent(a[i].value));
//         }
//         // 假定是键/值对象
//     } else {
//         for (var j in a) {
//             s.push(j + "=" + encodeURIComponent(a[j]));
//         }
//     }
//     // 返回串行化结果
//     return s.join("&");
// }