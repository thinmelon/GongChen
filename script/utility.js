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

    var i,
        j,
        tags = [],
        nodes,
        obj = {},
        childs = getChilds(frag),
        len = childs.length,
        attrs = frag.attributes;

    if (attrs !== null) {
        for (i = 0; i < attrs.length; i++) {
            obj[attrs[i].nodeName] = attrs[i].nodeValue;
        }
    }
    if (len === 0) {
        return obj;
    }
    else {
        for (i = 0; i < len; i++) {
            if (!inArray(childs[i].nodeName, tags)) {
                tags.push(childs[i].nodeName);
            }
        }

        for (i = 0; i < tags.length; i++) {
            nodes = getChildByTag(tags[i]);
            obj[tags[i]] = [];
            for (j = 0; j < nodes.length; j++) {
                obj[tags[i]].push(getValue(nodes[j]));
            }
        }
    }

    return obj;

    /**
     * 判断是否存在于数组
     * @param a
     * @param arr
     * @returns {boolean}
     */
    function inArray(a, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == a)
                return true;
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
        var a = [];
        if (c !== null) {
            for (var i = 0; i < c.length; i++) {
                if (c[i].nodeType !== 3)
                    a.push(c[i]);
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
        var i,
            a = [];
        for (i = 0; i < len; i++) {
            if (childs[i].nodeName == tag)
                a.push(childs[i]);
        }
        return a;
    }

    /**
     * 获取节点的文本，如果存在子节点则递归
     * @param node
     * @returns {*}
     */
    function getValue(node) {
        var i,
            c = getChilds(node),
            obj_arr = {};

        if (c.length === 0) {
            if (node.firstChild) {
                obj_arr.value = node.firstChild.nodeValue;
            }
            var attrs = node.attributes;
            if (attrs !== null) {
                for (i = 0; i < attrs.length; i++) {
                    obj_arr[attrs[i].nodeName] = attrs[i].nodeValue;
                }
            }
            return obj_arr;
        } else {
            return parseDom(node);
        }
    }
}

/**
 *
 * @param str
 * @returns {*}
 */
function parseJson(str) {

    eval('var val = ' + str + ';');
    return val;

}

/**
 *
 * @returns {string}
 */
Array.prototype.toJson = function () {
    var i,
        arr = [];
    for (i = 0; i < this.length; i++) {
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
    var p,
        arr = [],
        str = '';

    if (typeof this == 'object') {
        if (this instanceof Array) {
            return this.toJson();
        } else {
            for (p in this) {
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
    backUrl: "",

    isPc: 1, //显示审核预览：1；显示正式发布：0
    areaId: "21",//主栏目ID
    index_back_url: "",
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
    ],

    weather: "",
    temperature: "",
    windScale: ""
};

/*
 * 获取operator区域
 * */
function getOperator() {
    var operator,
        operatorKey,
        data,
        sysTable = DataAccess.getSystemPropertyTable();

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
    }
}

function getWeatherInfoSuccess(response) {
    // $("debug-message").innerHTML += "<br/>" + "getWeatherInfoSuccess ==> " + response;
    eval(response);
    paramObj.weather = iPanel.misc.getUserCharsetStr(mainArray[0].t0[0].weather, "UTF8");
    paramObj.temperature = iPanel.misc.getUserCharsetStr(mainArray[0].t0[0].temperature, "UTF8");
    paramObj.windScale = iPanel.misc.getUserCharsetStr(mainArray[0].t0[0].wind, "UTF8");

    if (typeof paramObj.temperature !== "undefined" && paramObj.temperature !== "undefined" && paramObj.temperature !== "") {
        document.getElementById("weather-forecast").innerHTML += "<br/>" +
            "今日天气：&nbsp;&nbsp;&nbsp;" + paramObj.weather +
            "&nbsp;&nbsp;&nbsp;" + paramObj.temperature +
            "&nbsp;&nbsp;&nbsp;" + paramObj.windScale;
        // setGlobalVar(__WEATHER__, paramObj.weather);
        // setGlobalVar(__TEMPERATURE__, paramObj.temperature);
        // setGlobalVar(__WINDSCALE__, paramObj.windScale);
    }
}

function getWeatherInfoFail(response) {
    // $("debug-message").innerHTML += "<br/>" + "getWeatherInfoFail ==> " + response;
    document.getElementById("weather-forecast").innerHTML += "<br/>" + "暂无天气信息";
}

function ajaxForWeather() {
    // $("debug-message").innerHTML += "<br/>" + "ajaxForWearther()";
    // getOperator();
    postman.createXmlHttpRequest(getWeatherInfoSuccess, getWeatherInfoFail);
    postman.sendRequest(
        "GET",
        // "http://10.215.0.36/weather/sy/" + paramObj.operator + ".js",
        "http://10.215.0.36/weather/sy/PUTIAN.js",
        ""
    );
}

(function () {
    // var weather,
    //     temperature,
    //     windScale;
    console.info("====== Load utility.js ======");

    if (document.getElementById("weather-forecast")) {
        if (paramObj.temperature.length === 0) {
            console.info("===>  ajaxForWeather");
            ajaxForWeather();
        } else {
            document.getElementById("weather-forecast").innerHTML += "<br/>" +
                "今日天气：&nbsp;&nbsp;&nbsp;" + paramObj.weather +
                "&nbsp;&nbsp;&nbsp;" + paramObj.temperature +
                "&nbsp;&nbsp;&nbsp;" + paramObj.windScale;
        }
        // weather = getGlobalVar("__WEATHER__");
        // temperature = getGlobalVar("__TEMPERATURE__");
        // windScale = getGlobalVar("__WINDSCALE__");
        // if (null !== weather && "" !== weather) {
        //     document.getElementById("weather-forecast").innerHTML += "<br/>" +
        //         "今日天气：&nbsp;&nbsp;&nbsp;" + weather +
        //         "&nbsp;&nbsp;&nbsp;" + temperature +
        //         "&nbsp;&nbsp;&nbsp;" + windScale;
        // } else {
        //     console.info("===>  ajaxForWeather");
        //     ajaxForWeather();
        // }
    }
})();

/*-----------------------------------------读写盒子全局变量代码---------------------------------*/
function getGlobalVar(_key) {
    if ("undefined" !== typeof(iPanel)) {
        return iPanel.getGlobalVar(_key) || "";
    } else {
        return getCookie(_key);
    }
}

function setGlobalVar(_key, _value) {
    if ("undefined" !== typeof(iPanel)) {
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
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    }
    else {
        return null;
    }
}
//删除cookies
function delCookie(name) {
    var cval,
        exp = new Date();

    exp.setTime(exp.getTime() - 1);
    cval = getCookie(name);
    if (cval !== null) {
        document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
    }
}


