function $(_id) {
    return document.getElementById(_id);
}

/**
 * 标题文字长度超过_num，滚动显示
 * @param _title
 * @param _obj
 * @param _num
 */
function showTitleForMarquee(_title, _obj, _num) {
    if (_title.length > _num) {
        _obj.innerHTML = "<marquee>" + _title + "</marquee>";
    } else {
        _obj.innerHTML = _title;
    }
}

/***
 * 解析URL
 * @returns {{}}
 */
function parseRequestUrl() {

    var _url = window.location.search;
    var _request = {};

    if (_url.indexOf("?") !== -1) {
        var _str = _url.substr(1);
        var _subStrs = _str.split("&");

        for (var i = 0; i < _subStrs.length; i++) {
            _request[_subStrs[i].split("=")[0]] = decodeURIComponent(_subStrs[i].split("=")[1]);
            // console.info("key: " + _subStrs[i].split("=")[0] + ",value:" + _subStrs[i].split("=")[1]);
        }
    }

    return _request;

}

/**
 * 适用xml文件和dom文档
 * @param frag:dom对象, xml文件数据
 * @returns 返回一个可直接被引用的数据对象
 */
function parseDom(frag) {

    $("message").innerHTML += "<br/>" + "utility.js     ==>     parseDom";

    var obj = new Object;
    var childs = getChilds(frag);
    var len = childs.length;
    var attrs = frag.attributes;

    $("message").innerHTML += "<br/>" + "parseDom   ==>   children's length: " + len + " attribute's length:" + attrs.length;
    if (attrs != null) {
        for (var i = 0; i < attrs.length; i++) {
            $("message").innerHTML += "<br/>" + "nodeName=" + attrs[i].nodeName + ", nodeValue=" + attrs[i].nodeValue;
            obj[attrs[i].nodeName] = attrs[i].nodeValue;
        }
    }
    if (len == 0) {
        return obj;
    }
    else {
        var tags = new Array();
        for (var i = 0; i < len; i++) {
            if (!inArray(childs[i].nodeName, tags)) {

                $("message").innerHTML += "<br/>" + "parseDom   ==>     add " + childs[i].nodeName + " into tags array.";
                tags.push(childs[i].nodeName);

            }
        }

        for (var i = 0; i < tags.length; i++) {
            var nodes = getChildByTag(tags[i]);
            obj[tags[i]] = new Array;
            for (var j = 0; j < nodes.length; j++) {

                $("message").innerHTML += "<br/>" + "parseDom   ==>     attrName = " + tags[i];
                obj[tags[i]].push(getValue(nodes[j]));

            }
        }
    }

    // $("message").innerHTML += "<br/>" + "common.js     ==>     parseDom    ==>     Return obj";

    return obj;

    /**
     * 判断是否存在于数组
     * @param a
     * @param arr
     * @returns {boolean}
     */
    function inArray(a, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == a) return true;
        }
        return false;
    }

    /**
     * 获取非文本类型子节点
     * nodeType:1(元素element),2:(属性attr),3:(文本text),8:(注释comments),9:(文档documents)
     * @param node
     * @returns {Array}
     */
    function getChilds(node) {
        var c = node.childNodes;
        var a = new Array;
        if (c != null) {
            for (var i = 0; i < c.length; i++) {
                if (c[i].nodeType != 3) a.push(c[i]);
            }
        }
        return a;
    }

    /**
     * 根据节点名来获取元素集合
     * @param tag
     * @returns {Array}
     */
    function getChildByTag(tag) {
        var a = new Array;
        for (var i = 0; i < len; i++) {
            if (childs[i].nodeName == tag) a.push(childs[i]);
        }
        return a;
    }

    /**
     * 获取节点的文本，如果存在子节点则递归
     * @param node
     * @returns {*}
     */
    function getValue(node) {
        var c = getChilds(node);
        var obj_arr = new Object;
        if (c.length == 0) {
            if (node.firstChild) {
                $("message").innerHTML += "<br/>" + "getValue ==> firstChild: " + node.firstChild.nodeValue;
                obj_arr.value = node.firstChild.nodeValue;
            }
            var attrs = node.attributes;
            if (attrs != null) {
                for (var i = 0; i < attrs.length; i++) {
                    $("message").innerHTML += "<br/>" + "getValue ==> attribute name: " + attrs[i].nodeName + ", value: " + attrs[i].nodeValue;
                    obj_arr[attrs[i].nodeName] = attrs[i].nodeValue;
                }
            }
            return obj_arr;
        }
        else return parseDom(node);
    }
}

