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

    assetId: "",         // 视频
    backUrl: "",

    record: function () {

        var paramObj = parseRequestUrl();

        if (paramObj.hasOwnProperty("focusArea")) {

            console.info("==>   focusArea = " + paramObj["focusArea"]);
            transferStation.idxFocusArea = parseInt(paramObj["focusArea"]);

        }

        if (paramObj.hasOwnProperty("focusPos")) {

            console.info("==>   focusPos = " + paramObj["focusPos"]);
            transferStation.idxFocusPos = parseInt(paramObj["focusPos"]);

        }

        if (paramObj.hasOwnProperty("focusItemName")) {

            console.info("==>   focusItemName = " + paramObj["focusItemName"]);
            transferStation.idxFocusName = paramObj["focusItemName"];

        }

        if (paramObj.hasOwnProperty("resourceId")) {

            console.info("==>   resourceId = " + paramObj["resourceId"]);
            transferStation.resourceId = parseInt(paramObj["resourceId"]);

        }

        if (paramObj.hasOwnProperty("type")) {

            console.info("==>   type = " + paramObj["type"]);
            transferStation.type = parseInt(paramObj["type"]);

        }

        if (paramObj.hasOwnProperty("assetId")) {

            console.info("==>   assetId = " + paramObj["assetId"]);
            transferStation.assetId = paramObj["assetId"];

        }

        if (paramObj.hasOwnProperty("backUrl")) {

            console.info("==>   backUrl = " + paramObj["backUrl"]);
            transferStation.backUrl = paramObj["backUrl"];

        }
    }

};

function $(_id) {
    return document.getElementById(_id);
}

function parseRequestUrl() {

    var _url = window.location.search;
    var _request = new Object();

    if (_url.indexOf("?") != -1) {
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