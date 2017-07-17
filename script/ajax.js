function createXHR() {
    if (typeof XMLHttpRequest != "undefined") {
        createXHR = function () {
            return new XMLHttpRequest();
        };
    } else if (typeof ActiveXObject != "undefined") {
        createXHR = function () {
            if (typeof arguments.callee.activeXString != "string") {
                var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
                for (var i = 0, len = versions.length; i < len; i++) {
                    try {
                        var xhr = new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                        return xhr;
                    } catch (ex) {
                        //跳过
                        if (len - 1 == i) {
                            throw new Error("there is no xmlhttprequest object available");
                        }
                    }
                }
            } else {
                return new ActiveXObject(arguments.callee.activeXString);
            }
        };
    } else {
        createXHR = function () {
            throw new Error("there is no xmlhttprequest object available");
        };
    }
    return createXHR();
}

function ajax(_optionsObj, _cfFlag, _time_out) {
    var time_out = _time_out || new Date().getTime();
    var optionsObj = {
        // HTTP 请求类型
        type: _optionsObj.type || "GET",
        // 请求的文件类型
        dataType: _optionsObj.dataType,
        // 请求的URL
        url: _optionsObj.url || "",
        //请求方式，true异步请求，false同步请求
        requestType: _optionsObj.requestType === false ? false : true,
        // 请求的超时时间
        time_out: _optionsObj.time_out || 10000,
        // 请求成功.失败或完成(无论成功失败都会调用)时执行的函数
        onComplete: _optionsObj.onComplete || function () {
        },
        onError: _optionsObj.onError || function () {
        },
        onSuccess: _optionsObj.onSuccess || function () {
        },
        // 服务器端默认返回的数据类型
        data: _optionsObj.data || "",
        post: _optionsObj.post || ""
    };
    var cfFlag = _cfFlag || true;

    var ajaxZXFlag = true;
    // 强制关闭函数
    var timeOutRD = setTimeout(function () {
        clearTimeout(timeOutRD);
        ajaxZXFlag = false;
        if (!cfFlag) {
            ajax(optionsObj, true, time_out);
        } else {
            optionsObj.onError();

            //var time_in = new Date().getTime();
            //var time_c = time_in - time_out;
            //$("msgvalue").innerHTML = "time : " + time_c + " timeOutRD readyState : " + xml.readyState + " and xml.status : " + xml.status;
        }
    }, optionsObj.time_out);

    var xml = createXHR();
    xml.onreadystatechange = function () {
        console.info("ajax  ==>     readyState: " + xml.readyState);
        if (xml.readyState == 4 && ajaxZXFlag) {
            // 检查是否请求成功
            clearTimeout(timeOutRD);
            if (httpSuccess(xml) && ajaxZXFlag) {
                // 以服务器返回的数据作为参数执行成功回调函数
                optionsObj.onSuccess(httpData(xml, optionsObj.dataType));
            } else {
                optionsObj.onError();
                //var time_in = new Date().getTime();
                //var time_c = time_in - time_out;
                //$("msgvalue").innerHTML = "time : " + time_c + " timeOutRD readyState : " + xml.readyState + " and xml.status : " + xml.status;
            }

            // 调用完成后的回调函数
            optionsObj.onComplete(xml);
            // 避免内存泄露,清理文档
            xml = null;
        }
    }
    var url;
    if (optionsObj.url.indexOf("?") > -1) {
        url = optionsObj.url + "&timestamp=" + new Date().getTime();
    } else {
        url = optionsObj.url + "?timestamp=" + new Date().getTime();
    }
    xml.open(optionsObj.type, url, optionsObj.requestType);
    console.info("ajax  ==>     open: " + url);

    if ("GET" == optionsObj.type) {
        xml.send(null);
    } else {
        xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xml.send(optionsObj.post);
    }
}

// 判断HTTP响应是否成功
function httpSuccess(r) {
    var flag = false;
    try {
        if ((r.status >= 200 && r.status <= 300) || r.status == 304) {
            // 如果得不到服务器状态,且我们正在请求本地文件,则认为成功
            flag = true;
        } else if (!r.status && location.protocol == "file:") {
            // 所有200-300之间的状态码 表示成功
            flag = true;
        } else if (navigator.userAgent.indexOf('Safari') >= 0 && typeof r.status == "undefined") {
            // Safari在文档未修改的时候返回空状态
            flag = true;
        } else {
            flag = false;
        }
    } catch (e) {
        flag = false;
    } finally {
        return flag;
    }

    // 若检查状态失败,则假定请求是失败的
}

// 从HTTP响应中解析正确数据
function httpData(r, type) {
    // 获取content-type的头部
    var ct = r.getResponseHeader("content-type");
    // 如果没有提供默认类型, 判断服务器返回的是否是XML形式
    var data = !type && ct && ct.indexOf('xml') >= 0;

    console.info("content-type: " + ct + ",data:" + data);
    $("message").innerHTML += "<br/>" + "content-type: " + ct + ",data:" + data;

    // 如果是XML则获得XML对象 否则返回文本内容
    data = type == "xml" || data ? r.responseXML : r.responseText;

    // 如果指定类型是script,则以javascript形式执行返回文本
    if (type == "script") {
        eval.call(window, data);
    }

    // 返回响应数据
    return data;
}


// 数据串行化 支持两种不同的对象
// - 表单输入元素的数组
// - 键/ 值 对应的散列表
// - 返回串行化后的字符串 形式: name=john& password=test

function serialize(a) {
    // 串行化结果存放
    var s = [];
    // 如果是数组形式 [{name: XX, value: XX}, {name: XX, value: XX}]
    if (a.constructor == Array) {
        // 串行化表单元素
        for (var i = 0; i < a.length; i++) {
            s.push(a[i].name + "=" + encodeURIComponent(a[i].value));
        }
        // 假定是键/值对象
    } else {
        for (var j in a) {
            s.push(j + "=" + encodeURIComponent(a[j]));
        }
    }
    // 返回串行化结果
    return s.join("&");
}