/**
 *
 * @param str
 * @returns {*}
 */
function parseJson(str) {

    $("message").innerHTML += "<br/>" + "==>    parseJson   ==>" + str;
    $("message").innerHTML += "<br/><br/><br/>";

    eval('var val = ' + str + ';');
    return val;

}

/**
 *
 * @returns {string}
 */
Array.prototype.toJson = function () {

    $("message").innerHTML += "<br/>" + "utility.js    ==>   Array.prototype.toJson";

    var arr = new Array;
    for (var i = 0; i < this.length; i++) {
        switch (typeof this[i]) {
            case 'number':
                arr[i] = this[i];
                break;
            case 'boolean':
                arr[i] = this[i];
                break;
            case 'string':
                arr[i] = '"' + this[i].replace(/"/g, '\\\"') + '"';
                break;
            case 'object':
                arr[i] = this[i].toJson();
                break;
        }
    }
    return '[' + arr.join(', ') + ']';
};

/**
 *
 * @returns {*}
 */
Object.prototype.toJson = function () {

    $("message").innerHTML += "<br/>" + "utility.js    ==>   Object.prototype.toJson";

    if (typeof this == 'object') {
        if (this instanceof Array) {
            return this.toJson();
        } else {
            var arr = new Array;
            var str = '';
            for (var p in this) {
                if (typeof this[p] == 'function') break;
                switch (typeof this[p]) {
                    case 'number':
                        str = this[p];
                        break;
                    case 'boolean':
                        str = this[p];
                        break;
                    case 'string':
                        str = '"' + this[p].replace(/"/g, '\\\"') + '"';
                        break;
                    case 'object':
                        str = this[p].toJson();
                        break;
                }
                arr.push(p + ':' + str);
            }
            return '{' + arr.join(', ') + '}';
        }
    } else return 'not object';
};

/***
 * Record URL params
 * @type {{idxFocusArea: number, idxFocusPos: number, idxFocusName: string, resourceId: number, type: number, assetId: string, backUrl: string, record: transferStation.record}}
 */
var transferStation = {

    idxFocusArea: 0,
    idxFocusPos: 0,
    idxFocusName: "",

    resourceId: 0,
    type: 0,

    assetId: "",            //  视频ID
    backUrl: "",            //  返回路径

    record: function () {

        var params = parseRequestUrl();

        if (params.hasOwnProperty("focusArea")) {

            console.info("==>   focusArea = " + params["focusArea"]);
            transferStation.idxFocusArea = parseInt(params["focusArea"]);

        }

        if (params.hasOwnProperty("focusPos")) {

            console.info("==>   focusPos = " + params["focusPos"]);
            transferStation.idxFocusPos = parseInt(params["focusPos"]);

        }

        if (params.hasOwnProperty("focusItemName")) {

            console.info("==>   focusItemName = " + params["focusItemName"]);
            transferStation.idxFocusName = params["focusItemName"];

        }

        if (params.hasOwnProperty("resourceId")) {

            console.info("==>   resourceId = " + params["resourceId"]);
            transferStation.resourceId = parseInt(params["resourceId"]);

        }

        if (params.hasOwnProperty("type")) {

            console.info("==>   type = " + params["type"]);
            transferStation.type = parseInt(params["type"]);

        }

        if (params.hasOwnProperty("assetId")) {

            console.info("==>   assetId = " + params["assetId"]);
            transferStation.assetId = params["assetId"];

        }

        if (params.hasOwnProperty("backUrl")) {

            console.info("==>   backUrl = " + params["backUrl"]);
            transferStation.backUrl = params["backUrl"];

        }
    }

};

var paramObj = {
    operator: "",
    //serverUrl : "http://localhost:8080/manage/web/",
    //imgUrl : "http://localhost:8080/manage/",
    //serverUrl : "http://192.168.55.10:8080/manage/web/",		//  给电脑用的
    //imgUrl : "http://192.168.55.10:8080/manage/",
    serverUrl: "http://10.184.255.10:8080/manage/web/",		    //  给机顶盒用的
    imgUrl: "http://10.184.255.10:8080/manage/",


    isPc: 1, //显示审核预览：1；显示正式发布：0
    areaId: "21",//主栏目ID
    index_back_url: "",
    //index_back_url : "http://10.215.0.8:80/tv_portal/index.htm?opk=4",
    index_url: "index.htm",

    mlylResourceIdArray: [
        {title: "民俗风情", resourceId: "505"},
        {title: "秀峰美景", resourceId: "506"},
        {title: "右侧大海报", resourceId: "507"}
    ],
    djjyResourceIdArray: [
        {title: "党员之家", resourceId: "508"}
    ],
    zzwgResourceIdArray: [
        //{title: "综治网格", resourceId: "105"}
        {title: "综治网格", resourceId: "501"}
    ],
    bmfwResourceIdArray: [
        {title: "便民服务首页栏目", resourceId: "502"},
        {title: "办事流程", resourceId: "509"}
    ],
    indexResourceIdArray: [
        {title: "首页左侧海报", resourceId: "503"}
    ]
};

/*获取operator区域*/
function getOperator() {
    var operator,
        data,
        sysTable = DataAccess.getSystemPropertyTable();

    $("debug-message").innerHTML += "<br/>" + "getOperator() ==> " + sysTable;
    if (sysTable > 0) {
        data = DataAccess.getProperty(sysTable, "operator");
        Utility.println("portal getOperator data=" + data);
        if (data !== null) {
            eval('var tmp=' + data);
            operatorKey = tmp.key;
            Utility.println("portal getOperator operatorKey=" + operatorKey);
            switch (operatorKey) {
                case 0:
                case "0":
                    operator = "";
                    break;
                case 1:
                case "1":
                    operator = "FUZHOU";
                    break;
                case 2:
                case "2":
                    operator = "NANPING";
                    break;
                case 3:
                case "3":
                    operator = "NINGDE";
                    break;
                case 4:
                case "4":
                    operator = "PUTIAN";
                    break;
                case 5:
                case "5":
                    operator = "SANMING";
                    break;
                case 6:
                case "6":
                    operator = "ZHANGZHOU";
                    break;
                case 7:
                case "7":
                    operator = "LONGYAN";
                    break;
                case 8:
                case "8":
                    operator = "QUANZHOU";
                    break;
                case 9:
                case "9":
                    operator = "XIAMEN";
                    break;
                case 10:
                case "10":
                    operator = "FUZHOU";
                    break;
                case 20:
                case "20":
                    operator = "FUZHOU";
                    break;
            }
        }
        paramObj.operator = operator;
        $("debug-message").innerHTML += "<br/>" + paramObj.operator;
    }
}

function getWeatherInfoSuccess(response) {
    var weather,
        temperature,
        windScale;
    // $("debug-message").innerHTML += "<br/>" + "getWeatherInfoSuccess ==> " + response;

    eval(response);
    weather = iPanel.misc.getUserCharsetStr(mainArray[0].t0[0].weather, "UTF8");
    temperature = iPanel.misc.getUserCharsetStr(mainArray[0].t0[0].temperature, "UTF8");
    windScale = iPanel.misc.getUserCharsetStr(mainArray[0].t0[0].wind, "UTF8");

    // $("debug-message").innerHTML += "<br/>" + "ajaxForWearther ==> weather" + weather;
    // $("debug-message").innerHTML += "<br/>" + "ajaxForWearther ==> temperature" + temperature;
    // $("debug-message").innerHTML += "<br/>" + "ajaxForWearther ==> windScale" + windScale;

    if (typeof temperature !== "undefined" && temperature !== "undefined" && temperature !== "") {
        $("weather-forecast").innerHTML += "<br/>" + "通知：&nbsp;&nbsp;&nbsp;今日天气&nbsp;&nbsp;&nbsp;" + weather + "&nbsp;&nbsp;&nbsp;" + temperature + "&nbsp;&nbsp;&nbsp;" + windScale;
    }
}

function getWeatherInfoFail(response) {
    // $("debug-message").innerHTML += "<br/>" + "getWeatherInfoFail ==> " + response;
    $("weather-forecast").innerHTML += "<br/>" + "暂无天气信息";
}

function ajaxForWeather() {
    // $("debug-message").innerHTML += "<br/>" + "ajaxForWearther()";
    // getOperator();
    postman.createXmlHttpRequest(getWeatherInfoSuccess, getWeatherInfoFail);
    postman.sendRequest(
        "GET",
        "http://10.215.0.36/weather/sy/PUTIAN.js",
        ""
    );
}

/*-----------------------------------------AJAX---------------------------------*/
// function createXHR() {
//     if (typeof XMLHttpRequest != "undefined") {
//         createXHR = function () {
//             return new XMLHttpRequest();
//         };
//     } else if (typeof ActiveXObject != "undefined") {
//         createXHR = function () {
//             if (typeof arguments.callee.activeXString != "string") {
//                 var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
//                 for (var i = 0, len = versions.length; i < len; i++) {
//                     try {
//                         var xhr = new ActiveXObject(versions[i]);
//                         arguments.callee.activeXString = versions[i];
//                         return xhr;
//                     } catch (ex) {
//                         //跳过
//                         if (len - 1 == i) {
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
//         if (xml.readyState === 4 && ajaxZXFlag) {
//             $("debug-message").innerHTML += "<br/>" + "onreadystatechange  ==> ajaxZXFlag" + ajaxZXFlag;
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
//     if ("GET" == optionsObj.type) {
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
//         if ((r.status >= 200 && r.status <= 300) || r.status == 304) {
//             // 如果得不到服务器状态,且我们正在请求本地文件,则认为成功
//             flag = true;
//         } else if (!r.status && location.protocol == "file:") {
//             // 所有200-300之间的状态码 表示成功
//             flag = true;
//         } else if (navigator.userAgent.indexOf('Safari') >= 0 && typeof r.status == "undefined") {
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
//
//     // 获取content-type的头部
//     var ct = r.getResponseHeader("content-type");
//     // 如果没有提供默认类型, 判断服务器返回的是否是XML形式
//     var data = !type && ct && ct.indexOf('xml') >= 0;
//
//     // 如果是XML则获得XML对象 否则返回文本内容
//     data = type == "xml" || data ? r.responseXML : r.responseText;
//
//     $("debug-message").innerHTML += "<br/>" + "httpData ==> " + data;
//
//     // 如果指定类型是script,则以javascript形式执行返回文本
//     if (type == "script") {
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
//     if (a.constructor == Array) {
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

/*-----------------------------------------读写盒子全局变量代码---------------------------------*/
function getGlobalVar(_key) {
    if ("undefined" != typeof(iPanel)) {
        return iPanel.getGlobalVar(_key) || "";
    } else {
        return getCookie(_key);
    }
}

function setGlobalVar(_key, _value) {
    if ("undefined" != typeof(iPanel)) {
        iPanel.setGlobalVar(_key, _value + "");
    } else {
        setCookie(_key, _value + "");
    }
}

//写cookies
function setCookie(name, value) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
}
//读取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
}
//删除cookies
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
}
