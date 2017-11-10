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
    itemId: 0,              //  图文列表项ID

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

        if (params.hasOwnProperty("itemId")) {
            console.info("==>   itemId = " + params["itemId"]);
            transferStation.itemId = params["itemId"];
        }
    }

};

var paramObj = {
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

    introResourceIdArray: [
        {title: "走进拱辰", resourceId: "664"},
        {title: "通知公告", resourceId: "665"}
    ],

    buildingResourceIdArray: [
        {title: "智慧党建", resourceId: "660"}
    ],

    cityResourceIdArray: [
        {title: "平安建设", resourceId: "666"}
    ],

    affairsResourceIdArray: [
        {title: "政务公开", resourceId: "667"},
        {title: "通知公告", resourceId: "671"}
    ],

    peaceResourceIdArray: [
        {title: "文明创建", resourceId: "662"},
        {title: "通知公告", resourceId: "663"}
    ],

    serviceResourceIdArray: [
        {title: "服务大厅", resourceId: "669"},
        {title: "通知公告", resourceId: "670"}
    ],

    operator: "",
    weather: "",
    temperature: "",
    windScale: ""
};

/*----------------------------------------- 图文列表助手  ---------------------------------*/

function ListHelper() {
    // 属性
    this.listItemNum = 0;
    this.listItemArray = [];
    this.listItemTitleArray = [];

    this.itemLeft = 888;
    this.itemTop = 185;
    this.itemWidth = 378;
    this.itemHeight = 23;

    this.itemMoreLeft = 1088;
    this.itemMoreTop = 390;
    this.itemMoreWidth = 158;
    this.itemMoreHeight = 23;

    this.setListItemTitle = function () {
        var i,
            length;

        for (i = 0, length = this.listItemTitleArray.length; i < length; i++) {
            if (this.listItemTitleArray[i].flag === 0 || this.listItemTitleArray[i].flag === "0") {
                document.getElementById("list_menu_" + i).children[0].innerHTML = this.listItemTitleArray[i].title;
                document.getElementById("list_menu_" + i).children[0].style.color = "#000000";
                this.listItemArray.push({
                    left: this.itemLeft,
                    top: this.itemTop + (i * 35),
                    width: this.itemWidth,
                    height: this.itemHeight
                });
            } else {
                this.listItemArray.push({
                    left: this.itemMoreLeft,
                    top: this.itemMoreTop,
                    width: this.itemMoreWidth,
                    height: this.itemMoreHeight
                });
            }
        }
    };

    this.addListItem = function (array) {
        var j,
            length;

        while (this.listItemTitleArray.length > 0) {
            this.listItemTitleArray.pop();
        }

        while (this.listItemArray.length > 0) {
            this.listItemArray.pop();
        }

        for (j = 0, length = array.length; (j < length) && (j < this.listItemNum); j++) {

            if (array[j].flag === "0" || array[j].flag === 0) {
                this.listItemTitleArray.push({
                    assetID: array[j].assetid,
                    title: array[j].title,
                    flag: parseInt(array[j].flag),
                    id: array[j].id
                });
            }
        }

        if (array.length > this.listItemNum) {
            this.listItemTitleArray.push({
                assetID: 0,
                title: "",
                flag: -1,
                id: 0
            });
        }
        this.setListItemTitle();
    };

    this.removeAllListItem = function () {
        while (this.listItemTitleArray.length > 0) {
            this.listItemTitleArray.pop();
        }
        while (this.listItemArray.length > 0) {
            this.listItemArray.pop();
        }
    };

    this.focusOn = function () {

        var _focusNode = document.getElementById("self_ad_focus");
        _focusNode.style.visibility = "visible";

        _focusNode.style.left = this.listItemArray[this.focusPos].left + "px";
        _focusNode.style.top = this.listItemArray[this.focusPos].top + "px";
        _focusNode.style.width = this.listItemArray[this.focusPos].width + "px";
        _focusNode.style.height = this.listItemArray[this.focusPos].height + "px";

        var _focusListItem = document.getElementById("list_menu_" + this.focusPos);
        if ((typeof(_focusListItem) !== "undefined") && (this.listItemTitleArray[this.focusPos].flag === 0)) {
            showTitleForMarquee(this.listItemTitleArray[this.focusPos].title, _focusListItem.children[0], 13);
        }
    };

    this.focusOut = function () {
        var _focusNode = document.getElementById("self_ad_focus");
        _focusNode.style.visibility = "hidden";

        var _focusListItem = document.getElementById("list_menu_" + this.focusPos);
        if ((typeof (_focusListItem) !== "undefined") && (this.listItemTitleArray[this.focusPos].flag === 0)) {
            _focusListItem.children[0].innerHTML = this.listItemTitleArray[this.focusPos].title;
        }
    };
}

/*------------------------------------- 天气预报  ---------------------------------*/
/*
 * 获取operator区域
 */
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
    $("debug-message").innerHTML += "<br/>" + "getWeatherInfoFail ==> " + response;
    document.getElementById("weather-forecast").innerHTML = "暂无天气信息";
}

function ajaxForWeather() {
    $("debug-message").innerHTML += "<br/>" + "ajaxForWearther()";
    var
        // _url = "http://10.215.0.36/weather/sy/" + paramObj.operator + ".js",
        _url = "http://10.215.0.36/weather/sy/PUTIAN.js",
        postman = new Postman();

    postman.createXmlHttpRequest(getWeatherInfoSuccess, getWeatherInfoFail);
    $("debug-message").innerHTML += "<br/>" + "URL ==> " + _url;
    postman.sendRequest(
        "GET",
        // "http://10.215.0.36/weather/sy/" + paramObj.operator + ".js",
        _url,
        ""
    );
}

/**
 *  -   自运行
 */
(function () {
    console.info("====== Load utility.js ======");

    if (document.getElementById("weather-forecast")) {
        if (paramObj.temperature.length === 0) {
            console.info("===>  ajaxForWeather");
            // getOperator();
            ajaxForWeather();
        } else {
            document.getElementById("weather-forecast").innerHTML += "<br/>" +
                "今日天气：&nbsp;&nbsp;&nbsp;" + paramObj.weather +
                "&nbsp;&nbsp;&nbsp;" + paramObj.temperature +
                "&nbsp;&nbsp;&nbsp;" + paramObj.windScale;
        }
    }
})();

/*----------------------------------------- 读写盒子全局变量代码 ---------------------------------*/
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


