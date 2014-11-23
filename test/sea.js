define('sys/main',["./browser","./config","./util","./storage","./status-manager"],function(require, exports, module) {
var Browser = require("./browser"),
    Config = require("./config"),
    Util = require("./util"),
    Storage = require("./storage"),
    StatusManager = require("./status-manager");


var STATUS = Config.STATUS;
    ICONS = Config.ICONS,
    errorStorage = Storage.alloc("error"),
    uDataStorage = Storage.alloc("udata");

//aplus页面  重新触发一次点击事件
function aplus() {

    function aplus_init() {
        window.TBI && TBI.Aplus.pageClick.processor.showPv();
    }

    var script = document.createElement("script"),
        head = document.querySelector("head");
    script.text='('+ aplus_init.toString() +')()';
    head.appendChild(script);
}

module.exports = {
    init: function() {
        localStorage["installed"] = 1; //安装标识
        this.currentTab = null;
        this.isRunning = StatusManager.isRunningStatus();
        if(!StatusManager.isFirstLoginInCurrentVersion()) {
            this.isRunning = true;
            StatusManager.changeRunningStatus(true);
        }
        this.status = StatusManager.isRunningStatus() ? STATUS.RUNNING : STATUS.STOPPED;
        this.setIcon(STATUS.RUNNING);
        this.initEnv().initEvent();
    },

    start: function(tab) {
        var id = tab.id||tab.tabId,
            url = tab.url;

        var all = Config.isAplus(url);
        this.setIcon(STATUS.RUNNING);
        Browser.clearPopUp();
        errorStorage.remove(id);
        var query = Util.queryString(url.split('?')[1]);
        var kissy = Config.kissy4;
        if(query.hasOwnProperty("ukissy5")) {
            kissy = Config.kissy5;
        }

        Util.injectKISSY(kissy,id, all, function () {
            Util.injectScript(id,{ all:all,path: Config.start + "?" +Date.now()});
        });

    },

    initEnv: function() {

        var self = this,
            index = 0;

        chrome.webNavigation.onCommitted.addListener(function (tab) {

            var tabId = tab.tabId;
            if(!self.isRunning) {
                return;
            }
            if(tab.frameId !==0) {
                return;
            }
            var items = tab.url.split("?"),
                query = Util.queryString(items[1]);


            if(/\.js$/.test(items[0]) && query.hasOwnProperty("udebug")) {

                chrome.tabs.executeScript({
                    code: 'location.href="' + Config.urls.debug + '?src='+encodeURIComponent(tab.url)+'"',
                    allFrames:true
                });
                return;
            }


            if(!Config.isValidUrl(tab.url)) {
                self.setIcon(STATUS.ERROR);
                errorStorage.set(tabId, {type:"spm"});
                return;
            }

            if(tab.frameId == 0) {
                localStorage["loading"] = "loading";
                Browser.setPopup("popup/popup.html");

                if(!self.timer) {
                    self.timer = setInterval(function() {
                        if(!localStorage["loading"]) {
                            return;
                        }
                        index = ++index%5;
                        var path ="/image/loading/"+(index+1)+".png";
                        chrome.browserAction.setIcon({path:path});
                    },300);
                }
            }
        })


        // onCompleted
        //注意此处不要使用 onDOMContentLoaded  ，修复旺旺点进来的链接udata抛出KISSY为定义异常,onDOMContentLoaded 会触发2次
        chrome.webNavigation.onCompleted.addListener(function (tab) {
            if(!self.isRunning) {
                return;
            }
            var tabId = tab.tabId,
                all = Config.isAplus(tab.url);

            //aplus点击离线数据时外面页面不会reload，只是里面得iframe会刷新
            if(tab.frameId !==0 && !all) {
                return;
            }

            var items = tab.url.split("?"),
                query = Util.queryString(items[1]);

            if(!Config.isValidUrl(tab.url)) {
                self.setIcon(STATUS.ERROR);
                errorStorage.set(tabId, {type:"spm"});
                return;
            }

            if(self.timer) {
                clearInterval(self.timer);
                self.timer = null;
            }

            delete localStorage["loading"];

            self.start(tab);

        });

        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            request.all = Config.isAplus(sender.url);

            var query = sender.url && sender.url.split("?")[1];
            if(request.type == 'loadjs'){
                var tabId = sender.tab.id;
                var wait = true;
                request.debug = query && Util.queryString(query).hasOwnProperty("debug");
                Util.injectScript(tabId, request, function () {
                    sendResponse({
                        ok: 1
                    });
                    wait = false;
                });
                return wait;
            }
            self.handleOnMessage.apply(self,arguments);
            return true;
        });

        //background脚本有更新时会自动reload，通知前台页面刷新
        chrome.runtime.onInstalled.addListener(function() {
            Browser.getCurrentTab(function(tab) {
                if(Config.isValidUrl(tab.url)) {
                    chrome.tabs.reload(tab.id);
                }
            });
        });

        chrome.runtime.onSuspend.addListener(function() {
              if(self.timer) {
                  clearInterval(self.timer);
                  self.timer = null;
              }
        });

        //当background有更新时强制reload当前页面

        if(localStorage.getItem("reload") == "y") {
            localStorage.removeItem("reload");
            Browser.getCurrentTab(function(tab) {
                if(Config.isValidUrl(tab.url)) {
                    chrome.tabs.reload(tab.id);
                }
            });
        }
        return this;
    },


    handleOnMessage: function(request,sender,sendResponse) {
        var self = this,
            data = request.data;

        switch(request.route) {
            case '/start':
                Browser.getCurrentTab(function(tab) {
                    self.start(tab);
                });
                break;

            case '/options/open':
                Browser.getCurrentTab(function(tab) {
                    self.currentTab = tab;
                    chrome.tabs.create({url: Config.urls.options}, function(tab) {
                        self.optionTab = tab;
                    });
                });
                break;

            case '/options/close':
                Browser.getCurrentTab(function(tab) {
                    self.optionsSaved = true;
                    chrome.tabs.remove(tab.id);
                });
                break;

            case '/layout':
                StatusManager.hasLayout(data.layout);
                break;

            case '/popup/init':

                var error = errorStorage.get(data.tabId);

                if(error){
                    sendResponse({
                        data:error,
                        config:Config.popup,
                        call:["popup/index"]
                    });
                }else if(localStorage["loading"]) {
                    sendResponse({
                        data:{
                            type:"loading"
                        },
                        config:Config.popup,
                        call:["popup/index"]
                    });
                }
                break;

            case '/popup/status':
                sendResponse({
                    data:{
                        status:localStorage["loading"]?"loading":"complete"
                    }
                });
                break;

            case '/captureVisibleTab':
                chrome.tabs.captureVisibleTab(function(dataURL) {
                     sendResponse(dataURL);
//                     Browser.getCurrentTab(function(tab){
//                          chrome.tabs.sendMessage(tab.id, {
//                             route: "/captureVisibleTab",
//                             data: dataURL
//                          });
//                     });
                });
                break;

            case '/permissionRequest':
                if (data.command == 'Request') {
                    Browser.getCurrentTab(function(tab) {
                        self.currentTab = tab;
                        chrome.tabs.create({
                            url: '/authorize.html?' + data.params + '&tabId=' + tab.id,
                            active: true
                        }, function(newTab) {
                            self.permissionTab = newTab;
                        });
                    });
                }
                break;

            case '/permissionContains':
                var params = {};
                if (data.origins.length != 0) {
                    params['origins'] = data.origins;
                }
                if (data.permissions.length != 0) {
                    params['permissions'] = data.permissions;
                }
                chrome.permissions.contains(params, function(result) {
                    sendResponse(result);
                });
                break;

            case '/permissionRemove':
                var params = {};
                if (data.origins.length != 0) {
                    params['origins'] = data.origins;
                }
                if (data.permissions.length != 0) {
                    params['permissions'] = data.origins;
                }
                chrome.permissions.remove(params, function(removed) {
                    sendResponse(removed);
                });
                break;

            case '/popup':
                var error = errorStorage.get(data.tabId);
                if(error){
                    sendResponse({
                        data:error
                    });
                }
                break;

            case '/today/notify': {
                var category = data.category,
                    timestamp = data.timestamp,
                    recordTimeStamp = StatusManager.getTimestamp(category),
                    isToday = self.isToday(recordTimeStamp);

                if (!recordTimeStamp || (recordTimeStamp && !isToday)) {
                    statusMachine.setTimestamp(category, timestamp);
                    sendResponse({type: 'timesOfToday', notified: false});
                } else if (isToday) {
                    sendResponse({type: 'timesOfToday', notified: true});
                }
                break;
            }

            case '/close': {
                errorStorage.clear();
                self.close();
                sendResponse();
                break;
            }

            case '/error':
                self.setIcon(STATUS.ERROR);
                Browser.getCurrentTab(function(tab) {
                    errorStorage.set(tab.id, data);
                });
                break;

            case '/udata/running':
                var layout = uDataStorage.get("udata-layout"),
                    isNew = uDataStorage.get("udata-isNew") ? false : true,
                    hasMocked = uDataStorage.get('hasMocked') ? true : false,
                    hasFeature = StatusManager.hasFeature();

                var status = self.isRunning ? STATUS.RUNNING : STATUS.STOPPED;
                self.setIcon(status);
                sendResponse({
                    data: {
                        running:self.isRunning,
                        layout: layout,
                        isNew: false,
                        hasFeature: false,
                        hasMocked: hasMocked
                    }
                });
                break;

            case '/storage/get' : {
                sendResponse({
                    data:{
                            storage: uDataStorage.find()
                        }
                });
                break;
            }

            case '/storage/set' : {
                uDataStorage.set(data.key, data.value);
                sendResponse({
                    data:{
                            storage: uDataStorage.find()
                        }
                });
                break;
            }

            case '/reload': {
                var key = "background_version",
                    time = uDataStorage.get(key),
                    _time = data.time;
                console.log(time+"/"+_time);
                if(_time) {
                    uDataStorage.set(key, _time);
                }

                if(data.reload|| (time && time !== _time)) {
                    localStorage.setItem("reload","y");
                    chrome.runtime.reload();
                }
                break;
            }


            // 用于 SPM 检测工具
            case '/tool/spmMarkInvalidLinks/open_tab': {
                var tab_id;
                var tab_url;
                chrome.tabs.create(data, function (tab) {
                    tab_id = tab.id;
                    tab_url = tab.url;
                    sendResponse({
                        data:{
                            tab_url:tab_url
                        }
                    });
                });
                return true;
            }
            case '/tools/spmFind/tab_opened':{
                chrome.tabs.getSelected(null, function(tab) {
                    //data = watching_tabs[tab.id];
                    //if (!data) return;
                    sendResponse();
                });
                return true;
            }
            case '/aplus/init': {
                Browser.getCurrentTab(function(tab) {
                    chrome.tabs.executeScript({
                        code: '('+aplus.toString()+')()',
                        allFrames:true
                    });
                });
                return true;
            }

            //udata模块调试
            case '/debug/module': {
                if(data.code) {
                    localStorage[data.modname] = data.code;
                }else {
                    if(localStorage[data.modname]) {
                        localStorage[data.modname] = null;
                        delete localStorage[data.modname];
                    }
                }
                sendResponse();
                return true;
            }
        }
    },

    isToday: function(timestamp) {
        if (!timestamp) {
            return false;
        }
        var today = new Date(),
            year = today.getFullYear(),
            month = today.getMonth(),
            day = today.getDate(),
            yesterday = +new Date(year, month, day, 0, 0, 0),
            tomorrow = +new Date(year, month, day, 23, 59, 59);

        if (timestamp >= yesterday && timestamp <= tomorrow) {
            return true;
        } else {
            return false;
        }

    },

    runCurrentTab: function() {

        function startClient() {
            if(!document.querySelector("#udata_running_lock")){
                if(!window.moment){
                    location.reload();
                }else{
                    chrome.runtime.sendMessage({route: "/start" });
                }
            }
        }

        Browser.getCurrentTab(function(tab) {
            chrome.tabs.executeScript({
                code: '('+ startClient.toString() +')()',
                allFrames:false
            });
        });
    },


    initEvent: function() {
        var self = this;

        chrome.browserAction.onClicked.addListener(function(tab){
            if(self.isRunning) {
                self.close();
            }else{
                if(!Config.isValidUrl(tab.url)) {
                    self.run();
                    self.setIcon(STATUS.ERROR);
                    errorStorage.set(tab.id, {type:"spm"});
                    return;
                }
                self.runCurrentTab();
                self.run();
            }
            self.notify();
        });

        chrome.tabs.onActivated.addListener(function() {
            Browser.getCurrentTab(function(tab) {

                if(self.isRunning) {
                    if(tab.status == "complete") {
                        localStorage.removeItem("loading");
                    }else {
                        localStorage["loading"] = "loading";
                    }
                    if(!Config.isValidUrl(tab.url)){
                        self.setIcon(STATUS.ERROR);
                        errorStorage.set(tab.id, {type:"spm"});
                        return;
                    }
                    if(errorStorage.get(tab.id)) {
                        self.setIcon(STATUS.ERROR);
                        return;
                    }else {
                        self.runCurrentTab();
                        self.setIcon(STATUS.RUNNING);
                        Browser.clearPopUp();
                    }
                }else {
                    self.setIcon(STATUS.STOPPED);
                    Browser.clearPopUp();
                }
                self.notify();
            });
        });

        chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
            errorStorage.remove(tabId);
            if(!self.optionTab && !self.permissionTab) {
                return;
            }
            if(self.optionTab && tabId == self.optionTab.id) {
                if(self.currentTab) {
                    chrome.tabs.update(self.currentTab.id, {active: true},function() {
                        if(self.optionsSaved) {
                            chrome.tabs.reload(self.currentTab.id, function(){
                                self.currentTab = null;
                            });
                            self.optionsSaved = false;
                        }
                        self.currentTab = null;
                    });
                }
            }
            if(self.permissionTab && tabId == self.permissionTab.id) {
                if (self.currentTab) {
                    chrome.tabs.update(self.currentTab.id, {active: true}, function(tab) {
                        self.currentTab = null;
                    });
                }
            }
        });

        chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId) {
            errorStorage.remove(removedTabId);
        });

        chrome.windows.onRemoved.addListener(function(){
            //清除错误信息
            errorStorage.clear();
        });

        return this;
    },

    notify: function() {
        var self = this;

        Browser.getActiveTab(function(tab) {
            try{
                chrome.tabs.sendMessage(tab.id, {
                    route: "/udata/update_status",
                    data: {
                        running: self.isRunning
                    }
                });
            }catch(e) {
                console.log(e);
            }
        });

    },

    run: function() {
        this.isRunning = true;
        this.setIcon(STATUS.RUNNING)
            .updateStatus();

        return this;
    },

    close: function() {
        this.isRunning = false;
        this.setIcon(STATUS.STOPPED).updateStatus();
        Browser.clearPopUp();
    },

    updateStatus: function(status) {
        StatusManager.changeRunningStatus(this.isRunning);
        return this;
    },

    setIcon : function(status){
        var path ="/image/icon/" +  ICONS[status];
        chrome.browserAction.setIcon({path:path});
        if(status == STATUS.ERROR) {
            Browser.setPopup("popup/popup.html");
        }else{
            Browser.clearPopUp();
        }
        return this;
    }
}

});
define('sys/browser',[],function(require, exports, module) {
module.exports = {

    getCurrentTab: function(callback) {
        chrome.tabs.query({active: true,windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
            callback && callback(tabs[0]);
        });
    },

    getActiveTab: function(callback) {
        chrome.tabs.query({active: true}, function(tabs) {
            tabs.forEach(function(tab) {
                callback && callback(tab);
            });
        });
    },

    setPopup: function(popup) {
        chrome.browserAction.setPopup({
            popup: popup
        });
        return this;
    },

    clearPopUp: function() {
        return this.setPopup("");
    }

}
});
define('sys/config',[],function(require, exports, module) {
var hosts = [    "*.taobao.com",
                 "*.taobao.net",
                 "*.taobao.org",
                 "*.tw.taobao.com",
                 "*.taobao.ali.com",

                 "*.tmall.com",
                 "*.tmall.hk",

                 "*.juhuasuan.com",
                 "*.etao.com",
                 "*.tao123.com",
                 "*.aliyun.com",
                 "*.hitao.com",
                 "*.alibado.com",
                 "*.youshuyuan.com",
                 "*.yahoo.com.cn",
                 "*.aliloan.com",
                 "*.alibaba-inc.com",

                 "*.xiami.com",
                 "*.1688.com",
                 "*.yunos.com",


                 "*.atatech.org",
                 "*.laiwang.com",

                 "*.aliexpress.com",
                 "*.koubei.com",
                 "*.itao.com",
                 "*.alimama.com"
     ],
     urls = {
         debug:"http://g.alicdn.com/udata/udata-pi/debug.html",
         options:"http://g.alicdn.com/udata/udata-pi/options.html"
     },
     STATUS = {
        "ERROR" : 0,
        "RUNNING"  : 1,
        "STOPPED"  : 2
     },
     ICONS = [
        "error.png",
        "running.png",
        "stopped.png"
     ];

module.exports = {
    kissy4: 'https://s.tbcdn.cn/g/kissy/k/1.4.1/seed-min.js',
    kissy5: 'http://g.tbcdn.cn/kissy/edge/2014.06.13/seed.js',
    start: 'http://g.alicdn.com/udata/udata-pi/'+ ( localStorage["~debug"]? 'start-debug.js' :'start.js' ),
    hosts:hosts.map(function(item) {
        item = item.replace("*.","*").replace(/\./g,"\\.").replace("*",".*");
        return new RegExp(item);
    }),
    urls: urls,
    urlList: (function(){
        var _urls = [];
        for(var p in urls) {
            _urls.push(urls[p]);
        }
        return _urls;
    })(),
    popup: {
      combine:true,
      packages: {
          "popup":{
             combine:false,
             base: "https://s.tbcdn.cn/g/udata/userver/0.0.13/popup/",
             ignorePackageNameInUri:true,
             charset: "utf-8" //包里模块文件编码格式
          }
      }
    },
    isValidUrl: function(url){
        var valid = false;
        valid = this.urlList.some(function(page_url) {
            return url.indexOf(page_url) > -1;
        });

        if(valid) {
            return valid;
        }

        var parser = document.createElement('a');
        parser.href = url;
        var host = parser.hostname;
        parser = null;

        return this.hosts.some(function(_host) {
            return _host.test(host);
        });
    },
    isAplus: function (url) {
      if(!url) {
        return false;
      }
      return  url.indexOf("dwaplus.taobao.ali.com")>-1
           || url.indexOf("apluspre.taobao.ali.com")>-1
           || url.indexOf("isAPlus=true")>-1;
    },
    STATUS:STATUS,
    ICONS:ICONS
}
});
define('sys/util',[],function(require, exports, module) {
module.exports = {
    queryString: function(s){
        var query = {};
        if(!s){
            return query;
        }
        s.split("&").map(function(item){
            var item = item.split("="),val;
            try{
                val = decodeURIComponent(item[1]||"");
            }catch(e) {
                val = null;
            }
            query[item[0]] = val;
        });
        return query;
    },

    ajax: function (url, callback) {
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.onload = function () {
            callback(req.responseText);
        };
        req.send(null);
    },

    injectKISSY: function (kissy,tabId, all, callback) {
        this.ajax(kissy, function (code) {
            chrome.tabs.executeScript(tabId, {
                code: 'if(!window.KISSY){' + code + '}',
                allFrames:all
            }, callback);
        });
    },

    injectScript: function(tabId, request, callback) {

        function handleCode(code) {
            if(code.indexOf('KISSY.add(') == -1 && "mods" in request) {
                code = 'KISSY.add("' + request.mods[0].name + '",function(S ,require, exports, module) {\n' + code + '})';
            }

            chrome.tabs.executeScript(tabId, {
                code: code,
                allFrames:request.all
            }, callback);
        }

        var key = request.mods && request.mods[0].name;

        if(request.debug && key && localStorage[key]) {
            handleCode(localStorage[key]);
        }else {
            this.ajax(request.path, function(code) {
                handleCode(code);
            });
        }
    }
}
});
define('sys/storage',['sys/config'],function(require, exports, module) {
var ls = window.localStorage;

function Storage(key) {
    this.key = key;
}

Storage.prototype = {
    alloc : function(key) {
        this.key = key;
        return this;
    },
    find : function(){
        var s = ls.getItem(this.key);
        return s && JSON.parse(s);
    },
    get : function(k){
        var that = this,
            o = that.find(),
            ret;

        if(o){
            ret = o[k];
        }
        return ret;
    },
    set : function(k,v){
        var that = this,
        o = that.find() || {};
        o[k] = v;
        ls.setItem(this.key,JSON.stringify(o));
    },
    remove : function(k){
        var that = this,
        o = that.find();
        if(o){
            delete o[k];
        }
        ls.setItem(this.key,JSON.stringify(o));
    },
    clear : function(){
        ls.removeItem(this.key);
    }
}

module.exports = {
    alloc: function(key){
        return new Storage(key);
    }
}
});
define('sys/status-manager',["./storage"],function(require, exports, module) {
var Storage = require("./storage").alloc("udata");

var set = function(k,v){
        Storage.set(k,v);
    },
    get = function(k) {
        return Storage.get(k);
    },
    judge = function(k,v){
        var status = Storage.get(k);
        return status===v;
    },
    remove = function(k){
        Storage.remove(k);
    };

module.exports = {
    //判断插件是否启动
    isRunningStatus : function(){
        return judge('UDataIsRunning',true);
    },
    //改变插件启动状态
    changeRunningStatus : function(status){
        set('UDataIsRunning',status);
    },
    //判断是否是在该版本第一次登陆
    isFirstLoginInCurrentVersion : function(){
        var currentVersion = chrome.app.getDetails().version;
        return !judge('login',currentVersion);
    },
    //在当前版本已经登陆过
    hasLoginedInCurrentVersion : function(){
        var currentVersion = chrome.app.getDetails().version;
        set('login',currentVersion);
    },
    // 是否是老用户（历史原因值反的）
    hasVisited: function(isNew) {
        var version = chrome.app.getDetails().version;
        set('udata-isNew', isNew);
        set('udata-feature', version);
    },
    // 设置面板横竖模式
    hasLayout: function(layout) {
        set('udata-layout', layout);
    },
    // 这一版本是否有新特性
    hasFeature: function() {
        var featureVersions = ["3.2.0"];
        var version = chrome.app.getDetails().version;
        for (var i = 0, l = featureVersions.length; i < l; i++) {
            var v = featureVersions[i];
            if (v == version) {
                if (get('udata-feature') != version) {
                    return true;
                }
            }
        }
        return false;
    },
    // 已提示用户使用模拟版
    hasMocked: function() {
        set('hasMocked', true);
    },

    // 设置对应类型的“今天是否有通知”
    setTimestamp: function(category, timestamp) {
        set('udata-'+category, timestamp);
    },
    // 获取对应类型的“今天是否有通知”
    getTimestamp: function(category) {
        return get('udata-'+category);
    }
}


});