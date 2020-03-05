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

/*----------------------------------------- URL 解析器 ---------------------------------------*/

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

function parseUrlPrefix() {
    var prefix = window.location.href;

    if (prefix.indexOf("?") !== -1) {
        prefix = prefix.substr(0, prefix.indexOf("?"));
    }

    return prefix;
}

/*----------------------------------------- 视频返回结果 解析器 ---------------------------------------*/
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

    document.getElementById("debug-message").innerHTML += "<br/>" + " ==>     parseDom";

    if (attrs !== null) {
        for (i = 0; i < attrs.length; i++) {
            document.getElementById("debug-message").innerHTML += "<br/>" + "nodeName=" + attrs[i].nodeName + "  ===>  " + attrs[i].nodeValue;
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
            if (childs[i].nodeName === tag)
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

    if (typeof this === 'object') {
        if (this instanceof Array) {
            return this.toJson();
        } else {
            for (p in this) {
                if (typeof this[p] === 'function') break;
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

/*-----------------------------------------  中转站 ---------------------------------------*/
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
    subject: "",

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

        if (params.hasOwnProperty("subject")) {
            console.info("==>   subject = " + params["subject"]);
            transferStation.subject = params["subject"];
        }
    }

};

/*----------------------------------------- 参数配置 ---------------------------------------*/

var paramObj = {
    //serverUrl : "http://localhost:8080/manage/web/",
    //imgUrl : "http://localhost:8080/manage/",
    //serverUrl : "http://192.168.55.10:8080/manage/web/",		//  给电脑用的
    //imgUrl : "http://192.168.55.10:8080/manage/",
    serverUrl: "http://10.184.255.10:8080/manage/web/",		    //  给机顶盒用的
    imgUrl: "http://10.184.255.10:8080/manage/",
    backUrl: "",

    isPc: 1,                //显示审核预览：1；显示正式发布：0
    areaId: "21",           //主栏目ID
    index_back_url: "",

    /**
     * 首页
     */
    indexResourceIdArray: [
        {title: "首页", resourceId: ""},
        // ---------------  菜单  ---------------  //


        // ---------------  海报（播放视频）  ---------------  //
        {title: "左侧海报", resourceId: "698"},
        {title: "右侧海报", resourceId: "701"},

        // ---------------  列表  ---------------  //
        {title: "通知公告", resourceId: "700"}
    ],

    /**
     * 走进拱辰
     */
    introResourceIdArray: [
        {title: "走进拱辰", resourceId: "664"},
        // ---------------  菜单  ---------------  //

        // ---------------  海报（播放视频）  ---------------  //

        // ---------------  正文  ---------------  //
        {title: "简介", resourceId: "665"}
    ],

    /**
     * 平安建设
     */
    peaceResourceIdArray: [
        {title: "平安建设", resourceId: "666"},
        // ---------------  菜单  ---------------  //
        {title: "法制建设", resourceId: "678"},
        {title: "民生保障", resourceId: "679"},
        {title: "公共安防", resourceId: "680"},
        {title: "群众权益", resourceId: "681"},
        {title: "信息服务", resourceId: "682"},
        {title: "平安文化", resourceId: "683"},

        // ---------------  海报（播放视频）  ---------------  //
        {title: "顶部海报", resourceId: "684"},
        {title: "底部海报", resourceId: "702"},

        // ---------------  列表  ---------------  //
        {title: "最新信息", resourceId: "703"}
    ],


    /**
     * 政务公开
     */
    affairsResourceIdArray: [
        {title: "政务公开", resourceId: "667"},
        // ---------------  菜单  ---------------  //
        {title: "政策法规", resourceId: "691"},
        {title: "工作动态", resourceId: "692"},
        {title: "政府信息", resourceId: "693"},
        {title: "公示公告", resourceId: "694"},

        // ---------------  海报（播放视频）  ---------------  //
        {title: "顶部海报", resourceId: ""},
        {title: "底部海报", resourceId: ""},

        // ---------------  列表  ---------------  //
        {title: "通知公告", resourceId: "671"}
    ],

    /**
     * 智慧党建
     */
    buildingResourceIdArray: [
        {title: "智慧党建", resourceId: "660"},
        // ---------------  菜单  ---------------  //
        {title: "党的声音", resourceId: "710"},
        {title: "党建常识", resourceId: "695"},
        {title: "党的历程", resourceId: "709"},
        {title: "党风廉政", resourceId: "711"},
        {title: "拱辰先锋", resourceId: "696"},
        {title: "两学一做", resourceId: "697"},
        {title: "全国党员远教", resourceId: "713"},
        {title: "地市党员远教", resourceId: "712"},
        {title: "专题学习", resourceId: "714"},
        {title: "通知公告", resourceId: ""},

        // ---------------  海报（播放视频）  ---------------  //
        {title: "左侧海报", resourceId: "672"}

        // ---------------  列表  ---------------  //
    ],

    /**
     * 文明创建
     */
    cityResourceIdArray: [
        {title: "文明创建", resourceId: "662"},
        // ---------------  菜单  ---------------  //
        {title: "文明聚集", resourceId: "685"},
        {title: "美丽乡村", resourceId: "686"},
        {title: "道德建设", resourceId: "687"},
        {title: "传统文化", resourceId: "688"},
        {title: "城市管理", resourceId: "689"},
        {title: "主题活动", resourceId: "690"},
        {title: "志愿者服务", resourceId: ""},

        // ---------------  海报（播放视频）  ---------------  //
        {title: "顶部海报", resourceId: "704"},
        {title: "底部海报", resourceId: "706"},

        // ---------------  列表  ---------------  //
        {title: "最新消息", resourceId: "663"}
    ],

    /**
     * 服务大厅
     */
    serviceResourceIdArray: [
        {title: "服务大厅", resourceId: "669"},
        // ---------------  菜单  ---------------  //
        {title: "办事流程", resourceId: "675"},
        {title: "公共服务", resourceId: "676"},
        {title: "公积金查询", resourceId: ""},

        // ---------------  海报（播放视频）  ---------------  //
        {title: "左侧海报", resourceId: "707"},
        {title: "右侧海报", resourceId: "708"},

        // ---------------  列表  ---------------  //
        {title: "最新消息", resourceId: "670"}
    ],

    operator: "",
    weather: "",
    temperature: "",
    windScale: ""
};

/*----------------------------------------- 调试界面 ---------------------------------------*/

function Assistant() {
    this.toggle = function () {
        console.info(document.getElementById("debug-message").style.display);
        if (document.getElementById("debug-message").style.display === "block") {
            document.getElementById("debug-message").style.display = "none";
        } else {
            document.getElementById("debug-message").style.display = "block";
        }
    }
}

/*----------------------------------------- 分页器 ---------------------------------------*/

function PageHelper() {
    var that = this;

    this.offset_height = 0;
    this.scroll_height = 0;
    this.cur_page = 0;
    this.total_pages = 0;
    this.top = 0;

    this.turn = function (element, show, direction) {
        console.info("turn ==>  " + direction);
        console.info("Current: " + that.cur_page + " Total: " + that.total_pages);
        console.info("Before: Top - " + that.top);
        // console.info("offsetHeight: " + that.offset_height + " Total: " + that.scroll_height);
        if (direction > 0 && that.cur_page < that.total_pages) {
            that.top -= that.offset_height;
            element.style.top = that.top + "px";
            that.cur_page++;
            console.info("After: Top - " + that.top);
            console.info("Go to: " + that.cur_page);
            show.innerHTML = that.cur_page + "/" + that.total_pages;
        }
        else if (direction < 0 && that.cur_page > 1) {
            that.top += that.offset_height;
            element.style.top = that.top + "px";
            that.cur_page--;
            console.info("After: Top - " + that.top);
            console.info("Go to: " + that.cur_page);
            show.innerHTML = that.cur_page + "/" + that.total_pages;
        }
    };
}

/*----------------------------------------- 海报模块助手  ---------------------------------*/

function PostHelper() {
    var that = this;

    // 属性
    this.focusPos = 0;                // 记录光标在区域内的位置
    this.postItemArray = [];

    // 方法
    this.fetchVideoAssetId = function (resourceId, postItem, element) {
        var that = this,
            postman,
            url;

        postman = new Postman();
        url = paramObj.serverUrl +
            "queryTitleListMobile.shtml?resourceId=" + resourceId + "&num=1&cur_page=1";

        document.getElementById("debug-message").innerHTML += "<br/>" + " URL ==> " + url;

        postman.createXmlHttpRequest(
            function (html) {
                var i,
                    length,
                    json = eval('(' + html + ')');

                if ("1" === json.code || 1 === json.code) {
                    for (i = 0, length = json.dataArray.length; i < length; i++) {
                        postItem.url = "video.html?assetId=" + json.dataArray[i].assetid
                            + "&backUrl=" + encodeURIComponent(window.location.href) + "?focusArea=2&focusPos=" + that.focusPos;
                        document.getElementById("debug-message").innerHTML += "<br/>" + " add url into item ==> " + postItem.url;
                        // document.getElementById(element).src = paramObj.imgUrl + json.dataArray[i].img;
                        // document.getElementById("debug-message").innerHTML += "<br/>" + " set item image url as ==> " + document.getElementById(element).src;
                    }
                }
            },
            function (error) {
                document.getElementById("debug-message").innerHTML += "<br/>" + " ==> onFetchListFail ";
                document.getElementById("debug-message").innerHTML += "<br/>" + " Error ==> " + error;
            });
        postman.sendRequest(
            "GET",
            url,
            null
        );

    };

    this.init = function () {
        var i,
            length;

        console.info("PostHelper    =>  init");
        for (i = 0, length = this.postItemArray.length; i < length; i++) {
            if (this.postItemArray[i].resourceId !== "")
                this.fetchVideoAssetId(this.postItemArray[i].resourceId, this.postItemArray[i], this.postItemArray[i].element);
        }
    };

    this.focusOn = function () {

        var _focusNode = document.getElementById("self_ad_focus");
        _focusNode.style.visibility = "visible";
        _focusNode.style.left = that.postItemArray[this.focusPos].left + "px";
        _focusNode.style.top = this.postItemArray[this.focusPos].top + "px";
        _focusNode.style.width = this.postItemArray[this.focusPos].width + "px";
        _focusNode.style.height = this.postItemArray[this.focusPos].height + "px";

    };

    this.focusOut = function () {
        var _focusNode = document.getElementById("self_ad_focus");
        _focusNode.style.visibility = "hidden";
    };

    this.doSelect = function () {
        var link = that.postItemArray[that.focusPos].url;
        console.info(link);
        if ("" !== link) {
            window.location.href = link;
        }
    }
}

/*----------------------------------------- 图文列表助手  ---------------------------------*/

function ListHelper() {
    var that = this;

    // 属性
    this.focusPos = 0;
    this.listItemNum = 0;
    this.listItemArray = [];
    this.listItemTitleArray = [];

    this.itemLeft = 888;
    this.itemTop = 182;
    this.itemWidth = 365;
    this.itemHeight = 23;

    this.itemMoreLeft = 1088;
    this.itemMoreTop = 390;
    this.itemMoreWidth = 158;
    this.itemMoreHeight = 23;

    this.resourceId = "";

    this.init = function () {
        // var test = [
        //     {assetID: 611, title: '"美丽莆田 社会治理"司法行政创新现场会', img: '', flag: 0, id: 111},
        //     {assetID: 611, title: '建设美丽莆田行动纲要', img: '1', flag: 0, id: 111},
        //     {assetID: 611, title: '美丽港城 冉冉起', img: '1', flag: 0, id: 111},
        //     {assetID: 611, title: '"拱辰街道依法拆除违章建筑', img: '1', flag: 0, id: 111},
        //     {assetID: 611, title: '开启“智慧物流” 助力物畅其流', flag: 0, id: 111},
        //     {assetID: 611, title: '"美丽莆田 社会治理"司法行政创新现场会', flag: 0, id: 111},
        //     {assetID: 611, title: '建设美丽莆田行动纲要', img: '1', flag: 0, id: 111},
        //     {assetID: 611, title: '美丽港城 冉冉起', img: '1', flag: 0, id: 111}
        //
        // ];
        // this.addListItem(test);

        var that = this,
            postman = new Postman(),
            _url = paramObj.serverUrl +
                "queryTitleListMobile.shtml?resourceId=" + this.resourceId + "&num=" + (this.listItemNum + 1) + "&cur_page=1";

        if (this.resourceId !== "") {
            document.getElementById("debug-message").innerHTML += "<br/>" + " URL ==> " + _url;

            postman.createXmlHttpRequest(
                function (html) {
                    var json = eval('(' + html + ')');
                    document.getElementById("debug-message").innerHTML += "<br/>" + " URL:" + html;

                    if ("1" === json.code || 1 === json.code) {
                        that.addListItem(json.dataArray);
                    }
                },
                function (error) {
                    document.getElementById("debug-message").innerHTML += "<br/>" + " Error ==> " + error;
                });
            postman.sendRequest(
                "GET",
                _url,
                null
            );
        }
    };

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
                    img: array[j].img,
                    flag: parseInt(array[j].flag),
                    id: array[j].id
                });
            }
        }

        if (array.length > this.listItemNum) {
            this.listItemTitleArray.push({
                assetID: 0,
                title: "",
                img: "",
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

        if (that.focusPos < that.listItemArray.length) {
            _focusNode.style.left = that.listItemArray[that.focusPos].left + "px";
            _focusNode.style.top = that.listItemArray[that.focusPos].top + "px";
            _focusNode.style.width = that.listItemArray[that.focusPos].width + "px";
            _focusNode.style.height = that.listItemArray[that.focusPos].height + "px";
            document.getElementById("debug-message").innerHTML += "<br/>" + " List Object | Left ==> " + _focusNode.style.left + " Top ==>  " + _focusNode.style.top + " Width ==> " + _focusNode.style.width + " Height ==> " + _focusNode.style.height;

            var _focusListItem = document.getElementById("list_menu_" + that.focusPos);
            if ((typeof(_focusListItem) !== "undefined") && (that.listItemTitleArray[that.focusPos].flag === 0)) {
                showTitleForMarquee(that.listItemTitleArray[that.focusPos].title, _focusListItem.children[0], 13);
            }
        }
    };

    this.focusOut = function () {
        var _focusNode = document.getElementById("self_ad_focus");
        _focusNode.style.visibility = "hidden";

        var _focusListItem = document.getElementById("list_menu_" + that.focusPos);
        if ((typeof (_focusListItem) !== "undefined") && (that.listItemTitleArray[that.focusPos].flag === 0)) {
            _focusListItem.children[0].innerHTML = that.listItemTitleArray[that.focusPos].title;
        }
    };

    this.doSelect = function (focusPos, subject) {
        var _link = "";
        // "&focusArea=2&focusPos=" + focusPos +
        if (that.listItemTitleArray[focusPos].flag === 0) {         // 文字列表项
            if (that.listItemTitleArray[focusPos].img === "") {
                _link = "text.html?itemId=" + that.listItemTitleArray[focusPos].id + "&focusArea=2&focusPos=" + focusPos + "&subject=" + subject + "&backUrl=" + parseUrlPrefix();
            } else {
                _link = "list.html?itemId=" + that.listItemTitleArray[focusPos].id + "&focusArea=2&focusPos=" + focusPos + "&subject=" + subject + "&backUrl=" + parseUrlPrefix();
            }
        } else {                                                    // 更多内容
            // _link = "more.html?resourceId=" + paramObj.djjyResourceIdArray[0].resourceId;
        }
        document.getElementById("debug-message").innerHTML += "<br/>" + "LINK ==> " + _link;
        window.location.href = _link;
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
    document.getElementById("debug-message").innerHTML += "<br/>" + "getWeatherInfoFail ==> " + response;
    document.getElementById("weather-forecast").innerHTML = "";
}

function ajaxForWeather() {
    document.getElementById("debug-message").innerHTML += "<br/>" + "==>    ajaxForWearther()";
    var
        // _url = "http://10.215.0.36/weather/sy/" + paramObj.operator + ".js",
        _url = "http://10.215.0.36/weather/sy/PUTIAN.js",
        postman = new Postman();

    postman.createXmlHttpRequest(getWeatherInfoSuccess, getWeatherInfoFail);
    document.getElementById("debug-message").innerHTML += "<br/>" + "URL ==> " + _url;
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
    ajaxForWeather();
    // if (document.getElementById("weather-forecast")) {
    //     if (paramObj.temperature.length === 0) {
    //         console.info("===>  ajaxForWeather");
    //         // getOperator();
    //         // ajaxForWeather();
    //     } else {
    //         document.getElementById("weather-forecast").innerHTML += "<br/>" +
    //             "今日天气：&nbsp;&nbsp;&nbsp;" + paramObj.weather +
    //             "&nbsp;&nbsp;&nbsp;" + paramObj.temperature +
    //             "&nbsp;&nbsp;&nbsp;" + paramObj.windScale;
    //     }
    // }
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


