(function(_win) {

    var globalPos = function() {

        this.index = "";
        var self = this;
        
        /* 当前浏览器类型，外部调用checkBrowser方法 */
        this.browserType = null;

        /* 当前iPanel浏览器版本，外部调用getBrowserVersion方法 */
        this.browserVersion = null;

        /**
         * @func
         * @desc 判断浏览器类型
         * @return {string} - 返回浏览器类型标识：'iPanel'、'Chrome'、'Firefox'、'Opera'、'Safari'、'IE'、'other'
         */
        this.checkBrowser = function() {
            if (this.browserType == null) {
                var userAgent = navigator.userAgent.toLowerCase();
                if (userAgent.indexOf('ipanel') != -1) {
                    this.browserType = 'iPanel';
                } else if (userAgent.indexOf('chrome') != -1) {
                    this.browserType = 'Chrome';
                } else if (userAgent.indexOf('firefox') != -1) {
                    this.browserType = 'Firefox';
                } else if (userAgent.indexOf('opera') != -1) {
                    this.browserType = 'Opera';
                } else if (userAgent.indexOf('safari') != -1) {
                    this.browserType = 'Safari';
                } else if (userAgent.indexOf('msie') != -1) {
                    this.browserType = 'IE';
                } else {
                    this.browserType = 'other';
                }
            }
            return this.browserType;
        };

        /**
         * @func
         * @desc 判断iPanel浏览器版本
         * @return {string} - 3.0或advanced或webview
         */
        this.getBrowserVersion = function() {
            var userAgent;
            if (this.browserVersion == null) {
                userAgent = navigator.userAgent.toLowerCase();
                if (userAgent.indexOf('ipanel') != -1) {
                    if (typeof(iPanelJavaInspector) != 'undefined') {
                        this.browserVersion = 'webview';
                    } else if (userAgent.indexOf('advanced') == -1) {
                        this.browserVersion = '3.0';
                    } else {
                        this.browserVersion = 'advanced';
                    }
                }
            }
            return this.browserVersion;
        };


        /* 设置和获取跨页面全局变量 */
        this.GlobalVar = {
            /**
             * @func
             * @desc 设置全局变量
             * @param {string} _key - [必选] 键名
             * @param {任意类型} _value - [必选] 键值
             * @return {object} this - 返回本身，可以连续设置多个，进行链式调用
             */
            set: function(_key, _value) {
                if (typeof _key != 'undefined' && typeof _value != 'undefined') {
                    if (self.checkBrowser() == "iPanel") {
                        iPanel.eventFrame.GMObj_globalVar[_key] = _value;
                    } else {
                        var tmpStr = JSON.stringify(_value);
                        sessionStorage.setItem(_key, tmpStr);
                    }
                }
                return this;
            },

            /**
             * @func
             * @desc 获取全局变量
             * @param {string} _key - [必选] 键名
             * @return {任意类型} - 存的键值，如果不存在则返回null
             */
            get: function(_key) {
                if (typeof _key != 'undefined') {
                    if (self.checkBrowser() == "iPanel") {
                        return (typeof iPanel.eventFrame.GMObj_globalVar[_key] != 'undefined' ? iPanel.eventFrame.GMObj_globalVar[_key] : null);
                    } else {
                        var tmpStr = sessionStorage.getItem(_key);
                        return (tmpStr != null ? JSON.parse(tmpStr) : null);
                    }
                } else {
                    return null;
                }
            },

            /**
             * @func
             * @desc 删除全局变量
             * @param {string} _key - [必选] 键名
             * @return {object} this - 返回本身，可以连续删除多个，进行链式调用
             */
            del: function(_key) {
                if (typeof _key != 'undefined') {
                    if (self.checkBrowser() == "iPanel") {
                        iPanel.eventFrame.GMObj_globalVar[_key] = null;
                    } else {
                        sessionStorage.removeItem(_key);
                    }
                }
                return this;
            }
        };

        /*this.GlobalVar.set('_globalPathStorage', {
            _backURLStorage: {},
            _lastStored: {}
        });*/

        if (!this.GlobalVar.get('_backURLStorage')) {
            this.GlobalVar.set('_backURLStorage', {});
            this.GlobalVar.set('_lastStored', {});
        }
        this.pathManager = {

            cacheBackURL: "",
            setBackURL: function(_nextURL, _backURL, _paramObj) {
                var backURLStorage = self.GlobalVar.get('_backURLStorage'),
                    nextURL = this.transAbsRoute(_nextURL),
                    backURL = this.transAbsRoute(_backURL),
                    paramObj = _paramObj || {};
					
				// 去掉端口号，防止获取backUrl时拿不到端口号,统一不保存端口号
				if (nextURL.indexOf(':') != -1) {
					nextURL = nextURL.replace(/:\d+/, '');
				}
                if (self.checkBrowser() == "iPanel") {
                   iPanel.debug('common common.js pathManager setBackURL nextURL = ' + nextURL + ' , backURL = ' + backURL);
                }
				

                // 清空缓存
                self.GlobalVar.set('_lastStored', {});
                this.cacheBackURL = '';
                // 判断是否有该索引的数组，没有则进行创建
                if (!backURLStorage[nextURL]) {
                    backURLStorage[nextURL] = [];
                }
                // 存进索引的数组
                backURLStorage[nextURL].push({
                    backURL: backURL,
                    paramObj: paramObj
                });
                // 写入存储
                self.GlobalVar.set('_backURLStorage', backURLStorage);
                // 存储成功之后，返回true
                return true;
            },
            getBackURL: function(_indexURL) {
                var backURLStorage = self.GlobalVar.get('_backURLStorage'),
                    indexURL = (_indexURL) ? this.transAbsRoute(_indexURL) : this.getCurrURL(),
                    backURL = '',
                    paramObj = {},
                    lastStored = {},
                    tempObj = null;
				
				// 兼容端口号存储不一致的问题导致获取不到返回数据
				if (indexURL.indexOf(':') != -1) {
					indexURL = indexURL.replace(/:\d+/, '');
				}
                if (self.checkBrowser() == "iPanel") {
					iPanel.debug('common common.js pathManager getBackURL indexURL = ' + indexURL);
                }

                // 判断当前是否有缓存返回地址，没有则取新的返回地址，有则返回缓存的
                if (this.cacheBackURL == '') {
                    if (backURLStorage[indexURL]) {
                        tempObj = backURLStorage[indexURL].pop();
                        backURL = tempObj.backURL;
                        paramObj = tempObj.paramObj;
                        this.cacheBackURL = backURL; // 缓存返回地址
                        lastStored = {};
						// 兼容端口号存储不一致的问题导致获取不到返回数据
						if (backURL.indexOf(':') != -1) {
							backURL = backURL.replace(/:\d+/, '');
						}
                        lastStored[backURL] = paramObj; // 把返回地址作为缓存参数的索引
                        // 当该索引的数组为空时，删除索引
                        if (backURLStorage[indexURL].length == 0) {
                            delete backURLStorage[indexURL];
                        }

                        self.GlobalVar.set('_backURLStorage', backURLStorage);
                        self.GlobalVar.set('_lastStored', lastStored);
                    }
                }
                return this.cacheBackURL;
            },
            /**
             * 获取返回参数的方法
             * @param  {String} _indexURL 索引地址，默认为当前地址，widget必须传绝对路径
             * @return {Object}           返回参数对象
             */
            getBackParam: function(_indexURL) {
                var indexURL = (_indexURL) ? this.transAbsRoute(_indexURL) : this.getCurrURL(),
                    lastStored = self.GlobalVar.get('_lastStored');

                // 清空缓存
                self.GlobalVar.set('_lastStored', {});
                this.cacheBackURL = '';
				
				
				// 兼容端口号存储不一致的问题导致获取不到返回数据
				if (indexURL.indexOf(':') != -1) {
					indexURL = indexURL.replace(/:\d+/, '');
				}

                // 判断是否有对应的索引参数对象，有则返回
                if (lastStored && lastStored[indexURL]) {
                    return lastStored[indexURL];
                }
            },

            /**
             * 重置返回地址的方法
             * @param  {String} _indexURL 索引地址，widget必须传绝对路径
             * @return {Null}             无返回值
             */
            resetBackURL: function(_indexURL) {
                var backURLStorage = self.GlobalVar.get('_backURLStorage'),
                    indexURL = _indexURL;

                if (indexURL == 'all') {
                    backURLStorage = {};
                } else {
                    indexURL = (indexURL) ? this.transAbsRoute(indexURL) : this.getCurrURL();
                    delete backURLStorage[indexURL];
                }
                self.GlobalVar.set('_lastStored', {});
                this.cacheBackURL = '';
                self.GlobalVar.set('_backURLStorage', backURLStorage);
            },
            /**
             * 判断地址是否为绝对路径，并把相对路径转换为绝对路径的方法
             * @param  {String} _URL 地址字符串
             * @return {String}      转换结果的绝对路径字符串
             */
            transAbsRoute: function(_URL) {
                var resURL = '',
                    currURL = this.getCurrURL(),
                    root = '',
                    currPath = '',
                    currPathArr = [],
                    resPathArr = [],
                    levelNum = 0;
                if (/:\//.test(_URL)) {
                    resURL = _URL;
                } else {
                    // 分解当前路径
                    root = currURL.split('//')[0],
                        currPath = currURL.split('//')[1];
                    currPathArr = currPath.split('/');
                    currPathArr.pop();

                    // 判断是哪种相对路径
                    // ..-含上级目录
                    if (/\.\.\//.test(_URL)) {
                        resPathArr = _URL.split('../');
                        // 根据下一个路径的数组长度来判断有多少层级
                        levelNum = resPathArr.length - 1;
                        // 逐层减少
                        for (; levelNum > 0; levelNum--) {
                            currPathArr.pop();
                            resPathArr.shift();
                        }
                    } else {
                        if (/\.\//.test(_URL)) {
                            // ./当前目录
                            resPathArr = _URL.split('./');
                            resPathArr.shift();
                        } else {
                            resPathArr = [_URL];
                        }
                    }
                    // 拼接路径
                    resPathArr = currPathArr.concat(resPathArr);
                    resURL = root + '//' + resPathArr.join('/');
                }
                return resURL;
            },
            getCurrURL: function() {
                if (self.checkBrowser() == "iPanel") {
                    return iPanel.mainFrame.location.href;
                } else {
                    return window.location.href;
                }
            }

        }

    };

    _win.GMObj = new globalPos();
})(window);
