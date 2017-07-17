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
    //serverUrl : "http://localhost:8080/manage/web/",
    //imgUrl : "http://localhost:8080/manage/",
    //serverUrl : "http://192.168.55.10:8080/manage/web/",		//给电脑用的
    //imgUrl : "http://192.168.55.10:8080/manage/",
    serverUrl: "http://10.184.255.10:8080/manage/web/",		//给机顶盒用的
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