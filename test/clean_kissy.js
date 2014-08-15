KISSY.add("udata/init", ["event","node","base","io"], function(S ,require, exports, module) {
var _event_ = require("event");
var node = require("node");
var base = require("base");
var _io_ = require("io");
var udataCommonConfig, udataViewsMenu, udataConnect, udataProcess, udataViewsSpmDetail, udataService, udataYieldingProcesses, udataAuthority, udataLocalStorage, udataAppsSpmCoverflow, udataViewsImagePopup, udataViewsCoverflow, udataViewsChartMenu, udataChartsFunnelChart, udataViewsReferer, udataViewsMenuWrapper, udataViewsPanel, udataRecorder, udataCommonGlobal, udataCommonLoading, udataCommonDialog, udataDateTime, udataDrawTool, udataResponse, udataCommonErrorHandle, udataAppsSpmImagePopup, udataChartMenu, udataCommonMultiChart, udataRealMission, udataDataService, udataAppsSpmDetail, udataAppsHeatMapMain, udataRequester, udataAppsPageDataOverview, udataAppsPageDataFlow, udataAppsPageDataUser, udataAppsPageDataClient, udataAppsPageDataToday, udataAppsPageDataReferer, udataAppsSpmPosition, udataAppsSpmModule, udataAppsPageDataMain, udataMenu, udataIndex, udataInit;
udataCommonConfig = function (exports) {
  exports = {
    heatMap: -2,
    spmModule: -1,
    STATUS: {
      'ERROR': 0,
      'RUNNING': 1,
      'STOPPED': 2
    },
    ERROR_CODE: {
      'NOT_LOGIN': -1,
      'TIMEOUT': -2,
      'UNAUTHORIZED': 401
    }
  };
  return exports;
}();
udataViewsMenu = function (exports) {
  exports = {
    __lines: {
      '0': '<dl id="udata-menu-items">\n',
      '1': '\n<dt data-id="',
      '2': '"  class="udata-menu-item"><p class="udata-item-name" title="',
      '3': '">',
      '4': '</p>\n',
      '5': '\n<dt data-id="',
      '6': '"  class="udata-menu-item udata-disabled"><p class="udata-item-name">',
      '7': '</p>\n',
      '8': '\n<p class="udata-item-choice"><span class="udata-display-item" data-mode="numeric">\u6570\u503C</span><span class="udata-display-item" data-mode="rate">\u5360\u6BD4</span></p></dt>\n\n',
      '9': '\n    <input type="range" value="100" class="udata-item-slider" />\n',
      '10': '\n</dt>\n',
      '11': '\n</dl>\n        \n<dl id="udata-menu-sub-items" class="udata-menu-sub-collapse">\n\n  ',
      '12': '\n        <dt data-id="',
      '13': '"  class="udata-menu-item"><p class="udata-item-name" title="',
      '14': '">',
      '15': '</p>\n    ',
      '16': '\n    <dt data-id="',
      '17': '"  class="udata-menu-item udata-disabled"><p class="udata-item-name">',
      '18': '</p>\n    ',
      '19': '\n    <p class="udata-item-choice"><span class="udata-display-item" data-mode="numeric">\u6570\u503C</span><span class="udata-display-item" data-mode="rate">\u5360\u6BD4</span></p></dt>\n    ',
      '20': '\n     </dt>\n    ',
      '21': '\n  <dt class="udata-items-config-con"><a class="udata-items-config"></a></dt>\n</dl>\n<dl class="udata-items-more-con">\n  <dt class="udata-items-more-wrapper"><span class="udata-items-more"></span></dt>\n</dl>'
    },
    render: function anonymous(__data) {
      __data = __data || {};
      var self = this, temp = [];
      with (__data) {
        temp.push(self.__lines[0]);
        for (var i = 0; i < __data.mainTargets.length; i++) {
          var item = __data.mainTargets[i];
          if (item.useable) {
            temp.push(self.__lines[1]);
            temp.push(item.id);
            temp.push(self.__lines[2]);
            temp.push(item.name);
            temp.push(self.__lines[3]);
            temp.push(item.memo);
            temp.push(self.__lines[4]);
          } else {
            temp.push(self.__lines[5]);
            temp.push(item.id);
            temp.push(self.__lines[6]);
            temp.push(item.memo);
            temp.push(self.__lines[7]);
          }
          if (item.hasPercentage) {
            temp.push(self.__lines[8]);
          } else if (item.id == -2) {
            temp.push(self.__lines[9]);
          } else {
            temp.push(self.__lines[10]);
          }
        }
        temp.push(self.__lines[11]);
        for (var i = 0; i < __data.subTargets.length; i++) {
          var item = __data.subTargets[i];
          if (item.useable) {
            temp.push(self.__lines[12]);
            temp.push(item.id);
            temp.push(self.__lines[13]);
            temp.push(item.name);
            temp.push(self.__lines[14]);
            temp.push(item.memo);
            temp.push(self.__lines[15]);
          } else {
            temp.push(self.__lines[16]);
            temp.push(item.id);
            temp.push(self.__lines[17]);
            temp.push(item.memo);
            temp.push(self.__lines[18]);
          }
          if (item.hasPercentage) {
            temp.push(self.__lines[19]);
          } else {
            temp.push(self.__lines[20]);
          }
        }
        temp.push(self.__lines[21]);
      }
      return temp.join('');
    }
  };
  return exports;
}();
udataConnect = function (exports) {
  var Event = _event_;
  function Connect() {
    this.init();
  }
  S.augment(Connect, Event.Target, {
    init: function () {
      var self = this;
      chrome.runtime.onMessage.addListener(function (request) {
        self.fire(request.route, { data: request.data });
      });
    },
    post: function (route, data, callback) {
      if (S.isFunction(data)) {
        callback = data;
        data = {};
      }
      chrome.runtime.sendMessage({
        route: route,
        data: data
      }, function () {
        callback && callback.apply(null, arguments);
      });
    }
  });
  exports = new Connect();
  return exports;
}();
udataProcess = function (exports) {
  var defaultOptions = {
      size: 30,
      interval: 30,
      resource: [],
      updateResource: function () {
      },
      process: function () {
      },
      context: null
    };
  var Processes = function (options) {
    this.init(options);
  };
  Processes.prototype = {
    init: function (options) {
      this.isRunning = false;
      this.options = S.merge({}, defaultOptions, options);
      this.timers = [];
      this.run();
    },
    run: function () {
      var self = this, size = this.options.size, resource = this.options.resource, process = this.options.process, interval = this.options.interval;
      this.isRunning = true;
      (function () {
        var func = arguments.callee;
        var items = resource.splice(0, size);
        items.forEach(function (item) {
          process && process(item);
        });
        if (items.length == size) {
          if (self.isRunning) {
            var timer = setTimeout(function () {
                func();
                var index = self.timers.indexOf(timer);
                if (index > -1) {
                  self.timers.splice(index, 1);
                }
              }, 30);
            self.timers.push(timer);
          }
        } else {
        }
      }());
    },
    stop: function () {
      this.timers.forEach(function (timer) {
        clearTimeout(timer);
      });
      this.timers.length = 0;
      this.isRunning = false;
    },
    restart: function (resource) {
      var that = this;
      this.stop();
      this.options.resource = resource;
      this.run();
    }
  };
  exports = Processes;
  return exports;
}();
udataViewsSpmDetail = function (exports) {
  exports = {
    __lines: {
      '0': '<div class="udata-spm-detail-container">\n    <ul class="udata-dialog-nav">\n        ',
      '1': '\n        <li data-index="',
      '2': '"><a href="javascript:;" title="',
      '3': '">',
      '4': '</a></li>\n        ',
      '5': '\n    </ul>\n    <ul class="udata-dialog-content">\n        ',
      '6': '\n        <li></li>\n        ',
      '7': '\n    </ul>\n    <div class="udata-spm-detail-loading">\n        <div>\n            <p class="udata-loading-spinner0"></p>\n        </div>\n    </div>\n</div>\n'
    },
    render: function anonymous(__data) {
      __data = __data || {};
      var self = this, temp = [];
      with (__data) {
        temp.push(self.__lines[0]);
        for (var i = 0; i < nav.length; i++) {
          temp.push(self.__lines[1]);
          temp.push(i);
          temp.push(self.__lines[2]);
          temp.push(nav[i]);
          temp.push(self.__lines[3]);
          temp.push(nav[i]);
          temp.push(self.__lines[4]);
        }
        temp.push(self.__lines[5]);
        for (var i = 0; i < nav.length; i++) {
          temp.push(self.__lines[6]);
        }
        temp.push(self.__lines[7]);
      }
      return temp.join('');
    }
  };
  return exports;
}();
udataService = function (exports) {
  var Connect = udataConnect, pool = null;
  exports = {
    set: function (key, value) {
      var that = this;
      var data = {
          key: key,
          value: value
        };
      Connect.post('/storage/set', data, this.setPool.bind(this));
    },
    get: function (key, callback) {
      if (!key) {
        return null;
      }
      if (!pool) {
        this.getPool(function () {
          callback && callback(pool[key]);
        });
      } else {
        callback && callback(pool[key]);
      }
      return pool && pool[key] || null;
    },
    getPool: function (callback) {
      var that = this;
      Connect.post('/storage/get', function () {
        that.setPool.apply(that, arguments);
        callback && callback();
      });
      return this;
    },
    setPool: function (res) {
      var data = res.data;
      if (data && data.storage) {
        pool = data.storage;
      } else {
        pool = {};
      }
    }
  }.getPool();
  return exports;
}();
udataYieldingProcesses = function (exports) {
  var YieldingProcesses = function (options) {
    this.init(options);
  };
  YieldingProcesses.prototype = {
    defaultOptions: {
      //delay : 5000,
      interval: 1,
      resource: [],
      updateResource: function () {
      },
      process: function () {
      },
      context: null
    },
    init: function (options) {
      var that = this;
      that.options = {};
      that.options = S.merge(that.options, that.defaultOptions, options);
      that.activate(that.options.resource);
    },
    chunk: function (array) {
      var that = this;
      setTimeout(function () {
        var item = array.shift();
        that.options.process.call(that.options.context, item);
        if (array.length > 0) {
          that.chunkTimer = setTimeout(arguments.callee, 1);
        }
      }, that.options.interval);
    },
    activate: function (resource) {
      var that = this;
      that.chunk(resource || that.options.updateResource.call(that.options.context));
    },
    /*loop : function(){
        var that = this;
        that.dynamicTimer = setTimeout(function(){
            that.activate();
        },that.options.delay);
    },*/
    stop: function () {
      var that = this;
      clearTimeout(that.dynamicTimer);
      clearTimeout(that.chunkTimer);
    },
    restart: function (resource) {
      var that = this;
      that.stop();
      that.chunk(resource);
    }
  };
  exports = YieldingProcesses;
  return exports;
}();
udataAuthority = function (exports) {
  /**
   * 权限管理
   * @author : yu.yuy
   * @createTime : 2013-12-23
   */
  exports = {
    getNoAuthorityText: function (type) {
      var text;
      if (type == 'off') {
        text = '\u4EB2\uFF0C\u60A8\u6682\u65E0uData\u4F7F\u7528\u6743\u9650\uFF0C\u8BF7\u8D70\u6D41\u7A0B\u7533\u8BF7<a style=\'color:#196EEE;\' href=\'http://wf.alibaba-inc.com/new/smartflow/default/index?requesttypename=c_data_proj&role=13850\'>http://wf.alibaba-inc.com/new/smartflow/default/index?requesttypename=c_data_proj&role=13850</a><p>\u5546\u4E1A\u9879\u76EE\uFF1A<strong>udata</strong>\u3002</p><p>\u9879\u76EE\u89D2\u8272\uFF1A<strong>uData\u901A\u7528\u89D2\u8272</strong>\u3002</p>';
      } else {
        text = '\u60A8\u6CA1\u6709\u76F8\u5173\u7684\u6570\u636E\u67E5\u770B\u6743\u9650\uFF0C\u6743\u9650\u7533\u8BF7\u5730\u5740\u4E3A\uFF1A<a style=\'color:#196EEE;\' href=\'http://wf.alibaba-inc.com/new/smartflow/default/index?requesttypename=c_data_proj&role=13521\'>http://wf.alibaba-inc.com/new/smartflow/default/index?requesttypename=c_data_proj&role=13521</a>\u3002<p>\u9879\u76EE\u540D\uFF1A<strong>uData</strong></p>';
      }
      return text;
    }
  };
  return exports;
}();
udataLocalStorage = function (exports) {
  var ls = window.localStorage, keyName = 'udata';
  exports = {
    find: function () {
      var s = ls.getItem(keyName);
      return s && JSON.parse(s);
    },
    get: function (k) {
      var that = this, o = that.find(), ret;
      if (o) {
        ret = o[k];
      }
      return ret;
    },
    set: function (k, v) {
      var that = this, o = that.find() || {};
      o[k] = v;
      ls.setItem(keyName, JSON.stringify(o));
    },
    remove: function (k) {
      var that = this, o = that.find();
      if (o) {
        delete o[k];
      }
      ls.setItem(keyName, JSON.stringify(o));
    },
    clear: function () {
      ls.removeItem(keyName);
    }
  };
  return exports;
}();
udataAppsSpmCoverflow = function (exports) {
  // TODO
  // image size autofit
  var $ = node.all;
  exports = function (container) {
    var $el = $(container);
    var index;
    var delta = 0;
    $el.on('mousewheel', function (evt) {
      evt.preventDefault();
      delta += evt.originalEvent.wheelDelta;
      if (delta > 60) {
        go(index + 1);
        delta = 0;
      } else if (delta < -60) {
        go(index - 1);
        delta = 0;
      }
    });
    $el.delegate('click', '.kissy-coverflow-item', function (evt) {
      go($(evt.currentTarget).index());
    });
    var $items = $el.all('.kissy-coverflow-item');
    var $texts = $el.all('.kissy-coverflow-text');
    var len = $items.length;
    function go(i) {
      if (i < 0 || i >= len || i === index)
        return;
      index = i;
      $items.each(function (item, i) {
        if (i === index) {
          $(this).css('-webkit-transform', 'translate3d(0, 0, 0)');
        } else {
          var x = (i - index) * 40;
          var r;
          if (x > 0) {
            x += 210;
            r = -70;
          } else {
            x -= 210;
            r = 70;
          }
          $(this).css('-webkit-transform', 'translate3d(' + x + 'px, 0, -200px) rotateY(' + r + 'deg)');
        }
      });
      $texts.hide().item(i).show();
    }
    if ($el.hasAttr('data-reverse')) {
      go(len - 1);
    } else {
      go(0);
    }
  };
  return exports;
}();
udataViewsImagePopup = function (exports) {
  exports = {
    __lines: {
      '0': '<div class="image-popup">\n\t<a href="javascript:;" class="image-popup-close">&times;</a>\n\t<div class="image-popup-container">\n\t\t<h2 class="image-popup-heading">',
      '1': '</h2>\n\t\t',
      '2': '\n\t\t<div class="image-popup-content">\n\t\t\t<a href="javascript:;" class="image-popup-switch"><i class="fa fa-square"></i>&nbsp;\u663E\u793A\u6D41\u91CF\u6570\u636E</a>\n\t\t\t<a href="javascript:;" class="image-popup-switch-off"><i class="fa fa-check-square"></i>&nbsp;\u663E\u793A\u6D41\u91CF\u6570\u636E</a>\n\t\t\t<img src="',
      '3': '" class="image-popup-switch-image">\n\t\t\t<img src="',
      '4': '">\n\t\t</div>\n\t\t',
      '5': '\n\t\t<div class="image-popup-content">\n\t\t\t<img src="',
      '6': '">\n\t\t</div>\n\t\t',
      '7': '\n\t</div>\n\t<div class="image-popup-backdrop"></div>\t\n</div>\n'
    },
    render: function anonymous(__data) {
      __data = __data || {};
      var self = this, temp = [];
      with (__data) {
        temp.push(self.__lines[0]);
        temp.push(spm);
        temp.push(self.__lines[1]);
        if (src0) {
          temp.push(self.__lines[2]);
          temp.push(src0);
          temp.push(self.__lines[3]);
          temp.push(src);
          temp.push(self.__lines[4]);
        } else {
          temp.push(self.__lines[5]);
          temp.push(src);
          temp.push(self.__lines[6]);
        }
        temp.push(self.__lines[7]);
      }
      return temp.join('');
    }
  };
  return exports;
}();
udataViewsCoverflow = function (exports) {
  exports = {
    __lines: {
      '0': '<div class="kissy-coverflow js-kissy-coverflow" style="width:100%; height:320px;" data-reverse>\n  <h3 class="kissy-coverflow-heading">SPM: ',
      '1': '</h3>\n  <div class="kissy-coverflow-container">\n    ',
      '2': '\n    <div class="kissy-coverflow-item">\n      <img src="',
      '3': '" class="image-popup-target" data-src="',
      '4': '" data-src0="',
      '5': '" data-spm="',
      '6': '">\n    </div>\n    ',
      '7': '\n  </div>\n  <div class="kissy-coverflow-text-container">\n    ',
      '8': '\n    <div class="kissy-coverflow-text">\n      <span>',
      '9': '</span>\n      <a href="javascript:;" class="image-popup-btn" data-src="',
      '10': '" data-src0="',
      '11': '" data-spm="',
      '12': '"><i class="fa fa-search-plus"></i></a>\n    </div>\n    ',
      '13': '\n  </div>\n</div>\n'
    },
    render: function anonymous(__data) {
      __data = __data || {};
      var self = this, temp = [];
      with (__data) {
        temp.push(self.__lines[0]);
        temp.push(spm);
        temp.push(self.__lines[1]);
        for (var i = 0; i < items.length; i++) {
          temp.push(self.__lines[2]);
          temp.push(items[i].src);
          temp.push(self.__lines[3]);
          temp.push(items[i].src);
          temp.push(self.__lines[4]);
          temp.push(items[i].src0);
          temp.push(self.__lines[5]);
          temp.push(spm);
          temp.push(self.__lines[6]);
        }
        temp.push(self.__lines[7]);
        for (var i = 0; i < items.length; i++) {
          temp.push(self.__lines[8]);
          temp.push(items[i].date);
          temp.push(self.__lines[9]);
          temp.push(items[i].src);
          temp.push(self.__lines[10]);
          temp.push(items[i].src0);
          temp.push(self.__lines[11]);
          temp.push(spm);
          temp.push(self.__lines[12]);
        }
        temp.push(self.__lines[13]);
      }
      return temp.join('');
    }
  };
  return exports;
}();
udataViewsChartMenu = function (exports) {
  exports = {
    __lines: {
      '0': '<div class="udata-chart-menu-wrapper">\n    <a class="udata-chart-menu-trigger" href="javascript:;">\n        <i class="fa fa-bars"></i>\n    </a>\n    <div class="udata-chart-menu">\n        <a href="javascript:;" class="udata-chart-back">\n            <i class="fa fa-reply"></i>\n        </a>\n        ',
      '1': '\n        <div class="menu-main-item">\n            <a href="javascript:;" class="menu-main-item-trigger view" title="\u5207\u6362\u89C6\u56FE">\n                <i class="fa fa-bar-chart-o"></i>\n            </a>\n            <div class="udata-chart-submenu view-menu">\n                <ul>\n                    ',
      '2': '\n                    <li data-type="',
      '3': '" class="',
      '4': '  view-type"><i class="fa fa-check-square-o"></i>',
      '5': '</li>\n                    ',
      '6': '\n                </ul>\n            </div>\n        </div>\n        ',
      '7': '\n        <div class="menu-main-item">\n            <a href="javascript:;" class="menu-main-item-trigger compare" title="\u6BD4\u8F83">\n                <i class="fa fa-eye"></i>\n            </a>\n            <div class="udata-chart-submenu compare-menu">\n                <div class="udata-url-input">\n                    <input type="text" class="url-input" placeholder="\u8F93\u5165\u8981\u6BD4\u8F83\u7684\u9875\u9762url"/>\n                </div>\n                <ul class="chart-menu-pages">\n                    <li data-spm="{spm}" class="compare-url">{name}</li>\n                </ul>\n            </div>\n        </div>\n        ',
      '8': '\n        <div class="menu-main-item">\n            <a data-href="',
      '9': '" href="javascript:;" class="menu-main-item-trigger download" title="\u4E0B\u8F7D">\n                <i class="fa fa-download"></i>\n            </a>\n        </div>\n        ',
      '10': '\n    </div>\n</div>'
    },
    render: function anonymous(__data) {
      __data = __data || {};
      var self = this, temp = [];
      with (__data) {
        temp.push(self.__lines[0]);
        if (view) {
          temp.push(self.__lines[1]);
          for (var i = 0; i < view.length; i++) {
            temp.push(self.__lines[2]);
            temp.push(view[i].type);
            temp.push(self.__lines[3]);
            temp.push(currentView == view[i].type ? 'selected' : '');
            temp.push(self.__lines[4]);
            temp.push(view[i].label);
            temp.push(self.__lines[5]);
          }
          temp.push(self.__lines[6]);
        }
        if (compare) {
          temp.push(self.__lines[7]);
        }
        if (download) {
          temp.push(self.__lines[8]);
          temp.push(download);
          temp.push(self.__lines[9]);
        }
        temp.push(self.__lines[10]);
      }
      return temp.join('');
    }
  };
  return exports;
}();
udataChartsFunnelChart = function (exports) {
  var Node = node, Base = base, $ = Node.all;
  var createElement = function (string, attributes, styles) {
    var xmlns = 'http://www.w3.org/2000/svg', el = document.createElementNS(xmlns, string);
    if (!attributes)
      attributes = {};
    if (!styles)
      styles = {};
    for (var k in attributes) {
      el.setAttribute(k, attributes[k]);
    }
    for (k in styles) {
      el.style[k] = styles[k];
    }
    return el;
  };
  function FunnelChart(config) {
    var self = this;
    self.dom = { layers: [] };
    FunnelChart.superclass.constructor.call(self, config);
    self.set('rx', self.get('width'));
    self.set('ry', self.get('height') / (self.get('data').length + 2));
    self.set('drx', self.get('width') / self.get('data').length);
    if (self.get('container')) {
      self.appendTo(self.get('container'));
    }
    self.on('afterDataChange', function (ev) {
      self.setDataWithTransition(ev.newVal, ev.prevVal);
    });
  }
  FunnelChart.prototype.appendTo = function (container) {
    var self = this, data = self.get('data'), height = self.get('height'), rx = self.get('rx'), ry = self.get('ry'), drx = self.get('drx');
    self.appendTime = new Date().getTime();
    container = $(container)[0];
    self.dom.container = container;
    var svg = createElement('svg', {
        width: rx,
        height: height
      });
    var defs = createElement('defs');
    var clipPath = createElement('clipPath', { id: 'half' });
    var d = [
        [
          0,
          0
        ],
        [
          rx,
          0
        ],
        [
          rx,
          height
        ],
        [
          0,
          height
        ]
      ];
    var path = createElement('path', { d: 'M' + d.join(' L') + ' Z' });
    clipPath.appendChild(path);
    defs.appendChild(clipPath);
    clipPath = createElement('clipPath', { id: 'triangle' });
    d = [
      [
        0,
        ry
      ],
      [
        rx,
        height
      ],
      [
        rx,
        ry
      ]
    ];
    path = createElement('path', { d: 'M' + d.join(' L') + ' Z' });
    clipPath.appendChild(path);
    defs.appendChild(clipPath);
    svg.appendChild(defs);
    var layers = createElement('g', { 'clip-path': 'url(#triangle)' });
    self.dom.layersGroup = layers;
    for (var i = data.length - 1; i > -1; i--) {
      self.dom.layers[i] = self.generateLayer(i);
      layers.appendChild(self.dom.layers[i]);
    }
    svg.appendChild(layers);
    var line = createElement('line', {
        x1: 0,
        y1: ry,
        x2: rx,
        y2: height
      }, {
        stroke: '#fff',
        'stroke-width': 1
      });
    svg.appendChild(line);
    var ellipse = createElement('ellipse', {
        cx: rx,
        cy: ry,
        rx: rx,
        ry: ry,
        'clip-path': 'url(#half)'
      }, {
        fill: self.get('ellipseBackground'),
        stroke: self.get('ellipseStroke'),
        'stroke-width': self.get('ellipseStrokeWidth')
      });
    svg.appendChild(ellipse);
    container.appendChild(svg);
    if (self.get('tooltip')) {
      self.enableTooltip();
    }
    if (self.get('label')) {
      self.displayLabels();
    }
    self.setDataWithTransition(data);
  };
  FunnelChart.prototype.generateLayer = function (index) {
    var self = this, rx = self.get('rx'), ry = self.get('ry'), drx = self.get('drx');
    var getColor = function (name, index) {
      return self.get(name)[index % self.get(name).length];
    };
    var bg = getColor('background', index), fg = getColor('foreground', index);
    var layer = createElement('g');
    var rect = createElement('rect', {
        x: 0,
        y: ry * (index + 1),
        width: rx,
        height: ry
      });
    rect.style.fill = bg;
    layer.appendChild(rect);
    var ellipse = createElement('ellipse', {
        cx: rx,
        cy: ry * (index + 2),
        rx: rx - drx * index,
        ry: ry
      });
    ellipse.style.fill = bg;
    layer.appendChild(ellipse);
    var foreground = createElement('g', { 'clip-path': 'url(#layer-' + index + ')' });
    rect = rect.cloneNode();
    rect.style.fill = fg;
    foreground.appendChild(rect);
    ellipse = ellipse.cloneNode();
    ellipse.style.fill = fg;
    foreground.appendChild(ellipse);
    layer.appendChild(foreground);
    return layer;
  };
  FunnelChart.prototype.displayLabels = function () {
    var self = this, container = self.dom.container, label = self.get('label'), fg = self.get('foreground');
    var labels = self.get('data').map(label).map(function (label, index) {
        var span = '<div style=\'display: table-cell; vertical-align: middle; height: ' + self.get('ry') + 'px;\'><span style=\'width: 14px; height: 14px; display: inline-block; margin-right: 12px; background: ' + fg[index % fg.length] + ';\'></span></div>';
        return '<li class=\'kissy-funnel-chart-label-wrap\' style=\'font-size: 12px; list-style: none; padding: 0; margin: 0; line-height: 14px; display: table;\'>' + span + '<div class=\'kissy-funnel-chart-label\' style=\'display: table-cell; vertical-align:middle;\'>' + label + '</div>' + '</li>';
      });
    var div = document.createElement('div');
    div.className = 'kissy-funnel-chart-labels';
    div.innerHTML = '<ul style=\'list-style: none; padding: 0; margin: 0 0 0 24px;\'>' + labels.join('') + '</ul>';
    div.style.display = 'inline-block';
    container.appendChild(div);
    self.on('afterDataChange', function (ev) {
      var nodes = $(container).all('.kissy-funnel-chart-label');
      self.get('data').map(label).forEach(function (label, index) {
        nodes[index].innerHTML = label;
      });
    });
  };
  FunnelChart.prototype.enableTooltip = function () {
    var self = this, container = self.dom.container;
    var tooltip = document.createElement('div');
    tooltip.className = 'kissy-funnel-chart-tootip';
    var styles = {
        background: 'rgba(0, 0, 0, .5)',
        color: '#fff',
        position: 'fixed',
        top: 0,
        left: 0,
        fontSize: 14,
        padding: '1em',
        display: 'none',
        'borderRadius': '12px'
      };
    for (var k in styles) {
      tooltip.style[k] = styles[k];
    }
    container.appendChild(tooltip);
    self.dom.layersGroup.addEventListener('mouseout', function () {
      tooltip.style.display = 'none';
    });
    self.dom.layers.forEach(function (layer, index) {
      var lastUpdate = new Date().getTime();
      layer.addEventListener('mouseover', function () {
        tooltip.style.display = 'block';
        var text = self.get('tooltip')(self.get('data')[index], index);
        tooltip.innerHTML = text;
      });
      layer.addEventListener('mousemove', function (ev) {
        tooltip.style.left = Math.max(ev.pageX - window.scrollX, 0) + 'px';
        tooltip.style.top = ev.pageY - window.scrollY + 'px';
      });
    });
  };
  FunnelChart.prototype.setDataWithTransition = function (data, from) {
    var self = this, rx = self.get('rx'), ry = self.get('ry'), height = self.get('height');
    if (!from)
      from = data.map(function () {
        return 0;
      });
    if (!self.layerAnimations)
      self.layerAnimations = [];
    if (self.get('container')) {
      data.forEach(function (percentage, index) {
        var d = [
            from[index],
            percentage
          ].map(function (p) {
            var d = [
                [
                  rx * (1 - p),
                  ry
                ],
                [
                  rx,
                  height
                ],
                [
                  rx,
                  ry
                ]
              ].join(' L');
            return 'M' + d + ' Z';
          });
        var begin = '' + (new Date().getTime() - self.appendTime) / 1000 + 's';
        var animate = createElement('animate', {
            attributeName: 'd',
            attributeType: 'XML',
            begin: begin,
            dur: '' + self.get('duration') / 1000 + 's',
            from: d[0],
            to: d[1],
            fill: 'freeze'
          });
        if (!self.layerAnimations[index]) {
          var clipPath = createElement('clipPath', { id: 'layer-' + index });
          var path = createElement('path');
          self.layerAnimations[index] = path;
          clipPath.appendChild(path);
          var defs = $(self.get('container') + ' defs')[0];
          defs.appendChild(clipPath);
        }
        self.layerAnimations[index].appendChild(animate);
      });
    }
  };
  var defaults = {
      background: [
        '#eaecdd',
        '#eedec5'
      ],
      foreground: [
        '#b9c08a',
        '#e5ac67'
      ],
      width: 200,
      height: 350,
      ellipseBackground: '#fff',
      ellipseStroke: '#b9c08a',
      ellipseStrokeWidth: 1,
      duration: 2000,
      tooltip: null,
      container: null,
      label: null
    };
  var ATTRS = {
      data: {
        value: [],
        setter: function (v) {
          return v.concat();
        }
      }
    };
  for (var k in defaults) {
    ATTRS[k] = { value: defaults[k] };
  }
  S.extend(FunnelChart, Base, {}, { ATTRS: ATTRS });
  exports = FunnelChart;
  return exports;
}();
udataViewsReferer = function (exports) {
  exports = {
    __lines: {
      '0': '<div id="udataPagedataPathContainer" class="udata-pagedata-path-container">\n\n    <div class="udata-pagedata-path-source-list">\n        ',
      '1': '\n        <dl class="udata-path-node">\n            <dd class="udata-path-node-progress-bar" style="width:',
      '2': '%;">\n            </dd>\n            <dt>',
      '3': '</dt>\n            ',
      '4': '\n            <dd>\n                    <span>\n                        ',
      '5': ':',
      '6': '\n                    </span>\n                <strong>',
      '7': '%</strong>\n            </dd>\n            ',
      '8': '\n        </dl>\n        ',
      '9': '\n    </div>\n\n    <div class="udata-pagedata-path-core">\n        <div class="udata-path-core-node">\n            <div class="udata-path-core-node-header">\n                <h2>',
      '10': '</h2>\n            </div>\n        </div>\n    </div>\n\n    <div class="udata-pagedata-path-direction-list">\n        ',
      '11': '\n        <dl class="udata-path-node">\n            <dd class="udata-path-node-progress-bar" style="width:',
      '12': '%;">\n            </dd>\n            <dt>',
      '13': '</dt>\n            <dd>\n                    <span>\n                        PV:',
      '14': '\n                    </span>\n                <strong>',
      '15': '%</strong>\n            </dd>\n            <dt>',
      '16': '</dt>\n            ',
      '17': '\n            <dd>\n                    <span>\n                        ',
      '18': ':',
      '19': '\n                    </span>\n                <strong>',
      '20': '%</strong>\n            </dd>\n            ',
      '21': '\n        </dl>\n        ',
      '22': '\n    </div>\n\n</div>'
    },
    render: function anonymous(__data) {
      __data = __data || {};
      var self = this, temp = [];
      with (__data) {
        temp.push(self.__lines[0]);
        for (var i = 0; i < source.length; i++) {
          var item = source[i];
          temp.push(self.__lines[1]);
          temp.push(item.targets[0].percentage);
          temp.push(self.__lines[2]);
          temp.push(getName(item));
          temp.push(self.__lines[3]);
          for (var j = 0; j < item.targets.length; j++) {
            var _item = item.targets[j];
            temp.push(self.__lines[4]);
            temp.push(_item.name);
            temp.push(self.__lines[5]);
            temp.push(_item.value.toLocaleString());
            temp.push(self.__lines[6]);
            temp.push(_item.percentage);
            temp.push(self.__lines[7]);
          }
          temp.push(self.__lines[8]);
        }
        temp.push(self.__lines[9]);
        temp.push(core.name);
        temp.push(self.__lines[10]);
        for (var i = 0; i < goal.length; i++) {
          var item = goal[i];
          temp.push(self.__lines[11]);
          temp.push(item.targets[0].percentage);
          temp.push(self.__lines[12]);
          temp.push(getName(item));
          temp.push(self.__lines[13]);
          temp.push(item.targets[0].value.toLocaleString());
          temp.push(self.__lines[14]);
          temp.push(item.targets[0].percentage);
          temp.push(self.__lines[15]);
          temp.push(item.name);
          temp.push(self.__lines[16]);
          for (var j = 0; j < item.targets.length; j++) {
            var _item = item.targets[j];
            temp.push(self.__lines[17]);
            temp.push(_item.name);
            temp.push(self.__lines[18]);
            temp.push(_item.value.toLocaleString());
            temp.push(self.__lines[19]);
            temp.push(_item.percentage);
            temp.push(self.__lines[20]);
          }
          temp.push(self.__lines[21]);
        }
        temp.push(self.__lines[22]);
      }
      return temp.join('');
    }
  };
  return exports;
}();
udataViewsMenuWrapper = function (exports) {
  exports = {
    __lines: { '0': '<div id="udata-menu-container">\n\n    <div id="udata-menu-topbar">\n        <a href="javascript:void(0);" class="udata-menu-collapse" title="\u5207\u6362\u5C55\u793A\u65B9\u5F0F"></a>\n        <a href="javascript:void(0);" class="udata-menu-close" title="\u5173\u95ED"></a>\n    </div>\n\n    <div id="udata-menu-header" class="udata-menu-seperator">\n        <div id="udata-menu-logo">\n            <a href="http://shuju.taobao.ali.com/klc/baike/baikeInfo.htm?spm=0.0.0.0.oth9EP&id=366" target="_blank"></a>\n            <span>uData</span>\n        </div>\n    </div>\n\n    <div id="udata-menu-timer" class="udata-menu-seperator">\n        <div class="udata-timer-wrapper">\n            <a href="javascript:void(0);" class="udata-date-ctrl udata-date-prev" data-udata-beacon="udata.1.1"></a>\n            <input class="udata-timer-btn" readonly="readonly" data-udata-beacon="udata.1.3"/>\n            <a href="javascript:void(0);" class="udata-date-ctrl udata-date-next" data-udata-beacon="udata.1.2"></a>\n        </div>\n        <div class="udata-timer-type" data-udata-beacon="udata.1.9">\n            <span class="udata-timer-static">\u5168\u5929</span>\n            <div class="udata-timer-dropdown"></div>\n        </div>\n    </div>\n\n    <div id="udata-menu-con" class="udata-menu-content udata-menu-seperator"></div>\n\n    <div class="udata-menu-modules udata-page-module udata-menu-seperator" data-func="pageData" data-udata-beacon="udata.2.20">\u9875\u9762\u6570\u636E</div>\n\n    <div id="udata-menu-footer">\n        <ul id="udata-menu-toolbar">\n            <li class="udata-lottery-trigger" title="\u70B9\u6211\u62BD\u5956\u54E6\uFF5E"><i class="fa fa-gift"></i></li>\n            <li class="udata-menu-tools" title="\u5DE5\u5177"></li>\n            <li class="udata-menu-help" title="\u5E2E\u52A9"><a target="_blank" href="http://udata.taobao.net/faq"></a></li>\n            <li class="udata-menu-neiwai" title="\u8054\u7CFB\u6211\u4EEC"><a target="_blank" href="https://work.alibaba-inc.com/work/group/2381"></a></li>\n        </ul>\n\n        <ul id="udata-menu-toollist">\n            <li class="reload-udata">\u5237\u65B0uData</li>\n            <!--<li data-func="spmCheck">SPM\u6709\u6548\u68C0\u6D4B</li>-->\n            <li class="udata-tool-wuhen" data-func="goldValidate">\u65E0\u75D5\u57CB\u70B9\u68C0\u6D4B</li>\n            <li class="udata-tool-spmfinder" data-func="spmFind">SPM\u9875\u9762\u5B9A\u4F4D</li>\n            <li class="udata-tool-current-page-spm" data-func="currentSpm">\u67E5\u770B\u5F53\u524D\u9875\u9762SPM</li>\n        </ul>\n    </div>\n\n\n    <div class="udata-real-tips"><a href="javascript:void(0);" class="udata-real-tips-close"></a></div>\n\n</div>' },
    render: function anonymous(__data) {
      __data = __data || {};
      var self = this, temp = [];
      with (__data) {
        temp.push(self.__lines[0]);
      }
      return temp.join('');
    }
  };
  return exports;
}();
udataViewsPanel = function (exports) {
  exports = {
    __lines: { '0': '<div id="udata-guide-container">\n    <div id="udata-guide-wrapper">\n        <a href="javascript:void(0);" class="udata-guide-close"></a>\n        <a href="javascript:void(0);" class="udata-guide-learnmore"></a>\n        <a href="javascript:void(0);" class="udata-guide-iknow"></a>\n    </div>\n</div>\n\n<div class="udata-menu-wrapper"></div>\n<div id="udata-mock-container">\n    <p class="udata-mock-tips">\u60A8\u6B63\u5728\u4F53\u9A8CuData\u7684\u90E8\u5206\u529F\u80FD\uFF0C\u5C55\u793A\u7684\u6570\u636E\u4E0D\u5177\u6709\u6548\u6027\u3002\n        <a class="applyit" href="http://wf.alibaba-inc.com/new/smartflow/default/index?requesttypename=c_data_proj&role=13521" target="_blank">\u7533\u8BF7\u6743\u9650</a>\n    </p>\n</div>' },
    render: function anonymous(__data) {
      __data = __data || {};
      var self = this, temp = [];
      with (__data) {
        temp.push(self.__lines[0]);
      }
      return temp.join('');
    }
  };
  return exports;
}();
udataRecorder = function (exports) {
  var $ = node.all;
  var doc = $(document);
  var dynamic_log = {
      'pageSumm': 'udata.2.24',
      'pageFlow': 'udata.2.20',
      'pageUser': 'udata.2.21',
      'pageReal': 'udata.2.22',
      'pageHour': 'udata.2.23',
      'config': 'udata.3.15',
      'showSub': 'udata.5.1',
      'hideSub': 'udata.5.2',
      'horizontal': 'udata.4.5',
      'vertical': 'udata.4.6',
      'tools': 'udata.4.7',
      'real': 'udata.6.1',
      'hour': 'udata.6.2',
      'noRight': 'udata.6.3',
      'noRealRight': 'udata.6.4',
      'noData': 'udata.6.5',
      'noSPM': 'udata.7'
    };
  exports = {
    baseUrl: '//log.mmstat.com/',
    createUrl: function (key) {
      var that = this, now = +new Date(), version = chrome.runtime.getManifest().version;
      return that.baseUrl + key + '?t=' + now + '&version=' + version + '&viewportSize=' + that.getViewportSize() + '&chromeVersion=' + that.getChromeVersion();
    },
    record: function (log) {
      var key = dynamic_log[log];
      this.send(key);
    },
    send: function (key) {
      var that = this, img = new Image(1, 1);
      img.src = that.createUrl(key);
      img.onload = function () {
        this.onload = null;
      };
    },
    getViewportSize: function () {
      var WIN = $(window), width = WIN.width(), height = WIN.height();
      return width + '*' + height;
    },
    getChromeVersion: function () {
      var ret = '', versionInfo, version;
      if (window.chrome) {
        versionInfo = window.navigator.appVersion.match(/Chrome\/(\d+)\./);
        if (versionInfo && versionInfo.length > 1) {
          version = parseInt(versionInfo[1], 10);
        } else {
          version = 0;
        }
        ret = 'chrome' + version;
      } else {
        ret = 'other';
      }
      return ret;
    },
    init: function () {
      var that = this;
      doc.on('click', function (ev) {
        var $target = $(ev.target), key = $target.attr('data-udata-beacon');
        if (key) {
          that.send(key);
        }
      });
      window.recorder = this;
      return this;
    }
  };
  return exports;
}();
udataCommonGlobal = function (exports) {
  var $ = node.all, Config = udataCommonConfig, io = _io_, pageBody = $(document.body);
  var baseUrl = 'http://dwaplus.taobao.ali.com', preBaseUrl = 'http://apluspre.taobao.ali.com';
  baseUrl = location.search.indexOf('upre=1') > -1 ? preBaseUrl : baseUrl;
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  exports = {
    version: '4.1.2',
    baseUrl: baseUrl,
    ajaxUrl: baseUrl + '/aplus/part/udataResult.htm',
    userId: null,
    debug: false,
    config: Config,
    init: function (config) {
      var config = config || {};
      this.debug = config.debug;
      this.getSPMId();
      this.aplus = location.search.indexOf('isAPlus=true') > -1;
      this.container = $('<div id="udata-container" class="udata-container"></div>');
      pageBody.append(this.container);
    },
    _init: function () {
      var that = this;
      var script_string = '(' + that.interceptor.toString() + ')();';
      var script = document.createElement('script');
      script.innerHTML = script_string;
      document.getElementsByTagName('head')[0].appendChild(script);
      window.addEventListener('message', function (e) {
        if (e.data.src == 'htmlData') {
          that.spma = e.data.spma;
          that.spmb = e.data.spmb;
          that.xwj_id = e.data.xwj_id;
          that.isReady = true;
        }
      });
    },
    getSpmByUrl: function (url, callback) {
      io({
        url: url,
        error: function () {
          callback && callback(null);
        },
        success: function (data) {
          var spm;
          data.replace(/<meta\s+name\s*=\s*["']?(data-spm|spm-id)["']?\s+content\s*=\s*["']?([^'"]+)["']?\s*\/?>/, function (a0, a1, a2) {
            spm = a2;
          });
          if (spm) {
            data.replace(/<body.*data-spm\s*=\s*["']?([^'"]+)["']?\s*>/, function (a0, a1, a2) {
              spm = spm.split('.')[0] + '.' + a1;
            });
          }
          callback && callback(spm);
        }
      });
    },
    getEnv: function () {
      var search = location.search;
      if (search.indexOf('udata=1') != -1 && location.host == 'www.taobao.com') {
        return 'mock';
      } else {
        return 'normal';
      }
    },
    isMock: function () {
      return this.getEnv() == 'mock';
    },
    getMetaSPMData: function (key) {
      var metas = $('meta'), meta, metaName, originSpmId, a, tmp, isWangPu, spmAB = '';
      if (metas) {
        for (var i = metas.length - 1; i >= 0; i--) {
          meta = metas.item(i);
          metaName = meta.attr('name');
          if (metaName == key) {
            originSpmId = meta.attr('content');
            if (originSpmId.indexOf(':') >= 0) {
              a = originSpmId.split(':');
              originSpmId = a[1];
            }
            isWangPu = originSpmId.indexOf('110') == 0;
            spmAB = isWangPu ? '' : originSpmId;
            break;
          }
        }
      }
      return spmAB;
    },
    getSPMIdFromWuHeng: function (spm_a, spm_b) {
      var spm_ab = '';
      spm_a = spm_a.replace(/^{(\w+|-)}$/g, '$1');
      spm_b = spm_b.replace(/^{(\w+|-)}$/g, '$1');
      spm_ab = spm_a + '.' + spm_b;
      if (spm_a == '-' || spm_b == '-') {
        return null;
      }
      if (self.isMobile()) {
        spm_ab = 'w-' + spm_ab;
      }
      this.spmId = spm_ab;
      return spm_ab;
    },
    getSPMReady: function () {
      return this.isReady;
    },
    isMobile: function () {
      var host = location.host, href = location.href, black_lists = [
          'm.taobao.com',
          'm.tmall.com',
          'm.etao.com',
          'm.laiwang.com'
        ];
      var meta = $('meta[name="aplus-terminal"]');
      if (meta && meta.attr('content') == 1) {
        return true;
      }
      for (var i = 0, l = black_lists.length; i < l; i++) {
        if (host == black_lists[i]) {
          return true;
        }
      }
      if (host.indexOf('.m.') != -1 || host.indexOf('.wapa.') != -1) {
        return true;
      }
      if (host.indexOf('http://ju.taobao.com/m/jusp/') == 0) {
        return true;
      }
      return false;
    },
    getSPMId: function () {
      if (this.spmId) {
        return this.spmId;
      }
      var that = this, spmAB = '', a;
      if (that.spma && that.spmb && !that.is1688()) {
        var spm = that.getSPMIdFromWuHeng(that.spma, that.spmb);
        if (spm) {
          return spm;
        }
      }
      spmAB = that.getMetaSPMData('data-spm') || that.getMetaSPMData('spm-id');
      if (!spmAB) {
        return null;
      }
      var body = document.getElementsByTagName('body');
      var spmB;
      a = spmAB.split('.');
      body = body && body.length ? body[0] : null;
      if (body) {
        spmB = $(body).attr('data-spm');
        if (spmB) {
          spmAB = a[0] + '.' + spmB;
        }
      }
      if (that.isMobile()) {
        spmAB = 'w-' + spmAB;
      }
      this.spmId = spmAB;
      if (spmAB.split('.').length == 2) {
        return spmAB;
      } else {
        return null;
      }
    },
    fixSpm: function (spm) {
      if (this.isMobile()) {
        return 'w-' + spm;
      }
      return spm;
    },
    triggerCreateSpmId: function (anchor) {
      var evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('mousedown', true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
      anchor.dispatchEvent(evt);
    },
    is1688: function () {
      var hostname = location.hostname;
      return hostname.indexOf('1688.com') > -1;
    },
    formatMoneyNumber: function (n) {
      var reg = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g, s = n.toString();
      return s.replace(reg, '$1,');
    },
    isString: function (s) {
      return typeof s === 'string';
    },
    parseParam: function (s, separator) {
      var parts, keyValueArray = null, hash = {};
      if (this.isString(s) && s.length > 0) {
        parts = s.split(separator);
        for (var i = 0, len = parts.length; i < len; ++i) {
          keyValueArray = parts[i].split('=');
          hash[keyValueArray[0]] = keyValueArray[1];
        }
      }
      return hash;
    },
    interceptor: function () {
      window.postMessage({
        src: 'htmlData',
        spma: window._SPM_a,
        spmb: window._SPM_b,
        xwj_id: window._ap_xwj ? window._ap_xwj.getId ? window._ap_xwj.getId() : null : null
      }, '*');
    },
    calcIntervalDate: function (endDate, interval) {
      var arrDate = endDate.split('-');
      var end = +new Date(parseInt(arrDate[0]), parseInt(arrDate[1]) - 1, parseInt(arrDate[2]));
      var start = end + interval * 24 * 60 * 60 * 1000;
      var startDate = new Date(start);
      var month = startDate.getMonth() + 1;
      var day = startDate.getDate();
      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;
      return startDate.getFullYear() + '-' + month + '-' + day;
    },
    observe: function (target, handle) {
      var observer = new MutationObserver(function (mutations) {
          handle && handle(mutations);
        });
      var config = {
          childList: true,
          subtree: true
        };
      observer.observe(target, config);
      return observer;
    }
  };
  return exports;
}();
udataCommonLoading = function (exports) {
  var $ = node.all, global = udataCommonGlobal;
  var pageBody = $(document.body), loadingHtml = [
      '<div class="udata-loading-spinner0"></div>',
      '<div class="udata-loading-spinner1"><div class="udata-loading-double-bounce1"></div><div class="udata-loading-double-bounce2"></div></div>',
      '<div class="udata-loading-spinner2"><div class="udata-loading-rect1"></div><div class="udata-loading-rect2"></div><div class="udata-loading-rect3"></div><div class="udata-loading-rect4"></div><div class="udata-loading-rect5"></div></div>',
      '<div class="udata-loading-spinner3"><div class="udata-loading-cube1"></div><div class="udata-loading-cube2"></div></div>',
      '<div class="udata-loading-spinner4"></div>',
      '<div class="udata-loading-spinner5"><div class="udata-loading-dot1"></div><div class="udata-loading-dot2"></div></div>',
      '<div class="udata-loading-spinner6"><div class="udata-loading-bounce1"></div><div class="udata-loading-bounce2"></div><div class="udata-loading-bounce3"></div></div>'
    ], loading = $('<div id="udata-loading-container"></div>');
  exports = {
    init: function () {
      global.container.append(loading);
      loading.hide();
    },
    showMask: function () {
      loading.show();
    },
    showLoading: function (type) {
      type = type || 0;
      loading.append($(loadingHtml[type]))[0].className = 'udata-loading-type' + type;
      loading.show();
    },
    hide: function () {
      loading.empty().hide();
    },
    getLoad: function () {
      return loading;
    }
  };
  return exports;
}();
udataCommonDialog = function (exports) {
  var $ = node.all, global = udataCommonGlobal, loading = udataCommonLoading, udataCon, dialogCon, alertCon;
  function noop() {
  }
  var $dialog = $('<div class="udata-dialog-container">' + '<div class="udata-dialog-wrapper">' + '<a href="javascript:void(0);" class="udata-dialog-close"></a>' + '<div class="udata-dialog-themebar">' + '<span class="udata-dialog-green-bar"></span>' + '<span class="udata-dialog-red-bar"></span>' + '</div>' + '<div class="udata-dialog-body"></div>' + '</div></div>'), $alert = $('<div class="udata-alert-container">' + '<div class="udata-alert-wrapper">' + '<a href="javascript:void(0);" class="udata-alert-close"></a>' + '<div class="udata-dialog-themebar">' + '<span class="udata-dialog-green-bar"></span>' + '<span class="udata-dialog-red-bar"></span>' + '</div>' + '<div class="udata-alert-body"></div>' + '</div></div>'), $message = $('<div class="udata-message-container udata-message-hide">' + '<p class="udata-message-body">\u4EB2\uFF0C\u4F60\u770B\u7684\u6307\u6807\u5F53\u5929\u6CA1\u6709\u6570\u636E\uFF0C\u8BF7\u786E\u8BA4\u4E1A\u52A1\u662F\u5426\u6B63\u5E38\u3002</p>' + '</div>');
  exports = {
    init: function () {
      if (this.inited) {
        return;
      }
      this.inited = true;
      loading.init();
      global.container.append($dialog).append($alert).append($message);
      this.bindEvent();
    },
    bindEvent: function () {
      var self = this;
      $dialog.one('.udata-dialog-close').on('click', function () {
        if (self.closeFn) {
          self.closeFn();
          self.closeFn = null;
        }
        $('.udata-loading-container').removeClass('udata-modal-loading');
        self.hide();
      });
      $alert.one('.udata-alert-close').on('click', function () {
        if (self.cancelFn) {
          self.cancelFn();
          self.cancelFn = null;
        }
        if (self.closeFn) {
          self.closeFn();
          self.closeFn = null;
        }
        self.alertHide();
        loading.hide();
      });
    },
    show: function (body, confirm, cancelFn, hiddenBtn, closeFn) {
      var self = this, alertBody = $alert.one('.udata-alert-body');
      self.cancelFn = cancelFn || noop;
      self.colseFn = closeFn || noop;
      alertBody.empty();
      if (!hiddenBtn) {
        alertBody.append($('<p>' + body + '</p><p class="udata-alert-btn"><a class="udata-alert-confirm-btn" href="javascript:void(0);">\u786E\u8BA4</a><a class="udata-alert-cancel-btn" href="javascript:void(0);">\u53D6\u6D88</a></p>'));
      } else {
        alertBody.append($('<div>' + body + '</div>'));
      }
      $alert.delegate('click', '.udata-alert-close', function () {
        closeFn && closeFn();
        $(this).detach();
      });
      $alert.delegate('click', '.udata-alert-confirm-btn', function () {
        if (confirm) {
          confirm();
        }
        self.alertHide();
        loading.hide();
        $(this).detach();
        return false;
      });
      $alert.delegate('click', '.udata-alert-cancel-btn', function () {
        if (cancelFn) {
          cancelFn();
        }
        self.alertHide();
        loading.hide();
        $(this).detach();
        return false;
      });
      $alert.show();
    },
    showGuide: function () {
      $('#udata-guide-container').show();
    },
    hideGuide: function () {
      $('#udata-guide-container').hide();
      chrome.runtime.sendMessage({
        type: 'isNew',
        isNew: true
      });
    },
    setMessageContent: function (message) {
      $message.one('.udata-message-body').html(message);
    },
    showMessage: function (message, time) {
      var time = time || 6000;
      this.setMessageContent(message);
      $message.removeClass('udata-message-hide').addClass('udata-message-show');
      setTimeout(function () {
        $message.removeClass('udata-message-show').addClass('udata-message-hide');
      }, time);
    },
    showActionMessage: function (message, time) {
      var time = time || 10000;
      this.setMessageContent('\u4EB2\uFF0C\u60A8\u8FD8\u6CA1\u6709\u6743\u9650\uFF0C\u8BF7\u8FDB\u5165<a href="http://wf.alibaba-inc.com/new/smartflow/default/index?requesttypename=c_data_proj&role=13521" target="_blank" style="color:#81a945;">\u6D41\u7A0B\u7BA1\u7406\u7CFB\u7EDF</a>\u7533\u8BF7\u4E00\u4E0B~<span class="tryCon"><a href="http://www.taobao.com?udata=1">\u4F53\u9A8CuData</a></span>');
      $message.removeClass('udata-message-hide').addClass('udata-message-show');
      setTimeout(function () {
        $message.removeClass('udata-message-show').addClass('udata-message-hide');
      }, time);
    },
    showModal: function (callback, size, closeFn) {
      var width = size.width ? size.width : size;
      var dialogBody = $dialog.one('.udata-dialog-body');
      this.closeFn = closeFn;
      if (width) {
        dialogBody.css('width', width + 'px');
      }
      $dialog.removeClass('udata-dialog-absolute').addClass('udata-dialog-fixed').css({
        left: '50%',
        top: '50%'
      });
      dialogBody.css('height', (size.height ? size.height : 490) + 'px');
      dialogBody.empty();
      callback(dialogBody, $dialog);
      loading.showMask();
      $dialog.show();
      $('#udata-loading-container').addClass('udata-modal-loading');
    },
    showDialog: function (callback, width, $target, event) {
      var dialogBody = $dialog.one('.udata-dialog-body');
      if (width)
        dialogBody.css({
          'width': width + 'px',
          'height': 'auto'
        });
      $dialog.removeClass('udata-dialog-fixed').addClass('udata-dialog-absolute');
      if ($target && event) {
        var pos = this.findSuitablePos(width, event.pageX + 6, event.pageY + 6, $target[0]);
        $dialog.css({
          'left': pos.left,
          'top': pos.top
        });
      }
      dialogBody.empty();
      callback(dialogBody, $dialog);
      callback(dialogBody, $dialog);
      $dialog.show();
    },
    hide: function () {
      var dialogBody = $dialog.one('.udata-dialog-body');
      $dialog.removeClass('udata-dialog-absolute').addClass('udata-dialog-fixed').hide();
      loading.hide();
      dialogBody.empty();
    },
    alertHide: function () {
      $alert.hide();
    },
    findSuitablePos: function (width, left, top, target) {
      var pos = target.getBoundingClientRect(), totalWidth = document.documentElement.offsetWidth, desLeft = left, panelWidth = global.container.hasClass('udata-vertical') ? 100 : 0;
      if (pos.left + width + panelWidth > totalWidth) {
        if (width + 100 >= pos.left) {
          desLeft = left - (width - pos.width) + 100;
        } else {
          desLeft = left - (width - pos.width) - 70;
        }
      }
      return {
        left: desLeft + 'px',
        top: top + 'px'
      };
    }
  };
  return exports;
}();
udataDateTime = function (exports) {
  var $ = node.all, global = udataCommonGlobal, Event = _event_, ONE_DAY = 24 * 60 * 60 * 1000;
  function format(date) {
    return date.replace(/^\d{4}-/, '');
  }
  var dateEle;
  exports = S.mix({
    init: function (container, config, callback) {
      var self = this, result = $('.udata-timer-btn', container);
      this.type = config.type || 'off';
      this.date = config.date;
      this.container = container;
      result.val(format(config.date));
      if (!this.calendar) {
        S.use('gallery/calendar/1.2/index', function (S, Calendar) {
          dateEle = $('<div class="udata-date-picker">');
          $('#udata-container').append(dateEle);
          var calendar = new Calendar({
              count: 1,
              selectedDate: new Date(config.date),
              minDate: config.minDate,
              maxDate: config.maxDate,
              isHoliday: false,
              isDateIcon: false,
              container: '.udata-date-picker'
            });
          calendar.hide();
          calendar.on('render', function () {
            this.currentNode = null;
            self.updatePosition(config.layout);
            this.boundingBox.all('.close-btn').show();
          });
          calendar.currentNode = null;
          calendar.on('dateclick', function (date) {
            result.val(format(date.date));
            calendar.hide();
            if (date.date != self.getCurDay) {
              self.setCurType(date.date == moment().format('YYYY-MM-DD') ? 'real' : 'off');
              self.setCurDay(date.date);
              self.fire('date:change', { data: { date: date.date } });
            }
          });
          calendar.render();
          result.on('click', function () {
            calendar.show();
          });
          self.calendar = calendar;
          self.renderDetail(config);
          self.bindEvent();
          callback && callback();
        });
      } else {
        callback && callback();
      }
      return this;
    },
    updatePosition: function () {
      var dateWrapper = $('.udata-timer-wrapper', this.container), offset = dateWrapper[0].getBoundingClientRect(), menuOffset = $('#udata-menu-container')[0].getBoundingClientRect();
      var pos;
      if (global.container.hasClass('udata-vertical')) {
        pos = {
          left: offset.left - 255,
          top: offset.top
        };
      } else {
        pos = {
          left: offset.left,
          top: menuOffset.top - 177
        };
      }
      dateEle.css(pos);
    },
    updateCtrlButton: function () {
      var calendar = this.calendar;
      date = +new Date(this.date), maxDate = +new Date(calendar.userConfig.maxDate), minDate = +new Date(calendar.userConfig.minDate);
      if (+date >= maxDate) {
        $('.udata-date-next', this.container).addClass('udata-date-btn-disabled');
      } else {
        $('.udata-date-next', this.container).removeClass('udata-date-btn-disabled');
      }
      if (+date <= +minDate) {
        $('.udata-date-prev', this.container).addClass('udata-date-btn-disabled');
      } else {
        $('.udata-date-prev', this.container).removeClass('udata-date-btn-disabled');
      }
    },
    bindEvent: function () {
      if (this.hasBindEvent) {
        return;
      }
      this.hasBindEvent = true;
      var self = this;
      self.on('date:change', function (ev) {
        self.updateCtrlButton();
      });
      var timeShow = false;
      this.container.delegate('click', '.udata-timer-type', function (ev) {
        var $this = $(ev.currentTarget), $target = $(ev.target), type, params = {};
        function hide() {
          $this.all('.udata-timer-dropdown').hide();
          timeShow = false;
        }
        if ($target.hasClass('udata-dropdown-selected') || $this.hasClass('udata-timer-disabled')) {
          hide();
          return;
        }
        if (!timeShow) {
          $this.all('.udata-timer-dropdown').show();
          timeShow = true;
          return;
        }
        type = $target.attr('data-type');
        if (!type) {
          hide();
          return;
        }
        $this.all('.udata-dropdown-selected').removeClass('udata-dropdown-selected');
        $target.addClass('udata-dropdown-selected');
        if (type == 'hour') {
          var hour = $target.attr('data-hour'), to = parseInt(hour) + 1;
          params['hour'] = typeof hour == 'number' ? hour < 10 ? '0' + hour : hour : hour;
          hour = hour < 10 ? '0' + hour : hour;
          to = to < 10 ? '0' + to : to;
          $('.udata-timer-static').text(hour + '-' + to + '\u70B9');
          recorder.record('hour');
        } else {
          if (type == 'real') {
            recorder.record('real');
          }
          $('.udata-timer-static').text($target.text());
        }
        hide();
        params['type'] = type;
        $('.udata-timer-dropdown').hide();
        self.fire('time:change', { data: params });
        return false;
      });
      var calendar = self.calendar;
      $('.udata-date-ctrl', this.container).on('click', function (ev) {
        var $target = $(ev.target), date = +new Date(self.date);
        if ($target.hasClass('udata-date-btn-disabled')) {
          return;
        }
        if ($target.hasClass('udata-date-prev')) {
          date = new Date(date - ONE_DAY);
        } else {
          date = new Date(date + ONE_DAY);
        }
        calendar.set('selectedDate', date);
        calendar.fire('dateclick', { date: calendar.getSelectedDate() });
        self.updateCtrlButton();
      });
    },
    disableTime: function () {
      $('.udata-timer-type').addClass('udata-timer-disabled');
    },
    ableTime: function () {
      $('.udata-timer-type').removeClass('udata-timer-disabled');
    },
    getCurDay: function () {
      return this.date;
    },
    setCurDay: function (date) {
      this.date = date;
    },
    getCurType: function () {
      return this.type;
    },
    setCurType: function (type) {
      this.type = type;
    },
    getCurHour: function () {
      return this.hour;
    },
    setCurHour: function (hour) {
      if (~~hour < 10) {
        hour = '0' + hour;
      }
      this.hour = hour;
    },
    getToday: function () {
      return this.today;
    },
    getFormatToday: function () {
      var today = this.maxDate, dates = today.split('-');
      return dates[1] + '-' + dates[2];
    },
    setMaxDate: function (date) {
      this.maxDate = date;
    },
    renderDetail: function (config, hour) {
      if (typeof hour !== 'undefined') {
        hour = hour < 10 ? '0' + hour : hour;
      }
      var self = this;
      this.date = config.date;
      this.minDate = config.minDate;
      this.maxDate = config.maxDate;
      this.today = config.today;
      this.type = config.type;
      var html = '', hourNum = config.hourNum, clazz = this.type == 'hour' ? 'udata-dropdown-first' : 'udata-dropdown-first udata-dropdown-selected';
      if (!hour) {
        if (this.today) {
          $('.udata-timer-static').text('\u5B9E\u65F6');
          html += '<span data-type="real" class="' + clazz + '">\u5B9E\u65F6</span>';
        } else {
          $('.udata-timer-static').text('\u5168\u5929');
          html += '<span data-type="off" class="' + clazz + '">\u5168\u5929</span>';
        }
      } else {
        if (this.today) {
          html += '<span data-type="real" class="udata-dropdown-first">\u5B9E\u65F6</span>';
        } else {
          html += '<span data-type="off" class="udata-dropdown-first">\u5168\u5929</span>';
        }
      }
      html += '<ul>';
      if (hourNum != -1) {
        for (var i = 0; i <= hourNum; i++) {
          var last = i + 1, beginHour = i < 10 ? '0' + i : i, lastHour = last < 10 ? '0' + last : last, hourFormat = beginHour + '-' + lastHour + '\u70B9';
          if (hour && beginHour == hour) {
            html += '<li data-type="hour" data-hour="' + i + '" class="udata-dropdown-selected">' + hourFormat + '</li>';
          } else {
            html += '<li data-type="hour" data-hour="' + i + '">' + hourFormat + '</li>';
          }
        }
      }
      html += '</ul>';
      $('.udata-timer-dropdown', self.container).html(html).attr('data-hour', hour);
    },
    format: function (date) {
      var arr = date.split('-'), d = '';
      arr.push(arr.shift());
      d = arr.join('-');
      return d;
    },
    show: function () {
      this.picker.show();
    },
    destroy: function () {
      if (this.calendar) {
        this.calendar = null;
      }
    }
  }, Event.Target);
  return exports;
}();
udataDrawTool = function (exports) {
  var Global = udataCommonGlobal, Service = udataService;
  Highcharts.setOptions({
    global: { useUTC: false },
    exporting: { enabled: false },
    credits: { enabled: false }
  });
  exports = {
    formatYAxis: function () {
      var n = this.value, m, formatDecimals = function (x) {
          var s, a;
          s = Highcharts.numberFormat(x, x < 10 ? 1 : 0);
          a = s.split('.');
          return !a[1] || a[1] == '0' ? a[0] : s;
        };
      if (n >= 100000000) {
        m = n / 100000000;
        return formatDecimals(m) + '\u4EBF';
      } else if (n >= 10000 && n < 100000000) {
        m = n / 10000;
        return formatDecimals(m) + '\u4E07';
      } else {
        m = n;
        return formatDecimals(m);
      }
    },
    formatNumber: function (n) {
      return n < 10 ? '0' + n : n;
    },
    getTimeFromTimeSlice: function (t) {
      var that = this, dateTime = new Date(t), hour = dateTime.getHours(), minute = dateTime.getMinutes();
      return that.formatNumber(hour) + ':' + that.formatNumber(minute);
    },
    getHourFromTimeSlice: function (t) {
      var that = this, dateTime = new Date(t), hour = dateTime.getHours();
      return that.formatNumber(hour);
    },
    getDateFromTimeSlice: function (t) {
      var that = this, dateTime = new Date(t), month = dateTime.getMonth() + 1, day = dateTime.getDate();
      return month + '-' + day;
    },
    getFullDateFromTimeSlice: function (t) {
      var that = this, dateTime = new Date(t), year = dateTime.getFullYear(), month = dateTime.getMonth() + 1, day = dateTime.getDate();
      return year + '-' + that.formatNumber(month) + '-' + that.formatNumber(day);
    },
    getTimeSliceFromDate: function (date) {
      return +Date.parse(date, 'yyyy-MM-dd');
    },
    filterLegend: function (a, o) {
      var item, name;
      for (var i = 0, l = a.length; i < l; i++) {
        item = a[i];
        name = item.name;
        if (o[name] === false) {
          item.visible = false;
        }
      }
      return a;
    },
    parseRealSeries: function (series) {
      var lastNode;
      for (var i = 0, l = series.length; i < l; i++) {
        lastNode = series[i]['data'].pop();
        series[i]['data'].push({
          x: lastNode[0],
          y: lastNode[1],
          dataLabels: { enabled: true }
        });
      }
    },
    increaseBrightness: function (hex, percent) {
      hex = hex.replace(/^\s*#|\s*$/g, '');
      if (hex.length == 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }
      var r = parseInt(hex.substr(0, 2), 16), g = parseInt(hex.substr(2, 2), 16), b = parseInt(hex.substr(4, 2), 16);
      return '#' + (0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16).substr(1) + (0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16).substr(1) + (0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16).substr(1);
    },
    colorLuminance: function (hex, lum) {
      hex = String(hex).replace(/[^0-9a-f]/gi, '');
      if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      lum = lum || 0;
      var rgb = '#', c, i;
      for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
        rgb += ('00' + c).substr(c.length);
      }
      return rgb;
    },
    allocationColorForPie: function (series, color) {
      var that = this, colors = [
          '#81a945',
          '#2f7ed8',
          '#eb5933',
          '#78979b',
          '#fecd22',
          '#5692b1',
          '#56a67d',
          '#28aec6',
          '#f27935',
          '#90899c'
        ], ret = {}, data = [], item;
      ret.name = series.name;
      for (var i = 0, l = series.data.length; i < l; i++) {
        item = series.data[i];
        data.push({
          x: item[0],
          y: item[1],
          color: that.colorLuminance(color, i / l)
        });
      }
      ret.data = data;
      return [ret];
    },
    drawPieChart: function (el, series, color) {
      var that = this;
      el.attr('id', 'udata-Highcharts' + S.guid());
      el.highcharts = new Highcharts.Chart({
        chart: {
          renderTo: el.attr('id'),
          type: 'pie',
          backgroundColor: 'transparent'
        },
        title: null,
        tooltip: {
          formatter: function () {
            return '<b>' + this.point.x + '</b>: ' + parseFloat(this.percentage).toFixed(2) + ' %';
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: false,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              formatter: function () {
                return this.percentage > 1 ? '<b>' + this.point.x + ':</b> ' + parseFloat(this.percentage).toFixed(2) + '%' : null;
              }
            }
          }
        },
        series: that.allocationColorForPie(series, color)
      });
    },
    drawConcentricCircles: function (el, innerSeries, outerSeries) {
      el.attr('id', 'udata-Highcharts' + S.guid());
      el.highcharts = new Highcharts.Chart({
        chart: {
          renderTo: el.attr('id'),
          type: 'pie',
          backgroundColor: 'transparent'
        },
        plotOptions: {
          pie: {
            allowPointSelect: false,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              formatter: function () {
                return this.percentage > 1 ? '<b>' + this.point.name + ':</b> ' + parseFloat(this.percentage).toFixed(2) + '%' : null;
              }
            }
          }
        },
        title: { text: '' },
        tooltip: {
          formatter: function () {
            return '<b>' + this.point.name + '</b>: ' + parseFloat(this.percentage).toFixed(2) + ' %';
          }
        },
        series: [
          {
            name: 'cores',
            data: innerSeries,
            size: '60%',
            dataLabels: {
              formatter: function () {
                return this.percentage > 7 ? this.point.name : null;
              },
              color: 'white',
              distance: -60
            }
          },
          {
            name: 'Browsers',
            size: '80%',
            innerSize: '60%',
            data: outerSeries,
            formatter: function () {
              return this.percentage > 1 ? '<b>' + this.point.name + ':</b> ' + parseFloat(this.percentage).toFixed(2) + '%' : null;
            }
          }
        ]
      });
    },
    drawLineChart: function (el, categories, series, cacheName, width, height, isHideLegend) {
      var that = this, cache, chartOption = {
          defaultSeriesType: 'spline',
          backgroundColor: 'transparent',
          marginRight: 20
        };
      if (width && S.isNumber(width)) {
        chartOption['width'] = width;
      }
      if (height && S.isNumber(height)) {
        chartOption['height'] = height;
      }
      cache = Service.get(cacheName) || {};
      el.attr('id', 'udata-Highcharts' + S.guid());
      chartOption['renderTo'] = el.attr('id');
      if (!S.isEmptyObject(cache)) {
        that.filterLegend(series, cache);
      }
      el.highcharts = new Highcharts.Chart({
        chart: chartOption,
        credits: { text: '' },
        title: { text: '' },
        xAxis: {
          type: 'datetime',
          tickInterval: 24 * 3600 * 1000 * Math.max(parseInt(categories.length / 10), 1),
          showFirstLabel: true,
          min: that.getTimeSliceFromDate(categories[0]),
          max: that.getTimeSliceFromDate(categories[categories.length - 1]),
          labels: {
            formatter: function () {
              var t = this.value;
              return that.getDateFromTimeSlice(t);
            }
          }
        },
        yAxis: [
          {
            gridLineWidth: 0,
            lineWidth: 1,
            min: 0,
            title: null,
            labels: {
              x: -2,
              color: '#89A54E',
              formatter: that.formatYAxis
            }
          },
          {
            gridLineWidth: 0,
            lineWidth: 0,
            min: 0,
            title: null,
            labels: {
              x: 2,
              color: '#4572A7',
              formatter: that.formatYAxis
            },
            opposite: true
          }
        ],
        tooltip: {
          shared: true,
          crosshairs: true,
          formatter: function () {
            var x = this.x, points = this.points, color, unit, s = '';
            s += that.getFullDateFromTimeSlice(x);
            S.each(points, function (point, i) {
              color = point.series.color;
              unit = point.series.options.unit;
              s += '<br/><span style="color:' + color + '">' + point.series.name + ': ' + Global.formatMoneyNumber(point.y) + (unit || '') + '</span>';
            });
            return s;
          }
        },
        plotOptions: {
          spline: { marker: { enabled: false } },
          series: {
            pointStart: that.getTimeSliceFromDate(categories[0]),
            pointInterval: 24 * 3600 * 1000,
            events: {
              legendItemClick: function (event) {
                var name = this.name;
                cache[name] = !this.visible;
                Service.set(cacheName, cache);
                return true;
              }
            }
          }
        },
        legend: {
          enabled: isHideLegend === true ? false : true,
          floating: false,
          verticalAlign: 'top'
        },
        series: series
      });
      return el.highcharts;
    },
    drawHourChart: function (el, series, type) {
      var that = this, chart, cacheKey = type + 'HourChart', currentSequenceIndex = Service.get(cacheKey) || 0;
      el.attr('id', 'udata-Highcharts' + S.guid());
      chart = new Highcharts.Chart({
        chart: {
          renderTo: el.attr('id'),
          type: 'column',
          backgroundColor: 'transparent'
        },
        title: { text: '' },
        xAxis: {
          tickInterval: 1,
          min: 0,
          max: 23
        },
        yAxis: {
          gridLineWidth: 0,
          lineWidth: 1,
          min: 0,
          title: null,
          labels: {
            x: -2,
            color: '#89A54E',
            formatter: that.formatYAxis
          }
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          },
          series: {
            pointStart: 0,
            pointInterval: 1,
            events: {
              legendItemClick: function (event) {
                var index = this.index, chart = this.chart, series = chart.series, sequence, name;
                if (currentSequenceIndex === index) {
                  return false;
                }
                for (var i = 0, l = series.length; i < l; i++) {
                  sequence = series[i];
                  name = sequence.name;
                  if (sequence.index == index) {
                    sequence.show();
                  } else if (sequence.index == currentSequenceIndex) {
                    sequence.hide();
                  }
                }
                Service.set(cacheKey, index);
                currentSequenceIndex = index;
                return false;
              }
            }
          }
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.x + '\u70B9</b><br/>' + this.series.name + ':' + Global.formatMoneyNumber(this.y);
          }
        },
        legend: {
          enabled: true,
          floating: false,
          verticalAlign: 'top'
        },
        series: series
      });
      el.highcharts = chart;
      return chart;
    },
    drawRealMissionChart: function (el, series) {
      var that = this, chart, startTime;
      startTime = series[0]['data'][0][0];
      el.attr('id', 'udata-Highcharts' + S.guid());
      chart = new Highcharts.Chart({
        chart: {
          renderTo: el.attr('id'),
          type: 'spline',
          backgroundColor: 'transparent',
          marginRight: 20
        },
        title: { text: '' },
        xAxis: {
          labels: {
            formatter: function () {
              var t = this.value;
              return that.getHourFromTimeSlice(t);
            }
          },
          endOnTick: false,
          showFirstLabel: false,
          min: startTime,
          max: startTime + 86400000,
          tickInterval: 3600000
        },
        yAxis: {
          gridLineWidth: 0,
          lineWidth: 1,
          min: 0,
          title: null,
          labels: {
            x: -2,
            color: '#89A54E',
            formatter: that.formatYAxis
          }
        },
        plotOptions: {
          spline: { marker: { enabled: false } },
          series: {
            dataLabels: {
              enabled: false,
              overflow: 'none',
              crop: false
            }
          }
        },
        tooltip: {
          shared: true,
          crosshairs: true,
          formatter: function () {
            var x = this.x, points = this.points, color, s = '';
            s += that.getTimeFromTimeSlice(x);
            S.each(points, function (point, i) {
              color = point.series.color;
              s += '<br/><span style="color:' + color + '">' + point.series.name + ': ' + Global.formatMoneyNumber(point.y) + '</span>';
            });
            return s;
          }
        },
        legend: {
          enabled: true,
          floating: false,
          verticalAlign: 'top'
        },
        series: series
      });
      el.highcharts = chart;
      return chart;
    },
    updateChart: function (el, series) {
      var data, chart = el.highcharts, newSeries, id;
      if (!series) {
        return;
      }
      for (var i = 0, l = series.length; i < l; i++) {
        newSeries = series[i];
        id = newSeries.id;
        data = newSeries.data;
        chart.get(id).setData(data, false);
      }
      chart.redraw();
    },
    drawSimpleColumnChart: function (el, o) {
      var that = this, chart, categories = o.categories, series = o.series, title = o.title, total = series[0]['data'].reduce(function (pv, cv) {
          return pv + cv;
        }, 0);
      that.currentSequenceIndex = 0;
      el.attr('id', 'udata-Highcharts' + S.guid());
      chart = new Highcharts.Chart({
        chart: {
          type: 'column',
          renderTo: el.attr('id'),
          backgroundColor: 'transparent'
        },
        title: { text: title },
        xAxis: { categories: categories },
        yAxis: {
          gridLineWidth: 0,
          lineWidth: 1,
          min: 0,
          title: null,
          labels: {
            x: -2,
            color: '#89A54E',
            formatter: that.formatYAxis
          }
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          },
          series: {
            dataLabels: {
              enabled: true,
              overflow: 'none',
              crop: false,
              formatter: function () {
                var value = this.point.y, percentage = parseFloat(value / total * 100).toFixed(2);
                return percentage + '%';
              }
            }
          }
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' + this.x + ':' + Global.formatMoneyNumber(this.y);
          }
        },
        legend: { enabled: false },
        series: series
      });
      el.highcharts = chart;
      return chart;
    },
    drawSparkLines: function (el, categories, series) {
      var that = this, c = new Highcharts.Chart({
          chart: {
            renderTo: el,
            backgroundColor: null,
            borderWidth: 0,
            type: 'area',
            margin: [
              2,
              0,
              2,
              0
            ],
            width: 205,
            height: 85,
            style: { overflow: 'visible' },
            skipClone: true
          },
          title: { text: '' },
          credits: { enabled: false },
          xAxis: {
            labels: { enabled: false },
            title: { text: null },
            startOnTick: false,
            endOnTick: false,
            tickPositions: [],
            categories: categories
          },
          yAxis: {
            endOnTick: false,
            startOnTick: false,
            labels: { enabled: false },
            title: { text: null },
            tickPositions: [0]
          },
          legend: { enabled: false },
          tooltip: {
            enabled: true,
            formatter: function () {
              var x = this.x, y = this.y, s = '', name = this.series.options.name, unit = this.series.options.unit;
              s = that.getFullDateFromTimeSlice(x);
              s += '<br/><span>' + name + ': ' + Global.formatMoneyNumber(y) + (unit || '') + '</span>';
              return s;
            }
          },
          plotOptions: {
            area: {
              allowPointSelect: false,
              marker: { enabled: false },
              fillColor: 'rgba(108,185,39,0.25)',
              lineColor: 'rgba(108,185,39,1)'
            },
            series: {
              color: 'rgba(108,185,39,1)',
              animation: false,
              lineWidth: 2,
              shadow: false,
              states: { hover: { lineWidth: 2 } },
              fillOpacity: 0.25
            },
            column: {
              negativeColor: '#910000',
              borderColor: 'silver'
            }
          },
          series: [series]
        });
    },
    formulaParams: [
      {
        x1: 14580000000,
        x2: 291600000,
        x3: 12150000,
        x4: 81000,
        y1: 1080,
        y2: 90000,
        y3: 1200,
        y4: 4,
        y5: 75
      },
      {
        x1: 91466718750,
        x2: 804178125,
        x3: 10125000,
        x4: 67500,
        y1: 135,
        y2: 4516875,
        y3: 9600,
        y4: 32,
        y5: 500
      },
      {
        x1: 168353437500,
        x2: 1316756250,
        x3: 8100000,
        x4: 54000,
        y1: 270,
        y2: 4156875,
        y3: 4800,
        y4: 16,
        y5: 200
      },
      {
        x1: 245240156250,
        x2: 1829334375,
        x3: 6075000,
        x4: 40500,
        y1: 135,
        y2: 12110625,
        y3: 9600,
        y4: 32,
        y5: 300
      },
      {
        x1: 322126875000,
        x2: 2341912500,
        x3: 4050000,
        x4: 27000,
        y1: 540,
        y2: 3976875,
        y3: 2400,
        y4: 8,
        y5: 50
      },
      {
        x1: 399013593750,
        x2: 2854490625,
        x3: 2025000,
        x4: 13500,
        y1: 135,
        y2: 19704375,
        y3: 9600,
        y4: 32,
        y5: 100
      }
    ],
    numerator: function (a) {
      return Math.sqrt(1440000 + 588300 * a - 1961 * a * a);
    },
    denominator: function (a) {
      return 11750625 - 4800 * a + 16 * a * a;
    },
    funnelFormula: function (a, i) {
      var res = {}, x, y, p = this.formulaParams[i], n = this.numerator(a), d = this.denominator(a);
      x = (270 * a + p.x1 / d - p.x2 * a / d + 1944000 * a * a / d - 4320 * a * a * a / d + p.x3 * n / d - p.x4 * a * n / d) / 270;
      y = p.y1 * (p.y2 - p.y3 * a + p.y4 * a * a + p.y5 * n) / d;
      return {
        x: x,
        y: y
      };
    },
    drawFunnelChart: function (data) {
      var svg = d3.select('.udata-pageData-summ-funnel-chart'), bg = svg.append('g').attr('class', 'udata-pageData-summ-funnel-bg').attr('transform', 'translate(0, 120)'), ring = svg.append('g').attr('class', 'udata-pageData-summ-funnel-ring-con').attr('transform', 'translate(0, 120)'), WIDTH = 150, outerPoints = [
          {
            x: 9.19,
            y: 16.54
          },
          {
            x: 32.66,
            y: 58.79
          },
          {
            x: 56.13,
            y: 101.03
          },
          {
            x: 79.59,
            y: 143.27
          },
          {
            x: 103.06,
            y: 185.51
          },
          {
            x: 126.53,
            y: 227.76
          }
        ];
      bg.append('path').attr('d', 'M150 48 A 150 48 0 0 1 150 -48').attr('fill', 'none').attr('stroke', '#b9c08a');
      bg.append('path').attr('d', 'M150 85 A 125 40 0 0 1 32.66 58.79 L 9.19 16.54 A 150 48 0 0 0 150 48Z').attr('fill', '#eaecdd').attr('stroke', '#FFF').attr('stroke-width', 0);
      bg.append('path').attr('d', 'M150 122 A 100 32 0 0 1 56.13 101.03 L 32.66 58.79 A 125 40 0 0 0 150 85Z').attr('fill', '#eedec5').attr('stroke', '#FFF').attr('stroke-width', 0);
      bg.append('path').attr('d', 'M150 159 A 75 24 0 0 1 79.59 143.27 L 56.13 101.03 A 100 32 0 0 0 150 122Z').attr('fill', '#eaecdd').attr('stroke', '#FFF').attr('stroke-width', 0);
      bg.append('path').attr('d', 'M150 196 A 50 16, 0, 0, 1, 103.06 185.51 L 79.59 143.27 A 75 24, 0, 0, 0, 150 159Z').attr('fill', '#eedec5').attr('stroke', '#FFF').attr('stroke-width', 0);
      bg.append('path').attr('d', 'M150 233 A 25 8, 0, 0, 1, 126.53 227.76 L 103.06 185.51 A 50 16, 0, 0, 0, 150 196Z').attr('fill', '#eaecdd').attr('stroke', '#FFF').attr('stroke-width', 0);
      bg.append('path').attr('d', 'M150 270 L 126.53 227.76 A 25 8, 0, 0, 0, 150 233Z').attr('fill', '#eedec5').attr('stroke', '#FFF').attr('stroke-width', 0);
      var _this = this;
      var getPaths = function (percentages) {
        var innerPoints = [];
        percentages.forEach(function (p, i) {
          if (i !== percentages.length - 1) {
            innerPoints.push(_this.funnelFormula(WIDTH * (1 - p), i + 1));
          }
          innerPoints.push(_this.funnelFormula(WIDTH * (1 - p), i));
        });
        var paths = [
            [
              'M150 85 A 125 40 0 0 1',
              'A 150 48, 0, 0, 0, 150 48Z'
            ],
            [
              'M150 122 A 100 32 0 0 1',
              'A 125 40 0 0 0 150 85Z'
            ],
            [
              'M150 159 A 75 24 0 0 1',
              'A 100 32 0 0 0 150 122Z'
            ],
            [
              'M150 196 A 50 16 0 0 1',
              'A 75 24 0 0 0 150 159Z'
            ],
            [
              'M150 233 A 25 8 0 0 1',
              'A 50 16 0 0 0 150 196Z'
            ]
          ].map(function (elem) {
            var p1 = innerPoints.shift(), p2 = innerPoints.shift();
            return [
              elem[0],
              p1.x,
              p1.y,
              'L',
              p2.x,
              p2.y,
              elem[1]
            ].join(' ');
          });
        var p = innerPoints.shift();
        paths.push([
          'M150 270 L',
          p.x,
          p.y,
          'A 25 8 0 0 0 150 233Z'
        ].join(' '));
        return paths;
      };
      var colors = [
          '#b9c08a',
          '#e5ac67',
          '#b9c08a',
          '#e5ac67',
          '#b9c08a',
          '#e5ac67'
        ];
      var doms = colors.map(function (color) {
          return ring.append('path').attr('fill', color);
        });
      var iter = function (progess) {
        var paths = getPaths(data.map(function (elem) {
            return elem * progess;
          }));
        doms.forEach(function (dom, i) {
          dom.attr('d', paths[i]);
        });
        if (progess < 1) {
          setTimeout(function () {
            iter(progess + 0.04);
          }, 30);
        }
      };
      iter(0);
    },
    updateFunnelChart: function (data) {
    }
  };
  return exports;
}();
udataResponse = function (exports) {
  var dialog = udataCommonDialog, datetime = udataDateTime, authority = udataAuthority, $ = node.all;
  exports = {
    errors: {
      '231': '\u6CA1\u6709\u767B\u5F55\uFF01',
      '401': '\u6CA1\u6709\u6743\u9650\uFF01',
      '404': '\u6CA1\u6709\u83B7\u53D6\u5230\u5BF9\u5E94\u6570\u636E\uFF01',
      '601': '\u4F20\u53C2\u9519\u8BEF\uFF01',
      '602': '\u56E0\u6570\u636E\u91CF\u592A\u5927\uFF0C\u8BE5\u6570\u636E\u6682\u65F6\u4E0D\u63D0\u4F9B\uFF01'
    },
    otherError: '\u672A\u77E5\u9519\u8BEF\uFF01',
    getErrorText: function (code) {
      var type = 'off', errorText;
      if (code == 401) {
        errorText = authority.getNoAuthorityText(type);
      } else {
        errorText = this.errors[code] || this.otherError;
      }
      return errorText;
    },
    process: function (res, success, fail) {
      var that = this, code = res.status.code, errorText;
      if (code == 231) {
        dialog.show('\u4EB2\uFF0C\u60A8\u7684\u6D4F\u89C8\u5668\u6CA1\u6709\u8BC1\u4E66\u65E0\u6CD5\u76F4\u63A5\u4F7F\u7528uData\u3002\u8BF7\u76F4\u63A5\u8BBF\u95EE<a target="_blank" href="http://dwaplus.taobao.ali.com/">Aplus\u8FDB\u884C\u767B\u5F55</a>\uFF0C\u6216\u662F<a target="_blank" href="https://flow.cn.alibaba-inc.com/certca.nsf">\u4E0B\u8F7D\u8BC1\u4E66</a>');
        return;
      }
      if (code == 405) {
        dialog.showMessage(res.status.message || that.getErrorText(code), 3 * 1000);
        if (res.params.type == 'real') {
          datetime.disableTime();
        }
      } else {
        datetime.ableTime();
      }
      if (code == 206) {
        dialog.showMessage(res.status.message || that.getErrorText(code), 3 * 1000);
        $('#udata-loading-container').hide();
        return;
      }
      if (res.params.event_submit_doGetPanel) {
        if ([
            200,
            401,
            404,
            405,
            206
          ].indexOf(code) > -1) {
          if (code == 401 && res.params.type == 'real') {
            dialog.showMessage('<div>\u4EB2\uFF0C\u60A8\u8FD8\u6CA1\u6709\u67E5\u770B\u5B9E\u65F6\u6570\u636E\u7684\u6743\u9650\uFF0C\u8BF7<a href="http://wf.alibaba-inc.com/new/smartflow/default/index?requesttypename=c_data_proj&role=13521" target="_blank">\u70B9\u51FB\u8BE5\u94FE\u63A5</a>\u7533\u8BF7\u6743\u9650\uFF01</div>', 10 * 1000);
          }
          return success(res.data, res);
        }
      }
      if (code == 200) {
        return success(res.data, res);
      } else {
        errorText = res.status.message || that.getErrorText(code);
        if (fail && S.isFunction(fail)) {
          return fail(errorText, code);
        } else {
          if (code == 601) {
            dialog.showMessage('\u6570\u636E\u63A5\u53E3\u5F02\u5E38');
          } else if (code == 404 || code == 602) {
            dialog.showMessage(errorText);
            if (code == 404) {
              recorder.record('noData');
            }
          } else {
            dialog.show(errorText);
            if (code == 401) {
              recorder.record('noRight');
            }
          }
        }
      }
    }
  };
  return exports;
}();
udataCommonErrorHandle = function (exports) {
  var loading = udataCommonLoading, dialog = udataCommonDialog, connect = udataConnect;
  exports = {
    unauthorized: function () {
      dialog.show('<div class="udata-alert-password">\u4EB2\uFF0C\u60A8\u7684\u6D4F\u89C8\u5668\u6CA1\u6709\u8BC1\u4E66\u65E0\u6CD5\u76F4\u63A5\u4F7F\u7528uData\u3002\u8BF7\u76F4\u63A5\u8BBF\u95EEA+\u8FDB\u884C\u767B\u5F55\uFF1A<p class="udata-alert-right"><a class="visit_aplus" href="http://dwaplus.taobao.ali.com/" target="_blank">\u767B\u9646A+</a></p></div>', function () {
      }, function () {
      }, true, function () {
        connect.post('/close');
      });
    }
  };
  return exports;
}();
udataAppsSpmImagePopup = function (exports) {
  var $ = node.all;
  var view = udataViewsImagePopup;
  exports = function (container) {
    var $el = $(container);
    $el.delegate('dblclick', '.image-popup-target', popup);
    $el.delegate('click', '.image-popup-btn', popup);
    function popup(evt) {
      var $target = $(evt.currentTarget);
      $popup = $(view.render({
        spm: $target.attr('data-spm'),
        src: $target.attr('data-src'),
        src0: $target.attr('data-src0')
      }));
      $popup.delegate('click', '.image-popup-switch, .image-popup-switch-off', function () {
        $popup.one('.image-popup-content').toggleClass('active');
      });
      $('body').append($popup);
      $popup.one('.image-popup-close').on('click', function () {
        $popup.remove();
      });
      $(document).on('keyup', function fn(evt) {
        if (evt.keyCode === 27) {
          $popup.remove();
          $(document).detach('keyup', fn);
        }
      });
    }
  };
  return exports;
}();
udataChartMenu = function (exports) {
  var $ = node.all, global = udataCommonGlobal, Event = _event_, localStorage = udataLocalStorage, view = udataViewsChartMenu, defaultConfig = {
      view: [
        {
          'type': 1,
          'label': '\u6298\u7EBF\u56FE'
        },
        {
          'type': 2,
          'label': '\u67F1\u72B6\u56FE'
        },
        {
          'type': 3,
          'label': '\u5806\u53E0\u56FE'
        }
      ],
      currentView: 1,
      compare: true,
      download: false
    }, HIDE = true;
  var key = 'chart-menu-url', tpl;
  function ChartMenu(host, config) {
    this.host = $(host);
    this.status = HIDE;
    this.config = S.merge(defaultConfig, config);
    this.init();
  }
  S.augment(ChartMenu, Event.Target, {
    downloadUrl: global.baseUrl + '/aplus/analysis/flux/spmExport.htm',
    init: function () {
      this.container = $(view.render(this.config));
      this.menu = this.container.one('.udata-chart-menu');
      this.pageList = this.container.one('.chart-menu-pages');
      if (this.pageList) {
        tpl = this.pageList.html();
        this.renderPages(localStorage.get(key) || [{
            spm: '1.7274553',
            name: '\u6DD8\u5B9D\u9996\u9875'
          }]);
      }
      this.host.prepend(this.container);
      if (this.config.back) {
        this.container.one('.udata-chart-back').show();
      }
      this.bindEvent();
    },
    bindEvent: function () {
      var self = this, menu = this.container.one('.udata-chart-menu');
      this.container.delegate('click', '.udata-chart-menu-trigger', function (ev) {
        if (self.status === HIDE) {
          self.show();
        } else {
          self.hide();
        }
      }).delegate('click', '.menu-main-item-trigger', function (ev) {
        var $target = $(ev.currentTarget), $menu = $target.parent().one('.udata-chart-submenu');
        if ($menu) {
          self.container.all('.udata-chart-submenu').hide();
          $menu.show();
        }
      }).delegate('click', '.view-type', function (ev) {
        var $target = $(ev.currentTarget);
        if ($target.hasClass('selected')) {
          self.hide();
          return;
        }
        self.container.all('.view-type').removeClass('selected');
        $target.addClass('selected');
        self.fire('view:change', { viewtype: $target.attr('data-type') });
        self.hide();
      }).delegate('click', '.compare-url', function (ev) {
        var $target = $(ev.currentTarget), url = $target.attr('data-spm');
        self.fire('url', { url: url });
        self.hide();
      }).delegate('click', '.download', function () {
        self.fire('download');
        self.hide();
      }).delegate('click', '.udata-chart-back', function (ev) {
        self.fire('back');
        self.hide();
      }).delegate('keydown', '.url-input', function (ev) {
        var $target = $(ev.currentTarget);
        if (ev.which == 13) {
          var url = $target.val();
          self.fire('url', { url: url });
          $target.val('');
          self.hide();
        }
      });
      $(document.body).on('click', function (ev) {
        if (!self.container) {
          return;
        }
        if (!self.container[0].contains(ev.target)) {
          self.hide();
        }
      });
    },
    enableBack: function (able) {
      if (typeof able == 'undefined') {
        able = true;
      }
      var back = this.container.one('.udata-chart-back');
      if (able) {
        back.show();
      } else {
        back.hide();
      }
    },
    disableBack: function () {
      this.enableBack(false);
    },
    renderPages: function (pages) {
      var html = [];
      S.each(pages, function (page) {
        html.push(S.substitute(tpl, page));
      });
      this.pageList.html(html.join(''));
    },
    addPage: function (page) {
      var pages = localStorage.get(key) || [], has = false;
      pages.forEach(function (_page) {
        if (_page.spm == page.spm) {
          has = true;
          return false;
        }
      });
      if (has) {
        return;
      }
      pages.push(page);
      if (pages.length > 5) {
        pages = pages.slice(pages.length - 5);
      }
      localStorage.set(key, pages);
      this.renderPages(pages);
    },
    setCurrentView: function (type) {
      var viewMenu = this.menu.all('.view-type');
      viewMenu.each(function (view) {
        if (view.attr('data-type') == type) {
          view.addClass('selected');
        } else {
          view.removeClass('selected');
        }
      });
    },
    openDownloadPage: function (data) {
      window.open(this.downloadUrl + '?' + S.param(data));
    },
    hide: function () {
      this.status = HIDE;
      this.menu.hide();
      this.menu.all('.udata-chart-submenu').hide();
      this.fire('hide');
    },
    show: function () {
      this.status = !HIDE;
      this.menu.show();
      this.fire('show');
    },
    destroy: function () {
      this.container.undelegate().remove();
      this.container = null;
    }
  });
  exports = ChartMenu;
  return exports;
}();
udataCommonMultiChart = function (exports) {
  var $ = node.all, global = udataCommonGlobal, drawTool = udataDrawTool, backgroundLocalStorage = udataService;
  Highcharts.setOptions({ global: { useUTC: true } });
  function multiChart(options) {
    this.init(options);
  }
  multiChart.prototype = {
    defaultOptions: {
      container: null,
      seriesType: 'spline',
      statusSeriesType: 'column',
      onClick: function () {
      }
    },
    init: function (options) {
      var that = this, format = 'YYYY-MM-DD';
      that.options = {};
      that.options = S.merge(that.defaultOptions, options);
      that.trendSeriesType = that.options.seriesType;
      that.options.container.attr('id', 'udata-Highcharts' + S.guid());
      that.max = 0;
      that.min = 0;
    },
    reset: function () {
      var that = this;
      if (that.options.ajaxOptions.comparisonSpmId) {
        that.deleteComparison();
      }
    },
    back: function () {
      var that = this;
      that.switchChart(that.trendSeriesType);
    },
    getCurrentSeriesType: function () {
      return this.options.seriesType;
    },
    setCurrentSeriesType: function (seriesType) {
      this.options.seriesType = seriesType;
    },
    drawChart: function (categories, series) {
      var that = this;
      switch (that.options.seriesType) {
      case 'spline': {
          that.chart = that.drawLine(categories, series);
          break;
        }
      case 'area': {
          that.chart = that.drawArea(categories, series);
          break;
        }
      case 'pie': {
          that.chart = that.drawPie(categories, series);
          break;
        }
      case 'column': {
          that.chart = that.drawColumn(categories, series);
          break;
        }
      default: {
        }
      }
    },
    setExtremes: function (chart) {
      var extremes = chart.yAxis[0].getExtremes(), dataMin = extremes.dataMin, dataMax = extremes.dataMax, range = dataMax - dataMin, region = range * 0.25, min = Math.max(dataMin - region, 0), max = dataMax + region;
      chart.yAxis[0].setExtremes(min, max);
    },
    getColor: function (i) {
      var that = this, l = that.options.colors.length;
      return that.options.colors[i % l];
    },
    drawLine: function (categories, series) {
      var that = this;
      return new Highcharts.Chart({
        chart: {
          renderTo: that.options.container.attr('id'),
          defaultSeriesType: 'spline',
          backgroundColor: 'transparent',
          marginRight: 20,
          events: {
            click: function (e) {
              var date = drawTool.getFullDateFromTimeSlice(e.xAxis[0].value);
              that.options.onClick(date);
            }
          }
        },
        credits: { text: '' },
        title: { text: '' },
        xAxis: {
          type: 'datetime',
          tickInterval: 24 * 3600 * 1000 * Math.max(parseInt(categories.length / 10), 1),
          showFirstLabel: true,
          min: drawTool.getTimeSliceFromDate(categories[0]),
          max: drawTool.getTimeSliceFromDate(categories[categories.length - 1]),
          labels: {
            formatter: function () {
              var t = this.value;
              return drawTool.getDateFromTimeSlice(t);
            }
          }
        },
        yAxis: [
          {
            gridLineWidth: 0,
            lineWidth: 1,
            title: null,
            labels: {
              x: -2,
              color: '#89A54E',
              formatter: drawTool.formatYAxis
            }
          },
          {
            gridLineWidth: 0,
            lineWidth: 0,
            min: 0,
            title: null,
            labels: {
              x: 2,
              color: '#4572A7',
              formatter: drawTool.formatYAxis
            },
            opposite: true
          }
        ],
        tooltip: {
          shared: true,
          crosshairs: true,
          formatter: function () {
            var x = this.x, points = this.points, color, unit, title, map = {}, s = '', ret = '';
            ret += drawTool.getFullDateFromTimeSlice(x);
            S.each(points, function (point, i) {
              color = point.series.color;
              unit = point.series.options.unit;
              title = point.series.options.title;
              s = '<br/><span style="color:' + color + ';">' + point.series.name + ': ' + global.formatMoneyNumber(point.y) + (unit || '') + '</span>';
              if (map[title]) {
                map[title].push(s);
              } else {
                map[title] = [s];
              }
            });
            for (var i in map) {
              ret += '<br/><span>     </span><br/><strong style="font-size:10px;">' + i + '</strong>';
              ret += map[i].join('');
            }
            return ret;
          }
        },
        plotOptions: {
          spline: {
            marker: { enabled: false },
            events: {
              click: function (e) {
                var date = drawTool.getFullDateFromTimeSlice(e.point.x);
                that.options.onClick(date);
              },
              afterAnimate: function (e) {
                that.setExtremes(this.chart);
              },
              hide: function (e) {
                that.setExtremes(this.chart);
              },
              show: function (e) {
                that.setExtremes(this.chart);
              }
            }
          },
          series: {
            pointStart: drawTool.getTimeSliceFromDate(categories[0]),
            pointInterval: 24 * 3600 * 1000
          }
        },
        legend: { enabled: false },
        series: series
      });
    },
    drawArea: function (categories, series) {
      var that = this, isSharedToolTip = series.length <= 6;
      return new Highcharts.Chart({
        chart: {
          renderTo: that.options.container.attr('id'),
          backgroundColor: 'transparent',
          defaultSeriesType: 'area',
          marginRight: 20,
          events: {
            click: function (e) {
              var date = drawTool.getFullDateFromTimeSlice(e.xAxis[0].value);
              that.options.onClick(date);
            }
          }
        },
        credits: { text: '' },
        title: { text: '' },
        xAxis: {
          type: 'datetime',
          tickInterval: 24 * 3600 * 1000 * Math.max(parseInt(categories.length / 10), 1),
          min: drawTool.getTimeSliceFromDate(categories[0]),
          max: drawTool.getTimeSliceFromDate(categories[categories.length - 1]),
          labels: {
            formatter: function () {
              var t = this.value;
              return drawTool.getDateFromTimeSlice(t);
            }
          }
        },
        yAxis: [
          {
            gridLineWidth: 0,
            lineWidth: 1,
            min: 0,
            title: null,
            labels: {
              x: -2,
              color: '#89A54E',
              formatter: drawTool.formatYAxis
            }
          },
          {
            gridLineWidth: 0,
            lineWidth: 0,
            min: 0,
            title: null,
            labels: {
              x: 2,
              color: '#4572A7',
              formatter: drawTool.formatYAxis
            },
            opposite: true
          }
        ],
        tooltip: {
          shared: isSharedToolTip,
          crosshairs: isSharedToolTip,
          formatter: function () {
            var x = this.x, points, name, color, unit, s = drawTool.getFullDateFromTimeSlice(x);
            if (isSharedToolTip) {
              points = this.points;
              S.each(points, function (point, i) {
                color = point.series.color;
                unit = point.series.options.unit;
                s += '<br/><span style="color:#000;">' + point.series.name + ': ' + parseFloat(point.percentage).toFixed(2) + '%</span>';
              });
            } else {
              name = this.series.name;
              color = this.series.color;
              unit = this.series.options.unit;
              s += '<br/><span>' + name + ': ' + parseFloat(this.percentage).toFixed(2) + '%</span>';
            }
            return s;
          }
        },
        plotOptions: {
          area: {
            stacking: 'percent',
            lineColor: '#fff',
            lineWidth: 1,
            marker: { enabled: false },
            events: {
              click: function (e) {
                var date = drawTool.getFullDateFromTimeSlice(e.point.x);
                that.options.onClick(date);
              }
            }
          },
          series: {
            marker: { enabled: false },
            trackByArea: true,
            pointStart: drawTool.getTimeSliceFromDate(categories[0]),
            pointInterval: 24 * 3600 * 1000
          }
        },
        legend: { enabled: false },
        series: series
      });
    },
    drawPie: function (categories, series) {
      var that = this;
      return new Highcharts.Chart({
        chart: {
          renderTo: that.options.container.attr('id'),
          type: 'pie',
          backgroundColor: 'transparent'
        },
        title: null,
        xAxis: { categories: categories },
        tooltip: {
          formatter: function () {
            return '<b>' + categories[this.point.x] + '</b>: ' + parseFloat(this.percentage).toFixed(2) + ' %';
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: false,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              formatter: function () {
                return this.percentage > 1 ? '<b>' + categories[this.point.x] + ':</b> ' + parseFloat(this.percentage).toFixed(2) + '%' : null;
              }
            }
          }
        },
        legend: { enabled: false },
        series: series
      });
    },
    drawColumn: function (categories, series) {
      var that = this, chart, total = series[0]['data'].reduce(function (pv, cv) {
          return pv + cv;
        }, 0);
      return new Highcharts.Chart({
        chart: {
          renderTo: that.options.container.attr('id'),
          type: 'column',
          backgroundColor: 'transparent'
        },
        title: { text: null },
        xAxis: { categories: categories },
        yAxis: {
          gridLineWidth: 0,
          lineWidth: 1,
          min: 0,
          title: null,
          labels: {
            x: -2,
            color: '#89A54E',
            formatter: drawTool.formatYAxis
          }
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
            grouping: false
          },
          series: {
            dataLabels: {
              enabled: false,
              overflow: 'none',
              crop: false,
              formatter: function () {
                var value = this.point.y, percentage = parseFloat(value / total * 100).toFixed(2);
                return percentage + '%';
              }
            }
          }
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' + this.x + ':' + global.formatMoneyNumber(this.y);
          }
        },
        legend: { enabled: false },
        series: series
      });
    },
    switchChart: function (seriesType, categories, series) {
      var that = this;
      that.options.seriesType = seriesType;
      that.drawChart(categories, series);
    },
    getSeriesById: function (id) {
      var that = this, series = that.chart.series, ret = [];
      for (var i = 0, l = series.length; i < l; i++) {
        if (series[i].options.id == id) {
          ret.push(series[i]);
        }
      }
      return ret;
    },
    chooseLegend: function (id, toHide) {
      var that = this, chart = that.chart, series = that.getSeriesById(id);
      that.handleSeries(series, toHide);
    },
    handleSeries: function (a, toHide) {
      for (var i = 0, l = a.length; i < l; i++) {
        a[i][toHide ? 'hide' : 'show']();
      }
    },
    hideAllSeries: function () {
      var that = this;
      series = that.chart.series;
      for (var i = 0, l = series.length; i < l; i++) {
        series[i].hide();
      }
    }
  };
  exports = multiChart;
  return exports;
}();
udataRealMission = function (exports) {
  var $ = node.all, IO = _io_, global = udataCommonGlobal, response = udataResponse, dialog = udataCommonDialog;
  var RealMission = function (options) {
    this.init(options);
  };
  RealMission.prototype = {
    defaultOptions: {
      delay: 60000,
      url: global.ajaxUrl,
      data: {},
      success: function () {
      },
      fail: null
    },
    currentTimer: null,
    currentRequest: null,
    init: function (options) {
      var that = this;
      that.options = {};
      that.options = S.merge(that.options, that.defaultOptions, options);
    },
    stopInterval: function () {
      var that = this;
      if (that.currentTimer) {
        window.clearInterval(that.currentTimer);
        that.currentTimer = null;
      }
    },
    abortRequest: function () {
      var that = this;
      if (that.currentRequest) {
        that.currentRequest.abort();
        that.currentRequest = null;
      }
    },
    request: function () {
      var that = this;
      that.options.data['t'] = +new Date();
      that.options.data.spmId = global.spmId;
      that.abortRequest();
      currentRequest = new IO({
        url: that.options.url,
        data: that.options.data,
        dataType: 'json',
        timeout: 10,
        success: function (o) {
          var code = o.code, data, errorText;
          if (!o) {
            return;
          }
          if (code == 200) {
            data = o.data;
            that.options.success(data, o);
          } else {
            that.stop();
            errorText = o.status.message || response.getErrorText(o);
            if (that.options.fail && S.isFunction(that.options.fail)) {
              that.options.fail(errorText, code);
            } else {
              if (code == 404 || code == 602) {
                dialog.showMessage(errorText);
                if (code == 404) {
                  recorder.record('noData');
                }
              } else {
                dialog.show(errorText);
                if (code == 401) {
                  recorder.record('noRealRight');
                }
              }
            }
          }
          currentRequest = null;
        },
        error: function () {
          console.info('#\u5B9E\u65F6\u63A5\u53E3\u51FA\u9519\uFF01#');
          that.stop();
          currentRequest = null;
          $('#udata-loading-container').hide();
          dialog.showMessage('<div>\u670D\u52A1\u5668\u8D85\u65F6\uFF0C\u8FC7\u6BB5\u65F6\u95F4\u518D\u6765\u8BD5\u8BD5\u5427\uFF5E</div>', 10 * 1000);
        }
      });
    },
    run: function (param) {
      var that = this;
      if (param) {
        that.options.data = S.merge(that.options.data, param);
      }
      that.request();
      that.stopInterval();
      that.currentTimer = window.setInterval(function () {
        that.request();
      }, that.options.delay);
    },
    stop: function () {
      var that = this;
      that.currentRequest = null;
      that.stopInterval();
    }
  };
  exports = RealMission;
  return exports;
}();
udataDataService = function (exports) {
  var $ = node.all, global = udataCommonGlobal, dialog = udataCommonDialog, IO = _io_, date = udataDateTime, Loading = udataCommonLoading, event = _event_, ERROR_CODE = global.config.ERROR_CODE;
  function Request(params, options) {
    var self = this;
    this._timeout = 10;
    this.params = params;
    options = options || {};
    setTimeout(function () {
      self.request = IO({
        url: options.url || global.ajaxUrl,
        data: params,
        timeout: self._timeout,
        dataType: 'json',
        success: function (res) {
          if (res.status.code == 200) {
            self.fire('done', { _data: [res.data] });
          } else {
            self.fire('error', {
              _data: [
                res.status,
                res.data
              ]
            });
          }
        },
        error: function (data, type) {
          var status = {};
          switch (type) {
          case 'parser error':
            status.code = ERROR_CODE['NOT_LOGIN'];
            status.message = '\u8BF7\u5148\u767B\u5F55';
            break;
          case 'timeout':
            status.code = ERROR_CODE['TIMEOUT'];
            status.message = '\u670D\u52A1\u5668\u8D85\u65F6\uFF01';
            break;
          }
          self.fire('error', { _data: [status] });
        }
      });
    }, 0);
  }
  S.augment(Request, event.Target, {
    abort: function () {
      if (this.request) {
        this.request.abort();
        this.request = null;
      }
      return this;
    },
    _bind: function (name, f) {
      var self = this;
      this.on(name, function (ev) {
        f && f.apply(self, ev._data);
      });
      return this;
    },
    timeout: function (t) {
      this._timeout = t || this._timeout;
      return this;
    },
    done: function (f) {
      return this._bind('done', f);
    },
    error: function (f, intercept) {
      if (intercept) {
        this.detach('error');
      }
      return this._bind('error', f);
    }
  });
  function getParams() {
    var args = [].slice.call(arguments).filter(function (arg) {
        return arg;
      });
    return S.merge.apply(null, [{
        mock: global.isMock() ? 1 : 0,
        action: 'udataAction',
        _t: Date.now(),
        spmId: global.spmId,
        date: date.getCurDay() || moment().add('days', -1).format('YYYY-MM-DD')
      }].concat(args));
  }
  function factory() {
    var params = getParams.apply(null, arguments);
    return new Request(params).error(function (err) {
      dialog.showMessage(err.message, 3 * 1000);
    });
  }
  exports = {
    getPanel: function (p) {
      return factory(p, { event_submit_doGetPanel: 'y' });
    },
    getSpm: function (p) {
      return factory(p, { event_submit_do_getSpmData: 'y' });
    },
    getTotal: function (p) {
      return factory(p, {
        event_submit_doGetTotalData: 'y',
        action: 'udata4Action'
      });
    },
    getOverview: function (p) {
      return factory(p, {
        event_submit_doGetOverviewData: 'y',
        action: 'udata4Action'
      });
    },
    getInterval: function (p) {
      return factory(p, {
        action: 'udata4Action',
        event_submit_doGetIntervalData: 'y'
      });
    },
    getSection: function (p) {
      return factory(p, {
        action: 'udata4Action',
        event_submit_doGetSectionData: 'y'
      });
    },
    getRefer: function (p) {
      return factory(p, { event_submit_do_getReferData: 'y' });
    },
    getSpmClick: function (p) {
      return factory(p, { event_submit_do_getLineHistoryData: 'y' });
    },
    getSpmHourClick: function (p) {
      return factory(p, { event_submit_do_getColumnHistoryData: 'y' });
    },
    getSpmHistoryClick: function (p) {
      return factory(p, { event_submit_do_getLinkedData: 'y' });
    },
    getLotteryInfo: function () {
      return new Request({
        emplId: parseInt(global.userId),
        t: Date.now()
      }, { url: 'http://udata.taobao.net/auth' });
    },
    getSpmImage: function (p) {
      return factory(p, { event_submit_do_GetSpmcImage: 'y' });
    },
    getHeatMap: function (p) {
      return factory(p, { event_submit_do_getSpmData: 'y' });
    },
    lottery: function () {
      return new Request({
        emplId: parseInt(global.userId),
        t: Date.now()
      }, { url: 'http://udata.taobao.net/prize' });
    }
  };
  return exports;
}();
udataAppsSpmDetail = function (exports) {
  var $ = node.all, global = udataCommonGlobal, dataService = udataDataService, loading = udataCommonLoading, dialog = udataCommonDialog, date = udataDateTime, view = udataViewsSpmDetail, drawTool = udataDrawTool, pageBody = $(document.body), width = 650, height = 350;
  exports = {
    init: function () {
      var that = this;
      that.bindEvent();
    },
    bindEvent: function () {
      var that = this;
      pageBody.delegate('click', '.udata-spm-detail', function (e) {
        e.preventDefault();
        var el = $(e.currentTarget), container = el.parent();
        that.open(container, e);
      });
      pageBody.delegate('click', '.udata-spm-detail-container', function (e) {
        var target = e.target, $target = $(target);
        if (target.tagName == 'A') {
          $target = $target.parent();
        }
        var index = $target.attr('data-index');
        if (!index) {
          return;
        }
        index = ~~index;
        var contentContainer = that.getTabContent(index);
        if (index == that.currentIndex) {
          return;
        }
        that.getTabContent(that.currentIndex).removeClass('active');
        that.getTabBtn(that.currentIndex).removeClass('active');
        contentContainer.addClass('active');
        $target.addClass('active');
        that.currentIndex = index;
        contentContainer.html('');
        that.showLoading();
        if (index === 0) {
          that.getClickData();
        } else if (index === 1) {
          that.getGuideData();
        } else if (index === 2) {
          that.getHourData();
        } else if (index === 3) {
          that.getHistoryData();
        }
        recorder.send('udata.4.' + (index + 1));
      });
    },
    showLoading: function () {
      var that = this;
      that.loadingContainer.show();
    },
    hideLoading: function () {
      var that = this;
      that.loadingContainer.hide();
    },
    checkIsGoldLog: function (el) {
      return !!el.attr('data-spm-click');
    },
    getTabContent: function (index) {
      return $('.udata-dialog-content li').item(index);
    },
    getTabBtn: function (index) {
      return $('.udata-dialog-nav li').item(index);
    },
    buildDialog: function (dialogBody) {
      dialogBody.html(view.render({ nav: this.nav }));
      var el = dialogBody.all('.udata-spm-detail-loading');
      this.loadingContainer = el.item(0);
      setTimeout(function () {
        dialogBody.one('.udata-dialog-nav').all('li').item(0).fire('click');
      }, 0);
    },
    getClickData: function () {
      dataService.getSpmClick({
        spmId: this.spmId,
        startDate: this.startDate,
        endDate: this.endDate,
        isGoldLog: this.isGoldLog ? 1 : 0,
        chartType: 'click'
      }).done(this.drewClickChart.bind(this)).error(this.showError.bind(this), true);
    },
    drewClickChart: function (data) {
      var that = this, categories = data.date, series = data.history;
      drawTool.drawLineChart(that.getTabContent(0), categories, series, 'moduleAndPosionChart');
      that.hideLoading();
    },
    getGuideData: function () {
      dataService.getSpmClick({
        spmId: this.spmId,
        startDate: this.startDate,
        endDate: this.endDate,
        isGoldLog: this.isGoldLog ? 1 : 0,
        chartType: 'guide'
      }).done(this.drewGuideChart.bind(this)).error(this.showError.bind(this), true);
    },
    drewGuideChart: function (data) {
      var that = this, categories = data.date, series = data.history;
      drawTool.drawLineChart(that.getTabContent(1), categories, series, 'moduleAndPosionChart');
      that.hideLoading();
    },
    getHourData: function () {
      dataService.getSpmHourClick({
        spmId: this.spmId,
        type: 'hour',
        date: this.endDate
      }).done(this.drewHourChart.bind(this)).error(this.showError.bind(this), true);
    },
    drewHourChart: function (data) {
      var that = this;
      drawTool.drawHourChart(that.getTabContent(2), data, that.type === 'module' ? 'module' : 'position');
      that.hideLoading();
    },
    getHistoryData: function () {
      dataService.getSpmHistoryClick({ spmId: this.spmId }).done(this.drewHistoryChart.bind(this)).error(this.showError.bind(this), true);
    },
    drewHistoryChart: function (data) {
      var that = this, titleList = data.titleList, valueList = data.valueList, value, m = titleList.length, n = valueList.length, html = '<div class="udata-anchor-history-container">';
      html += '<table>';
      html += '<thead>';
      html += '<tr>';
      for (var i = 0; i < m; i++) {
        html += '<th>';
        html += titleList[i].name;
        html += '</th>';
      }
      html += '</tr>';
      html += '</thead>';
      html += '<tbody>';
      for (var j = 0; j < n; j++) {
        html += '<tr>';
        for (var k = 0; k < m; k++) {
          value = '<a href="' + valueList[j][titleList[k].code] + '" target="_blank">' + valueList[j][titleList[k].code] + '</a>';
          html += '<td>';
          html += S.isNumber(value) ? global.formatMoneyNumber(value) : value;
          html += '</td>';
        }
        html += '</tr>';
      }
      html += '<tbody>';
      html += '</table>';
      html += '</div>';
      that.getTabContent(3).html(html);
      that.hideLoading();
    },
    showError: function (err) {
      var that = this, text = err.message, currentContainer = that.getTabContent(that.currentIndex), html = '<div class="udata-detail-error-bg"><img class="udata-detail-error-img" src="http://gtms01.alicdn.com/tps/i1/TB1J70TFVXXXXbfXpXXVxzWFXXX-1246-1118.png"/><div class="udata-detail-error-info-con"><h3>\u5662\uFF0C\u5F88\u62B1\u6B49\u2026\u2026</h3><p class="udata-detail-error-info">' + text + '</p></div></div>';
      currentContainer.html(html);
      that.hideLoading();
    },
    open: function (el, e) {
      var formatter = 'YYYY-MM-DD', spm = el.attr('data-spm-anchor-id');
      this.spmId = global.fixSpm(spm);
      this.endDate = date.getCurDay();
      this.startDate = moment(this.endDate, formatter).add('days', -13).format(formatter);
      this.nav = [
        '\u70B9\u51FB',
        '\u5F15\u5BFC',
        '\u5C0F\u65F6',
        '\u94FE\u63A5'
      ];
      if (el[0].tagName === 'LI') {
        this.type = 'module';
        this.nav = [
          '\u70B9\u51FB',
          '\u5F15\u5BFC',
          '\u5C0F\u65F6'
        ];
      } else {
        this.isGoldLog = this.checkIsGoldLog(el);
        if (this.isGoldLog) {
          this.nav = ['\u70B9\u51FB'];
        }
      }
      this.currentIndex = null;
      dialog.showDialog(this.buildDialog.bind(this), width, el, e);
    },
    close: function () {
      dialog.hide();
    }
  };
  return exports;
}();
udataAppsHeatMapMain = function (exports) {
  var $ = node.all, Global = udataCommonGlobal, Loading = udataCommonLoading, Dialog = udataCommonDialog, DataService = udataDataService;
  var MAX_HEIGHT = 8500, uDataContainer;
  exports = {
    height: MAX_HEIGHT,
    timer: null,
    spm: null,
    date: null,
    fixHeight: function () {
      var self = this;
      self.timer = setInterval(function () {
        var h = document.documentElement.offsetHeight;
        if (self.height != h) {
          self.height = Math.min(MAX_HEIGHT, h);
          self.heatContainer.css('height', self.height + 'px');
        }
      }, 5000);
    },
    addContainer: function () {
      var self = this;
      if (!self.init) {
        uDataContainer = $('#udata-container');
        if ($('#udata-heatmap-container')[0]) {
          uDataContainer[0].removeChild($('#udata-heatmap-container')[0]);
        }
        self.heatContainer = $('<div id="udata-heatmap-container">').appendTo(uDataContainer);
        self.init = true;
      }
    },
    run: function (o) {
      var self = this, currentSpm = Global.getSPMId(), date = o.date, type = o.type, id = o.id;
      if (+new Date(date) >= 1395590400000) {
        if (self.spm != currentSpm || self.date != date) {
          Loading.showLoading(5);
          var heatData = {
              type: type,
              fieldId: id,
              date: date,
              refresh: 1
            };
          DataService.getHeatMap(heatData).done(function (data) {
            Loading.hide();
            self.addContainer();
            self.heatContainer.css('background-image', 'url(' + data.image + ')').show();
            self.fixHeight();
            self.spm = currentSpm;
            self.date = date;
          }).error(function (err) {
            switch (err.code) {
            case 206:
              self.addContainer();
              self.askProgress(err, heatData);
              break;
            case 404:
              Loading.hide();
              Dialog.showMessage(err.message);
              break;
            case 500:
              Loading.hide();
              Dialog.showMessage(err.message);
              break;
            }
          }, true);
        } else {
          self.heatContainer.show();
        }
      } else {
        Dialog.showMessage('\u4EB2\uFF0C\u70ED\u56FE\u529F\u80FD3\u670824\u65E5\u521A\u4E0A\u7EBF\uFF0C\u4EE5\u524D\u7684\u6570\u636E\u6CA1\u6709\u70ED\u56FE\u5462~');
      }
    },
    askProgress: function (err, heatData) {
      var self = this, Load = $('#udata-loading-container');
      if ($('.udata-loading-message')[0]) {
        Load[0].removeChild($('.udata-loading-message')[0]);
        Load[0].removeChild($('.udata-loading-spinner5')[0]);
      }
      Load.attr('class', '').attr('opacity', 0.6);
      var message = $('<p class="udata-loading-message">' + err.message + '<p>');
      Load.append(message);
      self.poll(heatData);
    },
    poll: function (heatData) {
      var process = 0;
      clearInterval(self.heatmaptimer);
      self.heatmaptimer = setInterval(function () {
        DataService.getHeatMap(heatData).done(function (data) {
          Loading.hide();
          self.heatContainer.css('background-image', 'url(' + data.image + ')').show();
          self.fixHeight();
          self.spm = heatData.currentSpm;
          self.date = heatData.date;
          clearInterval(self.heatmaptimer);
          self.heatmaptimer = null;
        }).error(function (err, data) {
          switch (err.code) {
          case 206:
            process = showDetails($('.udata-loading-message')[0], err.message, process);
            break;
          case 500:
            Loading.hide();
            this.heatContainer.hide();
            clearInterval(self.heatmaptimer);
            self.heatmaptimer = null;
            break;
          }
        }, true);
      }, 500);
    },
    stop: function () {
      if (this.timer) {
        clearInterval(this.timer);
      }
      if (this.heatmaptimer) {
        clearInterval(this.heatmaptimer);
      }
      this.timer = null;
      this.height = MAX_HEIGHT;
      if (this.heatContainer) {
        this.heatContainer.hide();
      }
      Loading.hide();
    }
  };
  function showDetails(oMeg, meg, lastpro) {
    var process = Number(meg.slice(-3, -1)) ? Number(meg.slice(-3, -1)) : 0, point = [
        0,
        20,
        30,
        45,
        60,
        75,
        90
      ], i = point.indexOf(process);
    if (lastpro < process) {
      lastpro = process;
    }
    if (lastpro > point[i + 1]) {
      lastpro = point[i + 1];
    }
    process = lastpro + 1;
    if (process >= 99) {
      process = 99;
    }
    oMeg.innerHTML = '\u70ED\u56FE\u751F\u6210\u4E2D, \u8FDB\u5EA6\u4E3A' + process + '%, \u60A8\u53EF\u4EE5\u770B\u770B\u5176\u4ED6\u6570\u636E';
    return process;
  }
  return exports;
}();
udataRequester = function (exports) {
  var $ = node.all, global = udataCommonGlobal, response = udataResponse, dialog = udataCommonDialog, Connect = udataConnect, errorHandle = udataCommonErrorHandle, IO = _io_;
  exports = {
    url: global.ajaxUrl,
    send: function (param, success, fail) {
      var that = this, mock = global.getEnv() == 'mock' ? 1 : 0, query = {
          t: +new Date(),
          mock: mock,
          spmId: global.spmId
        };
      if (param) {
        query = S.merge(query, param);
      }
      new IO({
        url: that.url,
        data: query,
        timeout: 10,
        complete: function (res, status) {
          if (status == 'timeout') {
            dialog.showMessage('<div>\u670D\u52A1\u5668\u8D85\u65F6\uFF0C\u8FC7\u6BB5\u65F6\u95F4\u518D\u6765\u8BD5\u8BD5\u5427\uFF5E</div>', 10 * 1000);
            return;
          } else if (status == '') {
            dialog.showMessage('<div>\u8C8C\u4F3C\u4F60\u7684\u7F51\u7EDC\u65AD\u6389\u4E86\u54E6\uFF5E</div>', 10 * 1000);
            return;
          }
          if (res == query.spmId) {
            success();
            return;
          }
          try {
            res = JSON.parse(res);
            res.params = query;
          } catch (err) {
            errorHandle.unauthorized();
            return;
          }
          response.process(res, success, fail);
        }
      });
    }
  };
  return exports;
}();
udataAppsPageDataOverview = function (exports) {
  var $ = node.all, chartMenu = udataChartMenu, global = udataCommonGlobal, drawTool = udataDrawTool, dateTime = udataDateTime, dataService = udataDataService, FunnelChart = udataChartsFunnelChart;
  var Overview = {
      init: function (body) {
        var self = this, html = '';
        body.empty();
        html += '<div class="udata-pageData-summ-items"></div>';
        html += '<div class="udata-pageData-summ-funnel">';
        html += '</div>';
        html += '<ul class="udata-pageData-summ-funnel-rate"></ul>';
        html += '<div class="udata-pageData-summ-datepicker"></div>';
        body.append($(html));
      },
      render: function (body, loading) {
        this.init(body);
        this.loading = loading;
        this.body = body;
        loading.showLoading();
        body.addClass('udata-pageData-rendered');
        this.getChart();
      },
      update: function (date) {
        this.getChart(date);
      },
      getChart: function (date) {
        var self = this, date = date || dateTime.getCurDay(), data = {
            action: 'udata4Action',
            event_submit_doGetTotalData: 'y',
            type: 'off',
            spmId: global.spmId,
            startDate: moment(date).add('days', -30).format('YYYY-MM-DD'),
            endDate: date
          };
        dataService.getTotal({
          type: 'off',
          startDate: moment(date).add('days', -30).format('YYYY-MM-DD'),
          endDate: date
        }).done(function (data) {
          var targets = data.targets, funnel = data.funnel;
          self.buildOverviewList(targets);
          self.buildFunnel(funnel);
          self.loading.hideError();
          $('.udata-pageData-summ-datepicker').html(dateTime.getCurDay());
          self.body.removeClass('udata-pageData-tab-error');
        }).error(function (err) {
          self.loading.showError(err.message);
          self.body.addClass('udata-pageData-tab-error');
        }, true);
      },
      buildOverviewList: function (data) {
        var self = this, html = '', categories = [];
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          html += '<div class="udata-pageData-summ-item">';
          html += '<div class="udata-pageData-summ-title">' + item.name + '</div>';
          html += '<div class="udata-pageData-summ-data">' + (S.isNumber(item.value) ? global.formatMoneyNumber(item.value) : item.value) + '</div>';
          html += '<div class="udata-pageData-summ-rate">\u5468\uFF1A';
          html += self.formatComperisonData(item.week);
          html += '&nbsp;&nbsp;&nbsp;&nbsp;\u6708\uFF1A';
          html += self.formatComperisonData(item.month);
          html += '</div>';
          html += '<div class="udata-pageData-summ-chart"></div>';
          html += '</div>';
        }
        $('.udata-pageData-summ-items').html(html);
        var yesterday = dateTime.getCurDay();
        for (var i = 30; i >= 0; i--) {
          categories.push(moment(yesterday).add('days', -i).format('YYYY-MM-DD'));
        }
        $('.udata-pageData-summ-chart').each(function (item, i) {
          drawTool.drawSparkLines(item[0], categories, data[i].series);
        });
        self.loading.hideLoading();
      },
      formatComperisonData: function (data) {
        var html = '', clazz = '';
        if (data == '-') {
          return data;
        }
        var a = data.split('%'), n = parseFloat(a[0]);
        if (n >= 0) {
          clazz = 'trend-up';
        } else {
          clazz = 'trend-down';
        }
        html += '<span class="' + clazz + '">';
        html += n > 10000 ? '>10000%' : Math.abs(n) + '%';
        html += '</span>';
        return html;
      },
      buildFunnel: function (data) {
        var self = this;
        if (!self.cache) {
          self.cache = {};
        }
        var errorMsg = document.createElement('div');
        errorMsg.className = 'funnel-chart-err';
        errorMsg.innerHTML = '<i class="fa fa-coffee"></i> \u6682\u65E0\u6570\u636E';
        if (document.querySelector('.funnel-chart-err')) {
          document.querySelector('.funnel-chart-err').remove();
        }
        if (self.cache.funnelChart) {
          if (data.length !== self.cache.funnelChart.get('data').length) {
            document.querySelector('.udata-pageData-summ-funnel').innerHTML = '';
            self.cache.funnelChart = null;
          }
        }
        if (data.length === 0) {
          document.querySelector('#udata-pageData-summ').appendChild(errorMsg);
        }
        var percentages = data.map(function (d) {
            return d.percentage / 100;
          });
        if (self.cache.funnelChart) {
          self.cache.funnelChart.set('data', percentages.map(function () {
            return 0;
          }));
          self.cache.funnelChart.set('data', percentages.concat());
        } else {
          self.cache.funnelChart = new FunnelChart({
            container: '.udata-pageData-summ-funnel',
            data: percentages,
            width: 150,
            height: 300,
            ellipseBackground: '#F4F6EF',
            label: function (d, i) {
              var name = data[i].name.replace(/^直接/g, '');
              return name + '<br>' + Math.round(d * 10000) / 100 + '%';
            },
            tooltip: function (d, i) {
              return data[i].name;
            }
          });
        }
      }
    };
  exports = {
    render: function () {
      return Overview.render.apply(Overview, arguments);
    },
    update: function () {
      return Overview.update.apply(Overview, arguments);
    },
    stop: function () {
      Overview.cache = null;
    }
  };
  return exports;
}();
udataAppsPageDataFlow = function (exports) {
  var $ = node.all, global = udataCommonGlobal, chartMenu = udataChartMenu, MultiChart = udataCommonMultiChart, dateTime = udataDateTime, dataService = udataDataService, lsService = udataService;
  var LEN = 12, MAX_LINE = 5, legend = [], EFFECT_CUSTOMID = 1502;
  var Flow = {
      colors: [
        '#317ED8',
        '#EB5936',
        '#78979B',
        '#81A948',
        '#FACD33',
        '#5792B1',
        '#57A67D',
        '#4DAFC6',
        '#EE7837',
        '#90899C',
        '#567B1A',
        '#9B311E',
        '#66A0E1',
        '#A1B3B5',
        '#C09825',
        '#2F779E',
        '#3C7B4C',
        '#255C6C',
        '#8B3C1A',
        '#795AAE'
      ],
      arr_contains: function (id) {
        var arr = this.selected;
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] == id) {
            return true;
          }
        }
        return false;
      },
      hex2rgba: function (hex, opacity) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex), rgba_str = 'rgba({red}, {green}, {blue}, {opacity})';
        return result ? S.substitute(rgba_str, {
          red: parseInt(result[1], 16),
          green: parseInt(result[2], 16),
          blue: parseInt(result[3], 16),
          opacity: opacity
        }) : null;
      },
      init: function (body) {
        var self = this, html = '';
        body.empty();
        html += '<div class="udata-pageData-flow-chartcon"><div class="udata-pageData-flow-legend-container"></div>';
        html += '<div class="udata-pageData-flow-chart"></div>';
        html += '<div class="udata-pageData-flow-datepicker"></div>';
        html += '<div class="udata-pageData-flow-menu"></div>';
        html += '<div class="udata-pageData-flow-loading"><div class="udata-loading-spinner1"><div class="udata-loading-double-bounce1"></div><div class="udata-loading-double-bounce2"></div></div></div>';
        html += '<div class="udata-pageData-flow-legend-con">';
        html += '<div class="udata-pageData-flow-legend"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="udata-pageData-flow-items-slide"><div class="udata-pageData-flow-items-wrapper">';
        html += '</div><ul class="udata-pageData-flow-items-nav"></ul><div class="udata-pageData-flow-reset"><i class="fa fa-history" title="\u91CD\u7F6E"></i></div></div>';
        body.append($(html));
        self.bindEvent();
        self.initMultiChart();
        self.initMenu();
        self.type = 'spline';
        self.compare = false;
      },
      initMultiChart: function () {
        var self = this;
        self.multiChart = new MultiChart({
          container: $('.udata-pageData-flow-chart'),
          onClick: function (date) {
            self.type = 'column';
            self.menu.enableBack();
            self.menu.setCurrentView(2);
            self.getColumnChart(date);
          }
        });
      },
      initMenu: function () {
        var self = this;
        self.menu = new chartMenu($('.udata-pageData-flow-menu'), {
          view: [
            {
              'type': 1,
              'label': '\u6298\u7EBF\u56FE'
            },
            {
              'type': 2,
              'label': '\u67F1\u72B6\u56FE'
            }
          ],
          back: false,
          download: true
        }).on('view:change', self.onViewChange.bind(self)).on('url', self.onUrlInput.bind(self)).on('download', self.onDownload.bind(self)).on('back', self.onBack.bind(self));
      },
      render: function (body, loading) {
        this.init(body);
        this.loading = loading;
        this.body = body;
        loading.showLoading();
        this.getChart();
        body.addClass('udata-pageData-rendered');
      },
      update: function (date) {
        this.loading.hideError();
        this.getChart(date);
      },
      getChart: function (date) {
        $('.udata-pageData-flow-loading').show();
        if (this.type == 'spline') {
          this.getLineChart();
        } else if (this.type == 'column') {
          this.getColumnChart(date || dateTime.getCurDay());
        }
      },
      getLineChart: function () {
        var self = this, param = {
            customId: EFFECT_CUSTOMID,
            type: 'off',
            startDate: moment(dateTime.getCurDay()).add('days', -30).format('YYYY-MM-DD'),
            endDate: dateTime.getCurDay()
          };
        if (self.compare) {
          param.comparisonSpmId = self.comparisonSpmId;
        }
        dataService.getInterval(param).done(function (res) {
          lsService.get('udata-flow-items', function (items) {
            self.selected = self.selected || items || [10];
            self.buildItems(res.displaySeries.series);
            res = self.fixLineInfo(res);
            self.multiChart.switchChart('spline', res.categories, res.series);
            self.loading.hideLoading();
            self.startDate = param.startDate;
            self.endDate = param.endDate;
            self.loading.hideError();
            $('.udata-pageData-flow-datepicker').hide();
            $('.udata-pageData-flow-loading').hide();
            self.body.removeClass('udata-pageData-tab-error');
          });
        }).error(function (err) {
          self.loading.showError(err.message);
          self.body.addClass('udata-pageData-tab-error');
        }, true);
      },
      getColumnChart: function (date) {
        var self = this, param = {
            customId: EFFECT_CUSTOMID,
            type: 'off',
            date: date
          };
        if (self.compare) {
          param.comparisonSpmId = self.comparisonSpmId;
        }
        dataService.getSection(param).done(function (res) {
          res = self.fixColumnInfo(res);
          self.multiChart.switchChart('column', res.categories, res.series);
          self.startDate = param.date;
          self.endDate = param.date;
          self.loading.hideError();
          $('.udata-pageData-flow-datepicker').html(date).show();
          $('.udata-pageData-flow-loading').hide();
        }).error(function (err) {
          self.loading.showError(err.message);
        }, true);
      },
      fixLineInfo: function (res) {
        res.series = [];
        for (var i = 0; i < res.displaySeries.series.length; i++) {
          var s = res.displaySeries.series[i], id = s.id;
          if (!this.arr_contains(id)) {
            s.visible = false;
          }
          s.color = this.colors[i];
          s.title = res.displaySeries.title;
          res.series.push(s);
        }
        if (this.compare) {
          if (res.comparisonSeries.title != '-') {
            this.menu.addPage({
              spm: this.comparisonSpmId,
              name: res.comparisonSeries.title
            });
          }
          for (var i = 0; i < res.comparisonSeries.series.length; i++) {
            var s = res.comparisonSeries.series[i], id = s.id;
            if (!this.arr_contains(id)) {
              s.visible = false;
            }
            s.dashStyle = 'dash';
            s.color = this.colors[i];
            s.title = res.comparisonSeries.title;
            res.series.push(s);
          }
          $('.udata-pageData-flow-legend').empty().append(this.buildLegend(res)).show();
          $('.udata-pageData-flow-legend-con').addClass('udata-pageData-flow-legend-shown');
        } else {
          $('.udata-pageData-flow-legend').hide();
          $('.udata-pageData-flow-legend-con').removeClass('udata-pageData-flow-legend-shown');
        }
        return res;
      },
      fixColumnInfo: function (res) {
        var self = this, main = {
            data: [],
            pointPadding: 0.4,
            pointPlacement: 0
          }, sub = {
            data: [],
            pointPadding: 0.3,
            pointPlacement: 0
          }, category = [];
        res.series = [];
        if (self.compare) {
          if (res.comparisonSeries.title != '-') {
            this.menu.addPage({
              spm: this.comparisonSpmId,
              name: res.comparisonSeries.title
            });
          }
          sub.name = res.comparisonSeries.title;
          for (var i = 0; i < res.comparisonSeries.series[0].data.length; i++) {
            var data = res.comparisonSeries.series[0].data[i];
            if (self.arr_contains(res.ids[i])) {
              sub.data.push({
                y: data,
                color: self.hex2rgba(self.colors[i], 0.5)
              });
            }
          }
          res.series.push(sub);
          $('.udata-pageData-flow-legend').empty().append(this.buildLegend(res)).show();
          $('.udata-pageData-flow-legend-con').addClass('udata-pageData-flow-legend-shown');
        } else {
          $('.udata-pageData-flow-legend').hide();
          $('.udata-pageData-flow-legend-con').removeClass('udata-pageData-flow-legend-shown');
        }
        main.name = res.displaySeries.title;
        for (var i = 0; i < res.displaySeries.series[0].data.length; i++) {
          var data = res.displaySeries.series[0].data[i];
          if (self.arr_contains(res.ids[i])) {
            category.push(res.categories[i]);
            main.data.push({
              y: data,
              color: self.hex2rgba(self.colors[i], 1)
            });
          }
        }
        res.series.push(main);
        res.categories = category;
        return res;
      },
      buildLegend: function (res) {
        var html = '', clazz0, clazz1;
        if (this.type == 'spline') {
          clazz0 = 'udata-pageData-flow-line-series0';
          clazz1 = 'udata-pageData-flow-line-series1';
        } else if (this.type == 'column') {
          clazz0 = 'udata-pageData-flow-column-series0';
          clazz1 = 'udata-pageData-flow-column-series1';
        }
        html += '<span>' + res.displaySeries.title + '</span>';
        html += '<i class="' + clazz0 + '"></i>';
        html += '<span class="udata-pageData-flow-close-span"><a href="javascript:void(0);" class="udata-pageData-flow-legend-close-con"><i class="udata-pageData-flow-legend-close fa fa-times-circle"></i></a>' + res.comparisonSeries.title + '</span>';
        html += '<i class="' + clazz1 + '"></i>';
        return $(html);
      },
      buildItems: function (items) {
        var self = this, html = [];
        if ($('.udata-pageData-flow-item').length) {
          return;
        }
        for (var i = 0; i < items.length; i++) {
          if (i % LEN == 0) {
            html.push('<ul class="udata-pageData-flow-items">');
          }
          var item = items[i], name = item.name, id = item.id, clazz = '', style = '';
          if (self.arr_contains(id)) {
            self.addLegend({
              id: id,
              color: self.colors[i],
              name: name
            });
            clazz = 'udata-pageData-flow-item-sel';
            style = 'color:' + self.colors[i] + ';border-color:' + self.colors[i];
          }
          html.push('<li class="udata-pageData-flow-item ' + clazz + '" data-index="' + i + '" data-idx="' + id + '" style="' + style + '">' + name + '</li>');
          if (i % LEN == LEN - 1 || i == item.length - 1) {
            html.push('</ul>');
          }
        }
        self.body.one('.udata-pageData-flow-items-wrapper').append(html.join(''));
        self.initSlide();
        if (self.selected.length == MAX_LINE) {
          $('.udata-pageData-flow-item:not(.udata-pageData-flow-item-sel)').addClass('udata-pageData-flow-item-disabled');
        }
      },
      removeLegend: function (id) {
        var index = legend.indexOf(id);
        if (index == -1) {
          return;
        }
        legend.splice(index, 1);
        this.body.one('.udata-pageData-flow-legend-container').one('.legend-' + id).remove();
      },
      addLegend: function (param) {
        if (legend.indexOf(param.id) > -1) {
          return;
        }
        legend.push(param.id);
        this.body.one('.udata-pageData-flow-legend-container').append(S.substitute('<i data-id="{id}" style="color:{color}" class="fa fa-circle chart-legend legend-{id}" title="{name}"></i>', param));
      },
      initSlide: function () {
        var len = this.body.all('.udata-pageData-flow-items').length, nav = [];
        for (var i = 0; i < len; i++) {
          nav.push('<li class="fa fa-circle-o"></li>');
        }
        this.body.one('.udata-pageData-flow-items-nav').html(nav.join(''));
        S.use('gallery/slide/1.3/index', function (S, Slide) {
          new Slide('.udata-pageData-flow-items-slide', {
            pannelClass: 'udata-pageData-flow-items',
            contentClass: 'udata-pageData-flow-items-wrapper',
            navClass: 'udata-pageData-flow-items-nav',
            autoSlide: false,
            effect: 'hSlide',
            speed: 300,
            eventType: 'click',
            triggerDelay: 100,
            selectedClass: 'fa-circle'
          });
        });
      },
      onViewChange: function (ev) {
        if (ev.viewtype == 1) {
          this.menu.disableBack();
          this.type = 'spline';
        } else if (ev.viewtype == 2) {
          this.menu.enableBack();
          this.type = 'column';
        }
        this.getChart();
      },
      onUrlInput: function (ev) {
        var self = this;
        var url = ev.url.split('.');
        if (url.length == 2 && /^\d+$/.test(url[1])) {
          self.compare = true;
          self.comparisonSpmId = url.join('.');
          self.getChart();
          return;
        }
        url = url.join('.');
        url = url.indexOf('http://') == -1 ? 'http://' + url : url;
        global.getSpmByUrl(url, function (spm) {
          if (spm) {
            self.compare = true;
            self.comparisonSpmId = spm;
            self.getChart();
          } else {
            alert('\u8BE5\u9875\u9762\u6CA1\u6709spm\u7801');
          }
        });
      },
      onDownload: function (ev) {
        var data = {
            customId: EFFECT_CUSTOMID,
            startDate: this.startDate,
            endDate: this.endDate
          };
        if (this.compare) {
          data.spmIds = global.spmId + ',' + this.comparisonSpmId;
        } else {
          data.spmIds = global.spmId;
        }
        this.menu.openDownloadPage(data);
      },
      onBack: function (ev) {
        this.type = 'spline';
        this.getChart();
        this.menu.setCurrentView(1);
        this.menu.disableBack();
      },
      reset: function () {
        var self = this;
        legend.length = 0;
        this.body.one('.udata-pageData-flow-items-nav').one('li').fire('click');
        this.body.one('.udata-pageData-flow-legend-container').empty();
        var color = this.colors[0];
        $('.udata-pageData-flow-item').each(function (item, i) {
          if (i == 0) {
            var $item = $(item);
            self.addLegend({
              id: $item.attr('data-idx'),
              color: color,
              name: $item.text()
            });
            $(item).css({
              'color': color,
              'border-color': color
            });
          } else {
            $(item).css({
              'color': '#CCC',
              'border-color': '#CCC'
            });
          }
        });
        $('.udata-pageData-flow-item-disabled').removeClass('udata-pageData-flow-item-disabled');
        $('.udata-pageData-flow-item-sel').removeClass('udata-pageData-flow-item-sel');
        var id = parseInt($('.udata-pageData-flow-item').item(0).addClass('udata-pageData-flow-item-sel').attr('data-idx'));
        this.selected = [id];
        lsService.set('udata-flow-items', this.selected);
        this.compare = false;
        this.getChart();
      },
      addItem: function (id) {
        this.selected.push(parseInt(id));
        lsService.set('udata-flow-items', this.selected);
      },
      removeItem: function (id) {
        for (var i = 0; i < this.selected.length; i++) {
          if (this.selected[i] == id) {
            this.selected.splice(i, 1);
            break;
          }
        }
        lsService.set('udata-flow-items', this.selected);
      },
      bindEvent: function () {
        var self = this;
        $('.udata-pageData-flow-legend-container').delegate('click', 'i', function (ev) {
          var $target = $(ev.target), id = $target.attr('data-id');
          $('.udata-pageData-flow-items-wrapper').all('[data-idx="' + id + '"]').fire('click');
        });
        $('.udata-pageData-flow-items-wrapper').delegate('click', '.udata-pageData-flow-item', function (e) {
          var $target = $(e.target), idx = +$target.attr('data-index'), id = +$target.attr('data-idx');
          if ($target.hasClass('udata-pageData-flow-item-disabled')) {
            return;
          }
          if ($target.hasClass('udata-pageData-flow-item-sel')) {
            $target.css({
              'color': '#ccc',
              'border-color': '#ccc'
            });
            $target.removeClass('udata-pageData-flow-item-sel');
            $('.udata-pageData-flow-item-disabled').removeClass('udata-pageData-flow-item-disabled');
            self.removeItem(id);
            self.removeLegend(id);
            if (self.type == 'spline') {
              self.multiChart.chooseLegend(id, true);
            } else if (self.type == 'column') {
              self.getColumnChart(dateTime.getCurDay());
            }
          } else {
            var color = self.colors[idx];
            $target.css({
              'color': color,
              'border-color': color
            });
            $target.addClass('udata-pageData-flow-item-sel');
            self.addItem(id);
            self.addLegend({
              id: id,
              color: color,
              name: $target.text()
            });
            if (self.type == 'spline') {
              self.multiChart.chooseLegend(id, false);
            } else if (self.type == 'column') {
              self.getColumnChart(dateTime.getCurDay());
            }
            if ($('.udata-pageData-flow-item-sel').length == MAX_LINE) {
              $('.udata-pageData-flow-item:not(.udata-pageData-flow-item-sel)').addClass('udata-pageData-flow-item-disabled');
            }
          }
        });
        $('.udata-pageData-flow-items-slide').delegate('click', '.udata-pageData-flow-reset', function (e) {
          self.reset();
        });
        $('.udata-pageData-flow-legend-con').delegate('click', '.udata-pageData-flow-legend-close-con', function () {
          $('.udata-pageData-flow-legend').hide();
          $('.udata-pageData-flow-legend-con').removeClass('udata-pageData-flow-legend-shown');
          self.compare = false;
          self.getChart();
        });
      }
    };
  exports = {
    render: function () {
      return Flow.render.apply(Flow, arguments);
    },
    update: function () {
      return Flow.update.apply(Flow, arguments);
    }
  };
  return exports;
}();
udataAppsPageDataUser = function (exports) {
  var $ = node.all, global = udataCommonGlobal, chartMenu = udataChartMenu, MultiChart = udataCommonMultiChart, drawTool = udataDrawTool, dateTime = udataDateTime, dataService = udataDataService;
  var User = {
      colors: {
        1429: '#398ccc',
        1430: '#eb5933',
        1431: '#8ca348',
        1432: '#399475',
        1433: '#f7992a',
        1434: '#7652a3'
      },
      init: function (body) {
        var self = this, html = '';
        body.empty();
        html += '<div class="udata-pageData-user-chartcon">';
        html += '<div class="udata-pageData-user-chart"></div>';
        html += '<div class="udata-pageData-user-datepicker"></div>';
        html += '<div class="udata-pageData-user-menu"></div>';
        html += '</div>';
        html += '<ul class="udata-pageData-user-items"></ul>';
        body.append($(html));
        self.bindEvent();
        self.initMultiChart();
        self.initMenu();
        self.type = 'area';
        self.getChart();
      },
      initMultiChart: function () {
        var self = this;
        self.multiChart = new MultiChart({
          container: $('.udata-pageData-user-chart'),
          onClick: function (date) {
            self.type = 'pie';
            self.menu.enableBack();
            self.menu.setCurrentView(2);
            self.getPieChart(date);
          }
        });
      },
      initMenu: function () {
        var self = this, download = global.getEnv() == 'normal';
        self.menu = new chartMenu($('.udata-pageData-user-menu'), {
          view: [
            {
              'type': 1,
              'label': '\u533A\u57DF\u56FE'
            },
            {
              'type': 2,
              'label': '\u997C\u56FE'
            }
          ],
          back: false,
          compare: false,
          download: download
        }).on('view:change', self.onViewChange.bind(self)).on('download', self.onDownload.bind(self)).on('back', self.onBack.bind(self));
      },
      render: function (body, loading) {
        this.loading = loading;
        this.body = body;
        this.init(body);
        loading.showLoading();
        body.addClass('udata-pageData-rendered');
      },
      update: function (date) {
        this.getChart(date, true);
      },
      getChart: function (date, update) {
        if (this.body.hasClass('udata-pageData-tab-error')) {
          update = false;
        }
        var self = this, date = date || dateTime.getCurDay(), param = {
            customId: 1,
            type: 'off',
            date: date
          };
        dataService.getOverview(param).done(function (data) {
          if (update) {
            self.updateItems(data);
          } else {
            self.buildItems(data);
          }
          if (self.type == 'area') {
            self.getAreaChart();
          } else {
            self.getPieChart(date);
          }
          self.body.removeClass('udata-pageData-tab-error');
        }).error(function (err) {
          self.loading.showError(err.message);
          self.body.addClass('udata-pageData-tab-error');
        });
      },
      getAreaChart: function (date) {
        var self = this, date = date || dateTime.getCurDay(), param = {
            customId: self.currentId,
            type: 'off',
            startDate: moment(date).add('days', -30).format('YYYY-MM-DD'),
            endDate: date
          };
        dataService.getInterval(param).done(function (data) {
          var series = self.loopTrendData(data.displaySeries.series, self.colors[self.currentId]);
          self.multiChart.switchChart('area', data.categories, series);
          self.loading.hideLoading();
          self.startDate = param.startDate;
          self.endDate = param.endDate;
          self.loading.hideError();
          $('.udata-pageData-user-datepicker').html('').hide();
        }).error(function (err) {
          self.loading.showError(err.message);
        });
      },
      loopTrendData: function (data, originalColor) {
        var item, color;
        for (var i = 0, l = data.length; i < l; i++) {
          item = data[i];
          color = drawTool.colorLuminance(originalColor, 1 - (i + 1) / l);
          item.color = color;
        }
        return data;
      },
      loopStatusData: function (data, originalColor) {
        var series = data[0], d, color, ret = [];
        for (var i = 0, l = data.length; i < l; i++) {
          series = data[i];
          d = series.data;
          for (var j = 0, len = d.length; j < len; j++) {
            color = drawTool.colorLuminance(originalColor, 1 - (j + 1) / len);
            ret.push({
              y: d[j],
              color: color
            });
          }
          series.data = ret;
        }
        return data;
      },
      getPieChart: function (date) {
        var self = this, param = {
            customId: self.currentId,
            type: 'off',
            date: date
          };
        dataService.getSection(param).done(function (data) {
          var series = self.loopStatusData(data.displaySeries.series, self.colors[self.currentId]);
          self.multiChart.switchChart('pie', data.categories, series);
          self.startDate = date;
          self.endDate = date;
          self.loading.hideError();
          $('.udata-pageData-user-datepicker').html(date).show();
        }).error(function (err) {
          self.loading.showError(err.message);
        });
      },
      buildItems: function (data) {
        var html = '';
        this.currentId = data[0].id;
        for (var i = 0, l = data.length; i < l; i++) {
          var item = data[i], id = item.id, title = item.title, targetName = item.targetName, percentage = item.percentage;
          html += '<li class="udata-pageData-user-item';
          if (id === this.currentId) {
            html += ' udata-pageData-user-item-sel';
          }
          html += '" data-idx="' + id + '">';
          html += '<p class="udata-pageData-user-title">';
          html += title;
          html += '</p>';
          html += '<p>';
          html += targetName;
          html += '\u5360';
          html += '<span class="udata-pageData-user-title">' + percentage + '</span>';
          html += '</p>';
        }
        html += '</ul>';
        $('.udata-pageData-user-items').empty().append($(html));
      },
      updateItems: function (data) {
        $('.udata-pageData-user-item').each(function (item, i) {
          var d = data[i], title = d.title, targetName = d.targetName, percentage = d.percentage;
          $(item).all('p').item(0).html(title);
          $(item).all('p').item(1).html(targetName + '\u5360<span class="udata-pageData-user-title">' + percentage + '</span>');
        });
      },
      onViewChange: function (ev) {
        if (ev.viewtype == 1) {
          this.menu.disableBack();
          this.type = 'area';
        } else if (ev.viewtype == 2) {
          this.menu.enableBack();
          this.type = 'pie';
        }
        this.getChart(null, true);
      },
      onDownload: function (ev) {
        var data = {
            customId: this.currentId,
            startDate: this.startDate,
            endDate: this.endDate,
            spmIds: global.spmId
          };
        this.menu.openDownloadPage(data);
      },
      onBack: function (ev) {
        this.type = 'area';
        this.getChart(null, true);
        this.menu.setCurrentView(1);
        this.menu.disableBack();
      },
      bindEvent: function () {
        var self = this;
        $('.udata-pageData-user-items').delegate('click', '.udata-pageData-user-item', function (e) {
          var $target = $(e.currentTarget), id = $target.attr('data-idx');
          if ($target.hasClass('udata-pageData-user-item-sel')) {
            return;
          }
          $('.udata-pageData-user-item-sel').removeClass('udata-pageData-user-item-sel');
          $target.addClass('udata-pageData-user-item-sel');
          self.currentId = id;
          self.getChart(null, true);
        });
      }
    };
  exports = {
    render: function () {
      return User.render.apply(User, arguments);
    },
    update: function () {
      return User.update.apply(User, arguments);
    }
  };
  return exports;
}();
udataAppsPageDataClient = function (exports) {
  var $ = node.all, global = udataCommonGlobal, chartMenu = udataChartMenu, dataService = udataDataService, MultiChart = udataCommonMultiChart, dateTime = udataDateTime, drawTool = udataDrawTool;
  var CLIENT_OVERVIEW_ID = 2, CLIENT_CHART_ID = 1454;
  var Client = {
      colors: {
        3: '#81A945',
        1: '#338FD7',
        2: '#EB5933'
      },
      init: function (body) {
        var self = this, html = '';
        body.empty();
        var html = '';
        html += '<div class="udata-pageData-client-chart-containers">';
        html += '<div class="udata-pageData-client-chart-container"></div>';
        html += '<div class="udata-pageData-client-menu"></div>';
        html += '<div class="udata-pageData-client-datepicker"></div>';
        html += '</div>';
        html += '<ul class="udata-pagedata-client-category-list"></ul>';
        body.append($(html));
        self.bindEvent();
        self.initMultiChart();
        self.initMenu();
        self.type = 'area';
        self.getChart();
      },
      initMultiChart: function () {
        var self = this;
        self.multiChart = new MultiChart({
          container: $('.udata-pageData-client-chart-container'),
          onClick: function (date) {
            self.type = 'pie';
            self.menu.enableBack();
            self.menu.setCurrentView(2);
            self.getPieChart(date);
          }
        });
      },
      initMenu: function () {
        var self = this, download = global.getEnv() == 'normal';
        self.menu = new chartMenu($('.udata-pageData-client-menu'), {
          view: [
            {
              'type': 1,
              'label': '\u533A\u57DF\u56FE'
            },
            {
              'type': 2,
              'label': '\u997C\u56FE'
            }
          ],
          back: false,
          compare: false,
          download: download
        }).on('view:change', self.onViewChange.bind(self)).on('download', self.onDownload.bind(self)).on('back', self.onBack.bind(self));
      },
      render: function (body, loading) {
        this.loading = loading;
        this.body = body;
        this.init(body);
        loading.showLoading();
        body.addClass('udata-pageData-rendered');
      },
      update: function (date) {
        this.getChart(date, true);
      },
      getChart: function (date, update) {
        if (this.body.hasClass('udata-pageData-tab-error')) {
          update = false;
        }
        var self = this, date = date || dateTime.getCurDay();
        dataService.getOverview({
          customId: CLIENT_OVERVIEW_ID,
          type: 'off',
          date: date
        }).done(function (data) {
          if (update) {
            self.updateItems(data);
          } else {
            self.buildItems(data);
          }
          if (self.type == 'area') {
            self.getAreaChart();
          } else {
            self.getPieChart(date);
          }
          self.body.removeClass('udata-pageData-tab-error');
        }).error(function (err) {
          self.loading.showError(err.message);
          self.body.addClass('udata-pageData-tab-error');
        }, true);
      },
      getAreaChart: function (date) {
        var self = this, date = date || dateTime.getCurDay(), param = {
            customId: CLIENT_CHART_ID,
            type: 'off',
            agentType: self.currentType,
            startDate: moment(date).add('days', -30).format('YYYY-MM-DD'),
            endDate: date
          };
        dataService.getInterval(param).done(function (data) {
          data = self.fixLineInfo(data);
          self.multiChart.switchChart('area', data.categories, data.series);
          self.startDate = param.startDate;
          self.endDate = param.endDate;
          self.loading.hideLoading();
          self.loading.hideError();
          $('.udata-pageData-client-datepicker').html('').hide();
        });
      },
      getPieChart: function (date) {
        var self = this, param = {
            customId: CLIENT_CHART_ID,
            type: 'off',
            agentType: self.currentType,
            date: date
          };
        dataService.getSection(param).done(function (res) {
          var categories = res.categories, series;
          if (self.currentType == 3) {
            series = res.displaySeries.series;
            var browserData = self.processBrowserData(series);
            self.drawBrowser(browserData.core, browserData.version);
          } else {
            series = self.loopStatusData(res.displaySeries.series, self.colors[self.currentType]);
            self.multiChart.switchChart('pie', categories, series);
          }
          self.startDate = date;
          self.endDate = date;
          $('.udata-pageData-client-datepicker').html(date).show();
          self.loading.hideError();
        }).error(function (err) {
          self.loading.showError(err.message);
        });
      },
      fixLineInfo: function (res) {
        var color, type = this.currentType;
        res.series = [];
        for (var i = 0; i < res.displaySeries.series.length; i++) {
          var s = res.displaySeries.series[i];
          color = drawTool.colorLuminance(this.colors[type], 1 - (i + 1) / res.displaySeries.series.length);
          s.color = color;
          res.series.push(s);
        }
        return res;
      },
      buildItems: function (data) {
        var html = '';
        this.currentType = data[0].type;
        for (var i = 0, l = data.length; i < l; i++) {
          var item = data[i], id = item.id, title = item.title, targetName = item.targetName, percentage = item.percentage, type = item.type, clazz = '';
          if (i == 0) {
            clazz = 'current';
          }
          html += '<li class="' + clazz + '" data-id="' + id + '" data-index="' + i + '" data-type="' + type + '">';
          html += '<h2>' + title + '</h2>';
          html += '<p>' + targetName + '\u5360<span>' + percentage + '</span></p>';
          html += '</li>';
        }
        $('.udata-pagedata-client-category-list').empty().append($(html));
      },
      updateItems: function (data) {
        $('.udata-pagedata-client-category-list li').each(function (item, i) {
          var title = data[i].title, targetName = data[i].targetName, percentage = data[i].percentage;
          $(item).all('h2').html(title);
          $(item).all('p').html('' + targetName + '\u5360<span>' + percentage + '</span>');
        });
      },
      processBrowserData: function (o) {
        var that = this, a = o.data, item, drilldownItem, color, drilldown, drilldownColor, data, interval = 5, coreData = [], versionData = [];
        for (var i = 0, l = a.length; i < l; i++) {
          item = a[i];
          color = item.color;
          drilldown = item.drilldown;
          coreData.push({
            name: item.x,
            y: item.y,
            color: color
          });
          for (var j = 0, len = drilldown.data.length; j < len; j++) {
            drilldownItem = drilldown.data[j];
            drilldownColor = drawTool.colorLuminance(color, interval * (j + 1) / 100);
            versionData.push({
              name: drilldownItem.x,
              y: drilldownItem.y,
              color: drilldownColor
            });
          }
        }
        return {
          core: coreData,
          version: versionData
        };
      },
      drawBrowser: function (coreData, versionData) {
        drawTool.drawConcentricCircles($('.udata-pageData-client-chart-container'), coreData, versionData);
      },
      loopStatusData: function (a, originalColor) {
        var series = a[0], data, color, ret = [];
        for (var i = 0, l = a.length; i < l; i++) {
          series = a[i];
          data = series.data;
          for (var j = 0, len = data.length; j < len; j++) {
            color = drawTool.colorLuminance(originalColor, 1 - (j + 1) / len);
            ret.push({
              y: data[j],
              color: color
            });
          }
          series.data = ret;
        }
        return a;
      },
      onViewChange: function (ev) {
        if (ev.viewtype == 1) {
          this.menu.disableBack();
          this.type = 'area';
        } else if (ev.viewtype == 2) {
          this.menu.enableBack();
          this.type = 'pie';
        }
        this.getChart(null, true);
      },
      onDownload: function () {
        var data = {
            customId: CLIENT_CHART_ID,
            startDate: this.startDate,
            endDate: this.endDate,
            spmIds: global.spmId,
            type: this.currentType
          };
        this.menu.openDownloadPage(data);
      },
      onBack: function () {
        this.type = 'area';
        this.getChart(null, true);
        this.menu.setCurrentView(1);
        this.menu.disableBack();
      },
      bindEvent: function () {
        var self = this;
        $('.udata-pagedata-client-category-list').delegate('click', 'li', function (e) {
          var $target = $(e.currentTarget), id = +$target.attr('data-id'), type = +$target.attr('data-type');
          self.currentType = type;
          $('.udata-pagedata-client-category-list .current').removeClass('current');
          $target.addClass('current');
          self.getChart(null, true);
        });
      }
    };
  exports = {
    render: function () {
      return Client.render.apply(Client, arguments);
    },
    update: function () {
      return Client.update.apply(Client, arguments);
    }
  };
  return exports;
}();
udataAppsPageDataToday = function (exports) {
  var $ = node.all, global = udataCommonGlobal, realMission = udataRealMission, loading = udataCommonLoading, dialog = udataCommonDialog, date = udataDateTime, Event = _event_, drawTool = udataDrawTool, service = udataService;
  var Today = {
      init: function (body, host) {
        this.body = body;
        this.host = host;
        this.bindEvent();
      },
      bindEvent: function () {
        var self = this;
        this.body.delegate('click.pageData', '.btn-item', function (e) {
          var el = $(e.currentTarget), $target = $(e.target);
          if ($target.hasClass('charts-legend-item')) {
            var index = ~~$target.attr('data-index'), series;
            if (el.hasClass('item-hour')) {
              series = self.hourChart.series[index];
            } else {
              series = self.realFlowChart.series[index];
            }
            if (series) {
              if (!$target.hasClass('selected')) {
                series.show();
                $target.css('color', '#333').css('border-color', series.color).addClass('selected');
              } else {
                series.hide();
                $target.css('color', '#ccc').css('border-color', '#ccc').removeClass('selected');
              }
              self.save();
            }
            return;
          }
          var type = el.attr('data-type'), tabBtns = self.body.all('.btn-item'), realTabBtn = tabBtns.item(0), hourTabBtn = tabBtns.item(1), hourContainer = self.body.all('.udata-pageData-today-hour-chart'), realContainer = self.body.all('.udata-pageData-today-real-chart');
          if (type === 'real') {
            realContainer.show();
            hourContainer.hide();
            realTabBtn.addClass('current');
            hourTabBtn.removeClass('current');
            self.startRealFlow();
            self.stopHourMission();
          } else {
            realContainer.hide();
            hourContainer.show();
            realTabBtn.removeClass('current');
            hourTabBtn.addClass('current');
            self.stopRealFlow();
            self.startHourMission();
          }
        });
      },
      render: function (body, host) {
        host.showLoading();
        this.init.apply(this, arguments);
        var that = this, s = '';
        s += '<div class="udata-pageData-today-tab-contents"><div class="current-date">' + moment().format('YYYY-MM-DD') + '</div>';
        s += '<div class="udata-pageData-today-chart-container udata-pageData-today-real-chart current">';
        s += '</div>';
        s += '<div class="udata-pageData-today-chart-container udata-pageData-today-hour-chart">';
        s += '</div>';
        s += '</div>';
        s += '<div class="udata-pageData-today-tab-btn-list">';
        s += '<div data-type="real" class="current btn-item item-real"><h3>\u5B9E\u65F6\u6D41\u91CF</h3><p class="today-overview real"></p><div class="charts-legend"></div></div>';
        s += '<div data-type="hour" class="btn-item item-hour"><h3>\u5C0F\u65F6\u6D41\u91CF</h3><p class="today-overview"></p><div class="charts-legend"></div></div>';
        s += '</div>';
        body.html(s);
        if (!that.realMission && !that.hourMission) {
          var items = body.all('.btn-item');
          items.item(0).fire('click.pageData');
        }
        body.addClass('udata-pageData-rendered');
      },
      startRealFlow: function () {
        var that = this;
        that.host.hideError();
        if (that.realMission) {
          that.realMission.run();
        } else {
          that.realMission = new realMission({
            data: {
              action: 'udataAction',
              type: 'real',
              event_submit_do_getPageData: 'y',
              spmId: global.spmId
            },
            context: that,
            success: that.drawRealFlowChart.bind(that),
            fail: function (message) {
              that.host.showError(message, 650);
              that.body.addClass('udata-pageData-tab-error');
              that.stopRealFlow();
            }
          });
          that.realMission.run();
        }
      },
      drawRealFlowChart: function (data, res) {
        var that = this, series = data.series, container = that.body.all('.udata-pageData-today-real-chart');
        drawTool.parseRealSeries(series);
        this.hanleOverView(res.data.overview || res.overview);
        if (that.realFlowChart) {
          drawTool.updateChart(container, series);
        } else {
          that.realFlowChart = drawTool.drawRealMissionChart(container, series);
          var html = ['<ul>'];
          service.get('page.today.real', function (settings) {
            S.each(that.realFlowChart.series, function (series, index) {
              if (settings && settings[index]) {
                series.visible = true;
                series.show();
              }
              var color = series.visible ? series.color : '#cccccc', textColor = series.visible ? '#333' : '#cccccc';
              html.push(S.substitute('<li data-index="{index}" data-id="{id}" class="{className}" style="border-color:{color};color:{textColor}">{name}</li>', {
                name: series.name,
                index: index,
                id: index,
                color: color,
                textColor: textColor,
                className: series.visible ? 'charts-legend-item selected' : 'charts-legend-item'
              }));
            });
            html.push('</ul>');
            that.body.all('.btn-item.current').all('.charts-legend').html(html.join(''));
            container.addClass('udata-pageData-rendered');
          });
        }
        that.host.hideLoading();
        that.body.removeClass('udata-pageData-tab-error');
      },
      stopRealFlow: function () {
        var that = this;
        if (that.realMission) {
          that.realMission.stop();
          that.realMission = null;
        }
        that.realFlowChart = null;
      },
      startHourMission: function () {
        var that = this;
        that.host.hideError();
        if (that.hourMission) {
          that.hourMission.run();
        } else {
          that.hourMission = new realMission({
            delay: 1800000,
            data: {
              spmId: global.spmId,
              action: 'udataAction',
              event_submit_do_getColumnHistoryData: 'y',
              type: 'hour'
            },
            context: that,
            success: that.drawHourChart.bind(that),
            fail: function (message) {
              that.host.showError(message, 600);
              that.body.addClass('udata-pageData-tab-error');
              that.stopHourMission();
            }
          });
          that.hourMission.run();
        }
      },
      hanleOverView: function (overview) {
        this.body.all('.today-overview').each(function (item) {
          if (item.hasClass('real')) {
            item.html(overview.real.timestamp + ' PV\u4E3A <span>' + overview.real.pv.toLocaleString() + '</span>');
          } else {
            item.html(overview.hour.timestamp + ' PV\u4E3A <span>' + overview.hour.pv.toLocaleString() + '</span>');
          }
        });
      },
      drawHourChart: function (data, res) {
        var that = this, container = that.body.all('.udata-pageData-today-hour-chart');
        this.hanleOverView(res.data.overview || res.overview);
        if (that.hourChart) {
          drawTool.updateChart(container, data);
        } else {
          var html = ['<ul>'];
          service.get('page.today.hour', function (settings) {
            if (settings) {
              S.each(data, function (item) {
                item.visible = settings[item.id] == 1;
              });
            }
            that.hourChart = drawTool.drawHourChart(container, data, 'page');
            S.each(that.hourChart.series, function (series, index) {
              var color = series.visible ? series.color : '#cccccc', textColor = series.visible ? '#333' : '#cccccc';
              html.push(S.substitute('<li data-index="{index}" data-id="{id}" class="{className}" style="border-color:{color};color:{textColor}">{name}</li>', {
                name: series.name,
                index: index,
                id: data[index].id,
                color: color,
                textColor: textColor,
                className: series.visible ? 'charts-legend-item selected' : 'charts-legend-item'
              }));
            });
            html.push('</ul>');
            that.body.all('.btn-item.current').all('.charts-legend').html(html.join(''));
            container.addClass('udata-pageData-rendered');
          });
        }
        that.host.hideLoading();
        that.body.removeClass('udata-pageData-tab-error');
      },
      stopHourMission: function () {
        var that = this;
        if (that.hourMission) {
          that.hourMission.stop();
          that.hourMission = null;
        }
        that.hourChart = null;
      },
      update: function () {
      },
      save: function () {
        var data = {};
        var item = this.body.one('.btn-item.current'), real = item.hasClass('item-real');
        item.all('.charts-legend-item').each(function (item) {
          var id = item.attr('data-id');
          data[id] = item.hasClass('selected') ? 1 : 0;
        });
        service.set(real ? 'page.today.real' : 'page.today.hour', data);
      },
      stop: function () {
        this.body && this.body.undelegate();
        this.stopHourMission();
        this.stopRealFlow();
        this.body = null;
        this.host = null;
      }
    };
  exports = {
    render: function () {
      return Today.render.apply(Today, arguments);
    },
    update: function () {
    },
    stop: function () {
      Today.stop();
    }
  };
  return exports;
}();
udataAppsPageDataReferer = function (exports) {
  var $ = node.all, global = udataCommonGlobal, dateTime = udataDateTime, dataService = udataDataService, view = udataViewsReferer;
  var linkHeight = 2, coreNodeWidth = 182, nodeWidth = 170, excursion = 10;
  var Referer = {
      init: function (body, host) {
        this.host = host;
        this.body = body;
      },
      render: function (body, host) {
        this.init.apply(this, arguments);
        this.update();
        return this;
      },
      update: function (date) {
        var that = this;
        that.host.showLoading();
        dataService.getRefer({
          type: 0,
          date: date
        }).done(function (data) {
          that.host.hideError();
          data.getName = function (item) {
            return item.code;
          };
          that.body.html(view.render(data));
          that.createSvgContainer();
          that.drawLinks();
          that.host.hideLoading();
          that.body.append(that.createTimeContainer());
          that.body.removeClass('udata-pageData-tab-error');
        }).error(function (err) {
          that.host.showError(err.message);
          that.body.addClass('udata-pageData-tab-error');
        }, true);
      },
      createTimeContainer: function () {
        var html = '<div class="current-date">';
        html += dateTime.getCurDay();
        html += '</div>';
        return html;
      },
      createSvgContainer: function () {
        var that = this;
        that.svgContainer = d3.select('#udata-pageData-path').insert('svg', ':first-child').attr('width', 960).attr('height', 440);
      },
      drewLink: function (sx, sy, sh, tx, ty, th, isNext, total, index, sourceIndex, level) {
        var that = this, startX = sx + (isNext ? sourceIndex == -1 ? coreNodeWidth : nodeWidth : 0), startY = that.computeLinkStartPositionY(sy, sh, total, index), endX = tx + (isNext ? 0 : nodeWidth), endY = that.computeLinkEndPositionY(ty, th), path = that.computePath(startX, startY, endX, endY, that.computeExcursion(isNext, total, index, sourceIndex));
        that.svgContainer.append('path').attr('d', path).attr('stroke', '#81A945').attr('stroke-width', linkHeight).attr('fill', 'none');
      },
      createSvgContainer: function () {
        var that = this;
        that.svgContainer = d3.select('#udata-pageData-path').insert('svg', ':first-child').attr('width', 960).attr('height', 440);
      },
      drawLinks: function () {
        var that = this, sourceNodes = $('#udataPagedataPathContainer .udata-pagedata-path-source-list .udata-path-node'), sourceNode, directionNodes = $('#udataPagedataPathContainer .udata-pagedata-path-direction-list .udata-path-node'), directionNode;
        for (var i = 0, l = sourceNodes.length; i < l; i++) {
          sourceNode = sourceNodes.item(i);
          that.drewLink(388, 230, 36, 20, i * (40 + 16) + 56, 40, false, 7, i, -1, 1);
        }
        for (var i = 0, l = directionNodes.length; i < l; i++) {
          directionNode = directionNodes.item(i);
          that.drewLink(388, 230, 36, 770, i * (40 + 16) + 56, 40, true, 7, i, -1, 1);
        }
      },
      computeExcursion: function (isNext, total, index, sourceIndex) {
        var that = this, totalExcursion;
        if (sourceIndex === -1) {
          sourceIndex = parseInt(total / 2);
        }
        totalExcursion = Math.abs(index - sourceIndex) * excursion;
        return isNext ? 0 - totalExcursion : totalExcursion;
      },
      interpolateNumber: function (a, b) {
        b -= a;
        return function (t) {
          return a + b * t;
        };
      },
      computePath: function (sx, sy, tx, ty, linkExcursion) {
        var that = this, curvature = 0.5, x0 = sx, x1 = tx, xi = that.interpolateNumber(x0, x1), x2 = xi(curvature), x3 = xi(1 - curvature) + linkExcursion, y0 = sy, y1 = ty, ret = 'M' + x0 + ',' + y0 + 'C' + x2 + ',' + y0 + ' ' + x3 + ',' + y1 + ' ' + x1 + ',' + y1;
        return ret;
      },
      computeLinkEndPositionY: function (y, h) {
        return y + (h > linkHeight ? (h + linkHeight) / 2 : h) - linkHeight / 2;
      },
      computeLinkStartPositionY: function (y, h, total, index) {
        var start = y + Math.max(h - total * linkHeight, 0) / 2;
        return start + index * linkHeight + linkHeight / 2;
      },
      stop: function () {
        this.host = null;
        this.body = null;
      }
    };
  exports = {
    render: function (body) {
      return Referer.render.apply(Referer, arguments);
    },
    update: function () {
      return Referer.update.apply(Referer, arguments);
    },
    stop: function () {
      Referer.stop();
    }
  };
  return exports;
}();
udataAppsSpmPosition = function (exports) {
  var $ = node.all, global = udataCommonGlobal, process = udataProcess, loading = udataCommonLoading, dialog = udataCommonDialog, Detail = udataAppsSpmDetail, dataService = udataDataService, pageBody = $(document.body), quitMode = 'udata-spm-position-quit-mode', rateMode = 'udata-spm-rate-mode', tipClassName = 'udata-spm-position-tip', tipContainerClassName = 'udata-spm-position-tip-container', mapId = [], RandomClassName = function () {
      var a = [
          'udata-spm-position-odd',
          'udata-spm-position-even'
        ], flag = true;
      return {
        getCurrent: function () {
          flag = !flag;
          return a[+flag];
        },
        getAnother: function () {
          return a[+!flag];
        }
      };
    }();
  var resources = null, spmSelector = 'a[href],area,[data-spm-click]';
  function isEmptyLink(a) {
    var ret = false, href = S.trim(a.attr('href'));
    if (href === '#' || href.indexOf('javascript') > -1) {
      ret = true;
    }
    return ret;
  }
  function isGoldLog(el) {
    return el.attr('data-spm-click');
  }
  function isValidSpmCode(spmCode) {
    var that = this, a = spmCode.split('.'), ret = true;
    for (var i = 0, l = a.length; i < l; i++) {
      if (a[i] === '0') {
        ret = false;
        break;
      }
    }
    return ret;
  }
  Detail.init();
  exports = {
    anchors: [],
    checkSpmCode: function (spmCode) {
      var that = this, a = spmCode.split('.'), ret = true;
      for (var i = 0, l = a.length; i < l; i++) {
        if (a[i] === '0') {
          ret = false;
          break;
        }
      }
      return ret;
    },
    getDisplayLevel: function (data) {
      var s = data.toString();
      return s.length === 1 ? 1 : Math.max(Math.min(s.length - 1, 6), 0);
    },
    switchStatusClassName: function (el) {
      var that = this, anotherClassName = RandomClassName.getAnother();
      if (el.hasClass(anotherClassName)) {
        el.removeClass(anotherClassName);
      }
      el.addClass(that.currentStatusClassName);
    },
    updateResource: function () {
      return resources.concat(S.makeArray($(document.querySelectorAll('a[href]:not([data-spm-anchor-id]), area:not([data-spm-anchor-id]), [data-spm-click]:not([data-spm-anchor-id])'))));
    },
    showItemData: function (item) {
      var that = this, anchor = $(item), spmAnchorId;
      var spmClick = anchor.attr('data-spm-click'), query = {};
      spmClick && spmClick.split(';').map(function (item) {
        item = item.trim();
        if (item) {
          item = item.split('=');
          query[item[0]] = item[1];
        }
      });
      if (!item || !isGoldLog(anchor) && isEmptyLink(anchor)) {
        return;
      }
      spmAnchorId = anchor.attr('data-spm-anchor-id');
      if (!spmAnchorId || query['locaid'] && spmAnchorId.indexOf(query['locaid']) == -1) {
        global.triggerCreateSpmId(item);
        spmAnchorId = anchor.attr('data-spm-anchor-id');
        if (!spmAnchorId) {
          return;
        }
      }
      if (!that.checkSpmCode(spmAnchorId)) {
        return;
      }
      this.draw(anchor, spmAnchorId);
    },
    getAreaPosition: function (area) {
      var coords = area.attr('coords').split(',');
      return {
        left: coords[0],
        top: coords[1]
      };
    },
    insertIns: function (el, insHtml) {
      var that = this;
      if (location.host == 'www.taobao.com' && el.attr('id') == 'J_MemberHome') {
        var spm_id = el.attr('data-spm-anchor-id');
        el.append('<span data-spm-anchor-id="' + spm_id + '" style="margin-top:-18px;" class="' + tipContainerClassName + '">' + insHtml + '</span>');
      } else {
        if (el.nodeName() === 'area') {
          var parent = el.parent(), mapName = parent.attr('name'), imgs = document.querySelectorAll('img[usemap="#' + mapName + '"]');
          var position = that.getAreaPosition(el);
          insHtml = '<div style="position:absolute; left: ' + position.left + 'px; top: ' + position.top + 'px;">' + insHtml + '</div>';
          if (!(mapId.indexOf(mapName) > -1)) {
            mapId.push(mapName);
            $(imgs).each(function (img) {
              $('<div class="' + tipContainerClassName + '"></div>').insertBefore(img);
              img.appendTo(img.prev());
              $(img.parent()).append(insHtml);
            });
          } else {
            $(imgs).each(function (img) {
              $(img.parent()).append(insHtml);
            });
          }
          return;
        }
        el.addClass(tipContainerClassName).append(insHtml);
      }
    },
    draw: function (el, spmAnchorId) {
      if (!isValidSpmCode(spmAnchorId)) {
        return;
      }
      var that = this, datum, rate, datumLabel = el.all('.udata-spm-datum'), rateLabel = el.all('.udata-spm-datum-rate'), level;
      if (that.dataMap.spm[spmAnchorId]) {
        datum = that.dataMap.spm[spmAnchorId];
        rate = that.dataMap.total == 0 ? 0 : datum / that.dataMap.total * 100;
        if (datumLabel.length) {
          that.switchStatusClassName(datumLabel);
          that.switchStatusClassName(rateLabel);
          level = that.getDisplayLevel(datum);
          datumLabel.attr('data-spm-position-level', level);
          rateLabel.attr('data-spm-position-level', level);
          var datum_format = global.formatMoneyNumber(datum);
          datumLabel.html(datum_format).attr('title', datum_format);
          rateLabel.html(rate.toFixed(2) + '%').attr('title', rate.toFixed(2) + '%');
        } else {
          that.insertIns(el, that.buildShowBox(datum, that.dataMap.total));
        }
      } else {
        datumLabel.remove();
        rateLabel.remove();
      }
    },
    buildShowBox: function (datum, total) {
      var that = this, ret = '', rate = (total == 0 ? 0 : datum / total * 100).toFixed(2);
      ret += that.buildDataLabel(datum, rate, 'udata-spm-datum');
      return ret;
    },
    buildDataLabel: function (data, rate, type) {
      var ret = '';
      ret += '<ulabel class="';
      ret += tipClassName;
      ret += ' ' + type;
      ret += ' ' + this.currentStatusClassName;
      ret += '" data-spm-position-level="';
      ret += this.getDisplayLevel(data);
      ret += '" title="';
      ret += data;
      ret += '">';
      ret += global.formatMoneyNumber(data);
      ret += '</ulabel>';
      ret += '<ulabel class="' + tipClassName;
      ret += ' ' + this.currentStatusClassName;
      ret += ' udata-spm-datum-rate" ';
      ret += ' data-spm-position-level="';
      ret += this.getDisplayLevel(data);
      ret += '" title="' + rate;
      ret += '%">';
      ret += rate + '%';
      ret += '</ulabel>' + this.buildDataDetail();
      return ret;
    },
    buildDataDetail: function () {
      var ret = '';
      if (global.getEnv() == 'normal') {
        ret = '<ulabel class="udata-spm-detail" title="\u67E5\u770B\u8BE6\u60C5\u6570\u636E"></ulabel>';
      }
      return ret;
    },
    getData: function (params) {
      var that = this;
      that.id = params.id;
      that.spmId = params.spmId || global.getSPMId();
      loading.showLoading(2);
      pageBody.removeClass(quitMode);
      params.fieldId = params.id;
      dataService.getSpm(params).done(this.showData.bind(this)).error(this.handleError.bind(this));
    },
    switchMode: function (isRateMode) {
      var that = this;
      if (isRateMode) {
        pageBody.addClass(rateMode);
      } else {
        pageBody.removeClass(rateMode);
      }
    },
    getPositionResource: function () {
      if (!resources) {
        resources = S.makeArray($(document.querySelectorAll(spmSelector)));
        var self = this;
        self.observer = global.observe(pageBody[0], function (mutations) {
          mutations.forEach(function (mutation) {
            setTimeout(function () {
              var target = mutation.target;
              if (!target) {
                return;
              }
              if (target.tagName == 'A') {
                return;
              }
              if (target.className.indexOf && target.className.indexOf('udata-') > -1) {
                return;
              }
              var nodes = target.querySelectorAll(spmSelector);
              if (nodes.length) {
                S.makeArray(nodes).forEach(function (node) {
                  var $ele = $(node), spmAnchorId = self.getItemSpm(node);
                  if (spmAnchorId) {
                    resources.push($ele);
                    self.draw($ele, spmAnchorId);
                  }
                });
              }
            }, 0);
          });
        });
      }
      return resources.slice(0);
    },
    getItemSpm: function (item) {
      var that = this, anchor = $(item), spmAnchorId, spmClick = anchor.attr('data-spm-click'), query = {};
      if (!spmClick && isEmptyLink(anchor)) {
        return null;
      }
      spmClick && spmClick.split(';').map(function (item) {
        item = item.trim();
        if (item) {
          item = item.split('=');
          query[item[0]] = item[1];
        }
      });
      spmAnchorId = anchor.attr('data-spm-anchor-id');
      if (!spmAnchorId || query['locaid'] && spmAnchorId.indexOf(query['locaid']) == -1) {
        global.triggerCreateSpmId(item);
        spmAnchorId = anchor.attr('data-spm-anchor-id');
        if (!spmAnchorId) {
          return null;
        }
      }
      if (!that.checkSpmCode(spmAnchorId)) {
        return;
      }
      return spmAnchorId;
    },
    showData: function (data) {
      var that = this;
      date = data.date;
      that.currentDate = date;
      that.dataMap = data;
      that.currentStatusClassName = RandomClassName.getCurrent();
      that.switchStatusClassName(pageBody);
      loading.hide();
      if (!this.process) {
        this.process = new process({
          resource: that.getPositionResource(),
          process: function (item) {
            var $ele = $(item);
            if (isEmptyLink($ele) && !isGoldLog($ele)) {
              var index = resources.indexOf(item);
              resources.splice(index, 1);
              return;
            }
            var spmAnchorId = that.getItemSpm(item);
            if (spmAnchorId) {
              that.draw($ele, spmAnchorId);
            }
          }
        });
      } else {
        this.process.restart(this.getPositionResource());
      }
    },
    handleError: function (err) {
      loading.hide();
      this.stop();
    },
    run: function (params, callbacks) {
      this.callbacks = callbacks || {};
      this.getData(params);
    },
    stop: function () {
      if (this.process) {
        this.process.stop();
      }
      pageBody.addClass(quitMode);
      resources = null;
      if (this.observer) {
        this.observer.disconnect && this.observer.disconnect();
      }
      if (this.callbacks.stop) {
        this.callbacks.stop.apply(this, arguments);
      }
    }
  };
  return exports;
}();
udataAppsSpmModule = function (exports) {
  var $ = node.all, Global = udataCommonGlobal, YieldingProcesses = udataYieldingProcesses, requester = udataRequester, dataService = udataDataService, loading = udataCommonLoading, Dialog = udataCommonDialog, date = udataDateTime, Event = _event_, drawTool = udataDrawTool, DateTime = udataDateTime, localStorage = udataLocalStorage, coverflow = udataAppsSpmCoverflow, imagePopup = udataAppsSpmImagePopup, modules = localStorage.get('module') || {}, pageBody = $(document.body), zIndex = 99999999;
  if (modules['undefined']) {
    delete modules['undefined'];
    localStorage.remove('module');
  }
  var dialog = Dialog, date = DateTime, width = 650, height = 350;
  var moduleDetail = {
      bindEvent: function (element) {
        var that = this;
        element.on('click', function (e) {
          e.preventDefault();
          var el = $(this), container = element.parent();
          that.open(container, e);
        });
        Event.delegate(pageBody, 'click', '.udata-spm-module-detail-container', function (e) {
          e.preventDefault();
          var target = e.target, $target = $(target);
          if (target.tagName == 'A') {
            $target = $target.parent();
          }
          var index = $target.attr('data-index');
          if (!index) {
            return;
          }
          index = ~~index;
          var contentContainer = that.getTabContent(index);
          if (index == that.currentIndex) {
            return;
          }
          that.getTabContent(that.currentIndex).removeClass('active');
          that.getTabBtn(that.currentIndex).removeClass('active');
          contentContainer.addClass('active');
          $target.addClass('active');
          that.currentIndex = index;
          contentContainer.html('');
          that.showLoading();
          if (index === 0) {
            that.getClickData();
          } else if (index === 1) {
            that.getGuideData();
          } else if (index === 2) {
            that.getHourData();
          } else if (index === 3) {
            that.getCoverFlowData();
          }
        });
      },
      showLoading: function () {
        var that = this;
        that.loadingContainer.show();
      },
      hideLoading: function () {
        var that = this;
        that.loadingContainer.hide();
      },
      checkIsGoldLog: function (el) {
        return !!el.data('spm-click');
      },
      getTabContent: function (index) {
        return $('.udata-dialog-content').children().item(index);
      },
      getTabBtn: function (index) {
        return $('.udata-dialog-nav').children().item(index);
      },
      buildDialog: function (dialogBody) {
        var that = this, html = '<div class="udata-spm-module-detail-container">';
        html += '<ul class="udata-dialog-nav">';
        html += '<li' + (that.currentIndex === 0 ? ' class="active"' : '') + ' data-index="0"><a href="javascript:;" title="\u70B9\u51FB">\u70B9\u51FB</a></li>';
        if (that.type === 'position') {
          html += '<li data-index="1"><a href="javascript:;" title="\u5F15\u5BFC">\u5F15\u5BFC</a></li>';
          html += '<li' + (that.currentIndex === 2 ? ' class="active"' : '') + ' data-index="2"><a href="javascript:;" title="\u5C0F\u65F6">\u5C0F\u65F6</a></li>';
          html += '<li data-index="3"><a href="javascript:;" title="\u94FE\u63A5">\u94FE\u63A5</a></li>';
        } else if (that.type === 'module') {
          html += '<li data-index="1"><a href="javascript:;" title="\u5F15\u5BFC">\u5F15\u5BFC</a></li>';
          html += '<li' + (that.currentIndex === 2 ? ' class="active"' : '') + ' data-index="2"><a href="javascript:;" title="\u5C0F\u65F6">\u5C0F\u65F6</a></li>';
        }
        html += '<li' + (that.currentIndex === 3 ? ' class="active"' : '') + ' data-index="3"><a href="javascript:;" title="\u56FE\u7247">\u56FE\u7247</a></li>';
        html += '</ul>';
        html += '<ul class="udata-dialog-content">';
        html += '<li' + (that.currentIndex === 0 ? ' class="active"' : '') + '></li>';
        if (that.type === 'position') {
          html += '<li></li>';
          html += '<li' + (that.currentIndex === 2 ? ' class="active"' : '') + '></li>';
          html += '<li></li>';
        } else if (that.type === 'module') {
          html += '<li></li>';
          html += '<li' + (that.currentIndex === 2 ? ' class="active"' : '') + '></li>';
        }
        html += '<li' + (that.currentIndex === 3 ? ' class="active"' : '') + '></li>';
        html += '</ul>';
        html += '<div class="udata-spm-detail-loading"><div><p class="udata-loading-spinner0"></p></div></div>';
        html += '</div>';
        dialogBody.html(html);
        that.getCurrentData();
        that.loadingContainer = dialogBody.all('.udata-spm-detail-loading').item(0);
      },
      getCurrentData: function () {
        var that = this;
        switch (that.currentIndex) {
        case 0: {
            that.getClickData();
            break;
          }
        case 1: {
            that.getGuideData();
            break;
          }
        case 2: {
            that.getHourData();
            break;
          }
        case 3: {
            that.getHistoryData();
            break;
          }
        }
      },
      getCoverFlowData: function () {
        var view = udataViewsCoverflow;
        var that = this;
        requester.send({
          spmId: that.spmId,
          action: 'udataAction',
          isOffLine: 1,
          event_submit_do_GetSpmcImage: 'y',
          endDate: that.endDate
        }, function (data) {
          var type0Map = {};
          var items = data.filter(function (item) {
              if (item.type == 0) {
                type0Map[item.date] = item.src;
                return false;
              }
              return true;
            });
          items.forEach(function (item) {
            var src0 = type0Map[item.date];
            if (src0)
              item.src0 = src0;
          });
          var container = that.getTabContent(3);
          container.html(view.render({
            items: items,
            spm: that.spmId
          }));
          var $el = container.one('.js-kissy-coverflow');
          coverflow($el);
          imagePopup($el);
          that.hideLoading();
        }, that.showError.bind(that));
      },
      getClickData: function () {
        var that = this;
        requester.send({
          spmId: that.spmId,
          action: 'udataAction',
          event_submit_do_getLineHistoryData: 'y',
          startDate: that.startDate,
          endDate: that.endDate,
          isGoldLog: that.isGoldLog ? 1 : 0,
          chartType: 'click'
        }, that.drewClickChart.bind(that), that.showError.bind(that));
      },
      drewClickChart: function (data) {
        var that = this, categories = data.date, series = data.history;
        drawTool.drawLineChart(that.getTabContent(0), categories, series, 'moduleAndPosionChart');
        that.hideLoading();
      },
      getGuideData: function () {
        var that = this;
        requester.send({
          spmId: that.spmId,
          action: 'udataAction',
          event_submit_do_getLineHistoryData: 'y',
          startDate: that.startDate,
          endDate: that.endDate,
          chartType: 'guide'
        }, that.drewGuideChart.bind(that), that.showError.bind(that));
      },
      drewGuideChart: function (data) {
        var that = this, categories = data.date, series = data.history;
        drawTool.drawLineChart(that.getTabContent(1), categories, series, 'moduleAndPosionChart');
        that.hideLoading();
      },
      getHourData: function () {
        var that = this;
        requester.send({
          spmId: that.spmId,
          action: 'udataAction',
          event_submit_do_getColumnHistoryData: 'y',
          type: 'hour',
          date: that.endDate
        }, that.drewHourChart.bind(that), that.showError.bind(that));
      },
      drewHourChart: function (data) {
        var that = this;
        drawTool.drawHourChart(that.getTabContent(2), data, that.type === 'module' ? 'module' : 'position');
        that.hideLoading();
      },
      getHistoryData: function () {
        var that = this;
        requester.send({
          spmId: that.spmId,
          action: 'udataAction',
          event_submit_do_getLinkedData: 'y'
        }, that.drewHistoryChart.bind(that), that.showError.bind(that));
      },
      drewHistoryChart: function (data) {
        var that = this, titleList = data.titleList, valueList = data.valueList, value, m = titleList.length, n = valueList.length, html = '<div class="udata-anchor-history-container">';
        html += '<table>';
        html += '<thead>';
        html += '<tr>';
        for (var i = 0; i < m; i++) {
          html += '<th>';
          html += titleList[i].name;
          html += '</th>';
        }
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        for (var j = 0; j < n; j++) {
          html += '<tr>';
          for (var k = 0; k < m; k++) {
            value = valueList[j][titleList[k].code];
            html += '<td>';
            html += S.isNumber(value) ? Global.formatMoneyNumber(value) : value;
            html += '</td>';
          }
          html += '</tr>';
        }
        html += '<tbody>';
        html += '</table>';
        html += '</div>';
        that.getTabContent(3).html(html);
        that.hideLoading();
      },
      showError: function (text) {
        var that = this, currentContainer = that.getTabContent(that.currentIndex);
        currentContainer.html(text);
        that.hideLoading();
      },
      open: function (el, e) {
        var that = this, formatter = 'YYYY-MM-DD';
        that.spmId = Global.fixSpm(el.attr('data-spm-anchor-id'));
        that.endDate = DateTime.getCurDay();
        that.startDate = moment(that.endDate, formatter).add('days', -13).format(formatter);
        that.type = 'position';
        if (el[0].tagName === 'LI') {
          that.type = 'module';
        } else {
          that.isGoldLog = that.checkIsGoldLog(el);
          if (that.isGoldLog) {
            that.type = 'goldLog';
          }
        }
        that.currentIndex = DateTime.getCurType() === 'hour' ? 2 : 0;
        dialog.showDialog(that.buildDialog.bind(that), width, el, e);
      },
      close: function () {
        dialog.hide();
      }
    };
  exports = {
    shadowRoots: [],
    getModulesCAndAB: function () {
      var module_ab = S.makeArray($('[data-spm-ab]:not([data-module-checked])')), module_c = $('[data-spm]:not(a):not(body):not([data-module-checked])');
      S.each(module_c, function (module, i) {
        if (!$(module).all('[data-spm-ab]').length) {
          module_ab.push($(module));
        }
      });
      var self = this;
      self.observer = Global.observe(pageBody[0], function (mutations) {
        mutations.forEach(function (mutation) {
          var target = mutation.target;
          if (!target) {
            return;
          }
          var nodes = target.querySelectorAll('[data-spm]:not(a):not(body):not([data-module-checked])');
          if (nodes.length) {
            S.each(nodes, function (module, i) {
              if (!$(module).all('[data-spm-ab]').length) {
                module_ab.push($(module));
                self.showItemData($(module));
              }
            });
          }
        });
      });
      return module_ab;
    },
    updateResource: function () {
      return this.getModulesCAndAB();
    },
    getData: function (param) {
      param.fieldId = param.id;
      dataService.getSpm(param).done(this.showData.bind(this)).error();
    },
    getOffData: function (id, date) {
      var that = this;
      requester.send({
        spmId: that.spmId,
        action: 'udataAction',
        event_submit_do_getSpmData: 'y',
        date: date,
        type: 'off',
        fieldId: id
      }, that.showData.bind(that));
    },
    getHourData: function (id, date, hour) {
      var that = this;
      requester.send({
        spmId: that.spmId,
        action: 'udataAction',
        event_submit_do_getSpmData: 'y',
        date: date,
        hour: hour,
        type: 'hour',
        fieldId: id
      }, that.showData.bind(that));
    },
    getModuleResource: function () {
      return this.getModulesCAndAB();
    },
    showData: function (data) {
      var that = this;
      that.total = {};
      data.total.map(function (item) {
        that.total[item.id] = item.data;
      });
      data = data.spm;
      date = data.date;
      that.currentDate = date;
      that.dataMap = data;
      loading.hide();
      if (that.yieldingProcesses) {
        that.yieldingProcesses.restart(that.getModuleResource());
      } else {
        that.yieldingProcesses = new YieldingProcesses({
          resource: that.getModuleResource(),
          process: that.showItemData,
          context: that
        });
      }
    },
    checkValidTag: function (item) {
      var excludedTagName = {
          'BODY': true,
          'A': true,
          'AREA': true,
          'BUTTON': true,
          'INPUT': true
        };
      return excludedTagName[item.tagName];
    },
    checkIsHidden: function (el) {
      var that = this;
      if (el[0].tagName == 'BODY') {
        return false;
      }
      if (el.css('display') == 'none') {
        return true;
      }
      return that.checkIsHidden(el.parent());
    },
    dealRules: function (el) {
      if (location.host == 'www.taobao.com' && el.attr('id') == 'J_SearchFt') {
        el.css('position', 'static');
      }
    },
    showItemData: function (item) {
      var that = this, el = $(item), spmC = el.attr('data-spm'), spmAB = el.attr('data-spm-ab'), spmC = spmAB ? el.closest('[data-spm]').attr('data-spm') + '-' + spmAB : spmC, data = that.dataMap[spmC], des = item.webkitShadowRoot, is_show_shadow = $('body').data('shadow');
      if (that.checkValidTag(item)) {
        return;
      }
      if (data) {
        if (des) {
          if (!is_show_shadow) {
            return;
          }
          if ($(des).children().length > 1) {
            return;
          }
          if (that.checkIsHidden(el)) {
            el.removeAttr('data-module-checked');
            return;
          }
          that.buildModule(el, data, spmC, des);
        } else {
          is_show_shadow && that.buildModule(el, data, spmC);
        }
      }
    },
    getCoordinates: function (el) {
      var coordinates = el.offset();
      if (el.css('position') == 'fixed') {
        coordinates.left += $(window).scrollTop();
      }
      return coordinates;
    },
    buildModule: function (el, data, spmC, shadowRoot) {
      var that = this, coordinates = el.offset(), spmHover = $('#spmHover'), width, height, root, template, innerTpl, mask;
      if (that.checkIsHidden(el)) {
        return;
      }
      width = el.width();
      height = el.height();
      template = '<style>' + '.uv-percent {color: red;position: absolute;left:0;top:0px;display: inline-block;font-weight: bold;background:rgba(255,255,255,0.8);}' + '.udata-spm-module{' + 'width:' + width + 'px;' + 'height:' + height + 'px;' + 'z-index:' + --zIndex + ';' + '}' + '.udata-spm-module{-webkit-box-sizing: border-box;background: rgba(129,169,69,0.3);float: left;position: absolute;font-size: 12px;font-family: Tahoma;font-style: normal;font-weight: normal;}.udata-spm-module:hover{background-color: rgba(129,169,69,0.6);}.udata-spm-module .udata-spm-module-inner{width: 100%;height: 100%;}.udata-spm-module ul{margin: 0;list-style: none;color: #FFF;display: none;width: 120px;line-height: 20px;padding: 4px;border: 1px solid #464640;background-color: rgba(61,97,7,0.7);}.udata-spm-module ul li{text-align:left;}.udata-spm-module:hover ul{display: block;}.udata-spm-module:hover .uv-percent{display: none;}.uv-percent:hover{display: none;}.udata-spm-module .udata-spm-detail{cursor: pointer;padding-left: 16px;background: url(http://gtms01.alicdn.com/tps/i1/T10XH4Fb0gXXaSQP_X-16-16.png) 0 0 no-repeat;color: #FFF;}.udata-spm-module .udata-spm-detail:hover{color: #FF7300;}.udata-spm-module-selected{background-color: rgba(129,169,69,0.6);border: 2px solid #485525;}.udata-spm-module-selected ul{display: block;}' + '</style>' + '<div class="udata-spm-module ' + (modules[spmC] === true ? 'udata-spm-module-selected' : '') + '" data-spm-c="' + spmC + '"><div class="udata-spm-module-inner">' + that.buildTargetList(data, spmC) + '</div></div>';
      if (shadowRoot) {
        $(shadowRoot).prepend(template);
        root = shadowRoot;
      } else {
        if (el[0].createShadowRoot) {
          root = el[0].createShadowRoot();
        } else if (el[0].webkitCreateShadowRoot) {
          root = el[0].webkitCreateShadowRoot();
        }
        root.innerHTML = template + '<content></content>';
      }
      this.shadowRoots.push(root);
      el.attr('data-module-checked', true);
      mask = root.querySelector('.udata-spm-module');
      that.dealRules(el);
      that.bindEvents($(mask));
    },
    buildTargetList: function (a, spmC) {
      var that = this, html = '', item;
      html += '<span class="uv-percent">uv:' + (a[1].data * 100 / (that.total['14'] || that.total['595'])).toFixed(2) + '%</span>';
      html += '<ul>';
      html += '<li>';
      html += 'SPMC\uFF1A';
      html += spmC;
      html += '</li>';
      for (var i = 0, l = a.length; i < l; i++) {
        item = a[i];
        html += '<li>';
        html += item.name + '\uFF1A';
        html += Global.formatMoneyNumber(item.data);
        html += '</li><li>';
        html += item.name + '\u5360\u6BD4\uFF1A';
        html += (item.data * 100 / that.total[item.id]).toFixed(2) + '%';
        html += '</li>';
      }
      if (Global.getEnv() == 'normal') {
        html += '<li data-spm-anchor-id="' + Global.spmId + '.' + spmC + '"><a class="udata-spm-detail">\u66F4\u591A</a></li>';
      }
      html += '</ul>';
      return html;
    },
    bindEvents: function (shadowitem) {
      var that = this;
      moduleDetail.bindEvent($(shadowitem).all('a'));
      shadowitem.on('click', function (e) {
        var el = $(this), target = $(e.target), spmC = el.attr('data-spm-c'), isSelected;
        if (target.hasClass('udata-spm-detail')) {
          return;
        }
        isSelected = !modules[spmC];
        if (isSelected) {
          modules[spmC] = true;
        } else {
          delete modules[spmC];
        }
        localStorage.set('module', modules);
        el.toggleClass('udata-spm-module-selected');
      });
    },
    run: function (o) {
      var that = this;
      $('body').data('shadow', true);
      that.getData(o);
    },
    stop: function () {
      var that = this;
      $('body').data('shadow', false);
      for (var i = 0, len = that.shadowRoots.length; i < len; i++) {
        that.shadowRoots[i].innerHTML = '<content></content>';
      }
      $('[data-module-checked]').each(function (el, i) {
        el.removeAttr('data-module-checked');
      });
      if (this.observer) {
        this.observer.disconnect && this.observer.disconnect();
      }
    }
  };
  return exports;
}();
udataAppsPageDataMain = function (exports) {
  var $ = node.all, global = udataCommonGlobal, loading = udataCommonLoading, dialog = udataCommonDialog, date = udataDateTime, Event = _event_, drawTool = udataDrawTool, overview = udataAppsPageDataOverview, flow = udataAppsPageDataFlow, user = udataAppsPageDataUser, client = udataAppsPageDataClient, today = udataAppsPageDataToday, referer = udataAppsPageDataReferer, service = udataService, connect = udataConnect;
  var tabs = [
      overview,
      flow,
      user,
      client,
      today,
      referer
    ];
  var bind = false;
  exports = {
    currentIdx: 0,
    render: function (body, container) {
      var html = '';
      this.body = body;
      body.addClass('udata-pageData-body');
      html += '<ul id="udata-pageData-nav" class="udata-dialog-nav">';
      html += '<li data-category="summ" class="active"><a href="javascript:;">\u6982\u89C8</a></li>';
      if (global.getEnv() == 'normal') {
        html += '<li data-category="flow"><a href="javascript:;">\u9875\u9762\u6548\u679C</a></li>';
      }
      html += '<li data-category="user"><a href="javascript:;">\u7528\u6237\u7279\u5F81\u5206\u5E03</a></li>';
      html += '<li data-category="client"><a href="javascript:;">\u5BA2\u6237\u7AEF</a></li>';
      if (global.getEnv() == 'normal') {
        html += '<li data-category="today"><a href="javascript:;">\u4ECA\u65E5\u6D41\u91CF</a></li>';
        html += '<li data-category="path"><a href="javascript:;">\u6765\u6E90\u53BB\u5411</a></li>';
      }
      html += '<li data-button="save"><i class="fa fa-floppy-o"></i></li>';
      html += '</ul>';
      html += '<ul id="udata-pageData-content" class="udata-dialog-content">';
      html += '<li id="udata-pageData-summ" class="active" data-idx="0"></li>';
      html += '<li id="udata-pageData-flow" data-idx="1"></li>';
      html += '<li id="udata-pageData-user" data-idx="2"></li>';
      html += '<li id="udata-pageData-client" data-idx="3"></li>';
      html += '<li id="udata-pageData-today" data-idx="4"></li>';
      html += '<li id="udata-pageData-path" data-idx="5"></li>';
      html += '<li id="udata-pageData-loading"><div class="udata-loading-spinner0"></div></li>';
      html += '<li id="udata-pageData-error">';
      html += '<div class="udata-pageData-error-bg">';
      html += '<img class="udata-pageData-error-img" src="http://gtms01.alicdn.com/tps/i1/TB1J70TFVXXXXbfXpXXVxzWFXXX-1246-1118.png"/>';
      html += '<div class="udata-pageData-error-info-con"><h3>\u5662\uFF0C\u5F88\u62B1\u6B49\u2026\u2026</h3><p class="udata-pageData-error-info"></p></div>';
      html += '</div>';
      html += '</li>';
      html += '</ul>';
      html += '<div id="udata-pageData-time"></div>';
      body.append($(html));
      this.bindEvent();
      tabs[0].render($('#udata-pageData-summ'), this);
    },
    showLoading: function () {
      $('#udata-pageData-loading').show();
    },
    hideLoading: function () {
      $('#udata-pageData-loading').hide();
    },
    showError: function (message, width) {
      $('#udata-pageData-loading').hide();
      $('.udata-pageData-error-info').html(message);
      if (width) {
        $('#udata-pageData-error').width(width + 'px');
      } else {
        $('#udata-pageData-error').width('960px');
      }
      $('#udata-pageData-error').show();
    },
    hideError: function () {
      $('#udata-pageData-error').hide();
    },
    bindEvent: function () {
      var self = this;
      var $nav = $('#udata-pageData-nav'), $content = $('#udata-pageData-content');
      if (!bind) {
        bind = true;
        date.on('date:change', function (ev) {
          tabs[self.currentIdx].update(ev.data.date);
        });
      }
      $nav.delegate('click', 'li[data-button]', function (ev) {
        var button = $(ev.currentTarget).attr('data-button');
        if (button === 'save') {
          connect.post('/captureVisibleTab', function (data) {
            console.log(data);
            var a = document.createElement('a');
            a.href = data;
            a.setAttribute('download', 'udata.jpg');
            a.click();
          });
        }
      });
      $nav.delegate('click', 'li[data-category]', function (ev) {
        var $target = $(ev.currentTarget);
        if ($target.hasClass('active')) {
          return;
        }
        var category = $target.attr('data-category'), $body = $('#udata-pageData-' + category);
        $nav.all('.active').removeClass('active');
        $content.all('.active').removeClass('active');
        $target.addClass('active');
        $body.addClass('active');
        var idx = parseInt($body.attr('data-idx'));
        self.currentIdx = idx;
        if ($body.hasClass('udata-pageData-tab-error') || !$body.hasClass('udata-pageData-rendered')) {
          tabs[idx] && tabs[idx].render($body, self);
        }
        self.hideError();
        return false;
      });
    },
    run: function (callbacks) {
      var self = this;
      this.callbacks = callbacks || {};
      dialog.showModal(this.render.bind(this), 1000, function () {
        self.stop();
      });
      $('.udata-timer-type').addClass('udata-timer-disabled');
    },
    stop: function () {
      this.body.removeClass('udata-pageData-body');
      $('.udata-loading-container').removeClass('udata-modal-loading');
      dialog.hide();
      $('.udata-timer-type').removeClass('udata-timer-disabled');
      if (this.callbacks.stop) {
        this.callbacks.stop.apply(this, arguments);
      }
      for (var i = 0, l = tabs.length; i < l; i++) {
        tabs[i] && tabs[i].stop && tabs[i].stop();
      }
    }
  };
  return exports;
}();
udataMenu = function (exports) {
  var $ = node.all, global = udataCommonGlobal, loading = udataCommonLoading, dialog = udataCommonDialog, view = udataViewsMenu, dataService = udataDataService, connect = udataConnect, datetime = udataDateTime, apps = {
      'spm.position': udataAppsSpmPosition,
      'heatMap.main': udataAppsHeatMapMain,
      'spm.module': udataAppsSpmModule,
      'pageData': udataAppsPageDataMain
    };
  var callbacks = {
      error: function (text, code) {
        loading.hide();
        if (code == 404 || code == 602) {
          dialog.showMessage(text);
          if (code == 404) {
            recorder.record('noData');
          }
        } else {
          dialog.show(text);
          if (code == 401) {
            if (pageBody.hasClass(realMissionMode)) {
              recorder.record('noRealRight');
            } else {
              recorder.record('noRight');
            }
          }
        }
      },
      stop: function () {
        dialog.hide();
      }
    };
  exports = {
    init: function (container) {
      this.container = container;
      this.bindEvent();
      if (global.debug) {
        $('.udata-menu-tools').show();
      }
    },
    clickItem: function () {
      if (global.container.one('.udata-page-module').hasClass('udata-module-selected')) {
        return;
      }
      var self = this, items = $('dt', this.container), item = items.item(0);
      if (this.id) {
        items.each(function (_item) {
          if (_item.attr('data-id') == self.id) {
            item = _item;
            return false;
          }
          return true;
        });
      }
      if (this.currentFunc) {
        this.currentFunc.stop();
      }
      item.fire('click');
    },
    itemSelect: function ($item) {
      var choice = $item.all('.udata-item-choice'), slider = $item.all('.udata-item-slider');
      $item.addClass('udata-item-selected');
      if (choice.length) {
        choice.show();
        if (this.isRate) {
          $item.all('span').item(1).addClass('udata-item-choice-selected');
        } else {
          $item.all('span').item(0).addClass('udata-item-choice-selected');
        }
      }
      if (slider.length) {
        slider.show();
      }
    },
    itemDeselect: function ($item) {
      var choice = $item.all('.udata-item-choice');
      $item.removeClass('udata-item-selected udata-module-selected udata-toollist-selected');
      if (choice.length) {
        choice.hide();
        $item.all('.udata-item-choice-selected').removeClass('udata-item-choice-selected');
      }
    },
    displayMode: function ($target) {
      if ($target.hasClass('udata-item-choice-selected')) {
        return;
      }
      var mode = $target.attr('data-mode') == 'rate' ? true : false;
      this.isRate = mode;
      $target.parent().all('.udata-item-choice-selected').removeClass('udata-item-choice-selected');
      $target.addClass('udata-item-choice-selected');
      if (this.currentFunc) {
        this.currentFunc.switchMode && this.currentFunc.switchMode(mode);
      } else {
        $target.parent().fire('click');
        this.currentFunc.switchMode && this.currentFunc.switchMode(mode);
      }
    },
    stopCurrentFunc: function () {
      if (this.currentItem) {
        this.itemDeselect(this.currentItem);
        this.currentItem = null;
      }
      if (this.currentFunc) {
        this.currentFunc.stop();
        this.currentFunc = null;
        this.id = null;
      }
    },
    refreshData: function (config) {
      if (this.currentFunc) {
        this.currentFunc.stop && this.currentFunc.stop();
        var params = {}, type = config && config.type ? config.type : datetime.getCurType(), hour = config && config.hour ? config.hour : '';
        params['id'] = this.id;
        params['date'] = datetime.getCurDay();
        params['type'] = type;
        params['hour'] = hour;
        this.currentFunc.getData && this.currentFunc.getData(params);
      }
    },
    refreshMenu: function (config) {
      var self = this, data = {
          action: 'udataAction',
          event_submit_doGetPanel: 'y',
          type: config.type || datetime.getCurType(),
          date: datetime.getCurDay()
        };
      if (self.currentFunc) {
      }
      dataService.getPanel({
        type: config.type || datetime.getCurType(),
        date: datetime.getCurDay()
      }).done(function (data) {
        datetime.renderDetail(data, config.hour);
        self.render(data);
      });
    },
    bindEvent: function () {
      var self = this;
      this.container.parent().delegate('click', '.udata-menu-item', function (ev) {
        var $target = $(ev.target), $this = $(ev.currentTarget), id = $this.attr('data-id');
        if ($target.hasClass('udata-item-name')) {
          $target = $target.parent();
        }
        if ($target.hasClass('udata-item-selected') || $target.hasClass('udata-disabled')) {
          return false;
        }
        if ($target.hasClass('udata-display-item')) {
          return self.displayMode($target);
        }
        if (self.currentItem) {
          self.itemDeselect(self.currentItem);
        }
        self.itemSelect($this);
        self.currentItem = $this;
        if (self.currentFunc) {
          self.currentFunc.stop();
          self.id = null;
        }
        var params = {};
        self.id = id;
        params['date'] = datetime.getCurDay();
        params['type'] = datetime.getCurType();
        params['id'] = id;
        if (params['type'] == 'hour') {
          params['hour'] = datetime.getCurHour();
        }
        var mod = 'spm.position';
        if (id == global.config.heatMap) {
          mod = 'heatMap.main';
        } else if (id == global.config.spmModule) {
          mod = 'spm.module';
        }
        if (apps[mod]) {
          self.currentFunc = apps[mod];
          self.currentFunc.run(params, callbacks);
        }
        return false;
      }).delegate('click', '.udata-menu-modules', function (ev) {
        var $target = $(ev.currentTarget), mod = $target.attr('data-func');
        if ($target.hasClass('udata-disabled') || $target.hasClass('udata-module-selected')) {
          return;
        }
        if (apps[mod]) {
          if (self.currentFunc) {
            self.currentFunc.stop();
          }
          if (self.currentItem) {
            self.itemDeselect(self.currentItem);
          }
          $target.addClass('udata-module-selected');
          apps[mod].run({
            stop: function () {
              $target.removeClass('udata-module-selected');
            }
          });
          self.currentFunc = apps[mod];
          self.currentItem = $target;
        }
      }).delegate('change', '.udata-item-slider', function (ev) {
        $('#udata-heatmap-container').css('opacity', ev.target.value / 100);
      });
      var showTools = false, toolList = $('#udata-menu-toollist');
      $('.udata-menu-tools').on('click', function () {
        if (showTools) {
          toolList.hide();
          showTools = false;
        } else {
          toolList.show();
          showTools = true;
        }
      });
      var tools = toolList.all('li');
      tools.on('click', function (ev) {
        var $target = $(ev.currentTarget), func, funcName = $(this).attr('data-func');
        if ($target.hasClass('reload-udata')) {
          connect.post('/reload', { reload: true });
          return;
        }
        if (self.currentFunc) {
          self.currentFunc.stop();
        }
        if (!$target.hasClass('udata-toollist-selected')) {
          if (self.currentItem) {
            self.itemDeselect(self.currentItem);
          }
          tools.removeClass('udata-toollist-selected');
          $target.addClass('udata-toollist-selected');
          var func;
          if (funcName == 'spmFind') {
            func = 'udata/apps/tools/spmfind/main';
          } else if (funcName == 'spmCheck') {
            func = 'udata/apps/tools/spmcheck/main';
          } else if (funcName == 'goldValidate') {
            func = 'udata/apps/tools/goldlog/main';
          } else if (funcName == 'currentSpm') {
            func = 'udata/apps/tools/currentspm/main';
          }
          if (func) {
            S.use(func, function (S, mod) {
              self.currentFunc = mod;
              mod.run && mod.run();
            });
          }
        } else {
          if (self.currentItem) {
            self.itemDeselect(self.currentItem);
          }
          tools.removeClass('udata-toollist-selected');
          self.currentFunc.stop && self.currentFunc.stop();
          self.currentFunc = null;
          self.currentItem = null;
        }
        return false;
      });
      datetime.on('date:change', function (ev) {
        self.refreshMenu(ev.data);
      }).on('time:change', function (ev) {
        var data = ev.data;
        if (data.type == datetime.getCurType()) {
          if (~~data.hour < 10) {
            data.hour = '0' + data.hour;
          }
          self.refreshData(data);
        } else {
          self.refreshMenu(data);
        }
        datetime.setCurType(data.type);
        datetime.setCurHour(data.hour);
      });
    },
    render: function (data) {
      this.state = false;
      var len = data.mainTargets.length - 7;
      if (len > 0) {
        var rect = [];
        while (len) {
          var target = data.mainTargets.pop();
          if (target) {
            if (target.id >= 0) {
              data.subTargets.push(target);
              len--;
            } else {
              rect.push(target);
            }
          } else {
            break;
          }
        }
        if (rect.length) {
          data.mainTargets = data.mainTargets.concat(rect);
        }
      }
      this.container.html(view.render(data));
      this.clickItem();
    },
    close: function () {
      this.id = null;
      this.isRate = false;
      if (this.currentFunc) {
        this.currentFunc.stop();
      }
    }
  };
  return exports;
}();
udataIndex = function (exports) {
  var $ = node.all, menu = udataMenu, view = udataViewsMenuWrapper, global = udataCommonGlobal, connect = udataConnect, dialog = udataCommonDialog, loading = udataCommonLoading, panel = udataViewsPanel, datetime = udataDateTime, body = $(document.body);
  exports = {
    init: function (data, config) {
      var self = this;
      this.status = true;
      this.data = data;
      global.container.append(panel.render());
      this.container = $('.udata-menu-wrapper', global.container);
      this.container.html(view.render());
      menu.init($('.udata-menu-content', this.container));
      if (config.layout == 'horizontal') {
        global.container.removeClass('udata-vertical').addClass('udata-horizontal');
      } else {
        global.container.removeClass('udata-horizontal').addClass('udata-vertical');
      }
      data.layout = config.layout;
      datetime.init(this.container, data, function () {
        self.bindEvent().run();
      });
    },
    refreshData: function (config) {
      if (this.currentFunc) {
        var params = {}, type = config && config.type ? config.type : date.getCurType(), hour = config && config.hour ? config.hour : '';
        params['id'] = this.id;
        params['date'] = date.getCurDay();
        params['type'] = type;
        params['hour'] = hour;
        this.currentFunc.getData && this.currentFunc.getData(params);
      }
    },
    simulateClick: function ($target) {
      var self = this, id = $target.data('id');
      if ($target.hasClass('udata-item-selected')) {
        return false;
      }
      if (self.currentItem) {
        self.itemDeselect(self.currentItem);
      }
      self.itemSelect($target);
      self.currentItem = $target;
      if (self.currentFunc) {
        self.currentFunc.stop();
        self.id = null;
      }
      var params = {};
      if (id == -2) {
        if (date.getCurType() == 'real' || date.getCurType() == 'hour') {
          dialog.showMessage('\u4EB2\uFF0CuData\u6682\u4E0D\u652F\u6301\u5B9E\u65F6\u548C\u5C0F\u65F6\u70ED\u56FE\u3002');
          return;
        }
        self.currentFunc = UData.apps.heatMap;
      } else if (id == -1) {
        self.currentFunc = UData.apps.spm.module;
      } else {
        self.currentFunc = UData.apps.spm.position;
      }
      self.id = id;
      params['date'] = datetime.getCurDay();
      params['type'] = datetime.getCurType();
      params['id'] = id;
      if (datetime.getCurType() == 'hour') {
        var hour = $('.udata-dropdown-selected').data('hour') || $('.udata-timer-dropdown').data('hour');
        params['hour'] = typeof hour == 'number' ? hour < 10 ? '0' + hour : hour : hour;
      }
      if (params['type'] == 'real') {
        recorder.record('real');
      }
      self.currentFunc.run(params);
      return false;
    },
    bindEvent: function () {
      var self = this;
      connect.on('/udata/update_status', function (res) {
        var data = res.data;
        if (self.status == data.running) {
          return;
        }
        self.status = data.running;
        if (!data.running) {
          self.close();
        } else {
          self.run();
        }
      });
      $('.udata-menu-collapse').on('click', function () {
        if (global.container.hasClass('udata-vertical')) {
          global.container.removeClass('udata-vertical').addClass('udata-horizontal');
          if ($('#udata-menu-sub-items').css('display') == 'block') {
            $('#udata-menu-sub-items').css('display', '-webkit-flex');
          }
          self.layout = 'horizontal';
        } else if (global.container.hasClass('udata-horizontal')) {
          global.container.removeClass('udata-horizontal').addClass('udata-vertical');
          if ($('#udata-menu-sub-items').css('display') == '-webkit-flex') {
            $('#udata-menu-sub-items').css('display', 'block');
          }
          self.layout = 'vertical';
        }
        self.layoutChange();
        connect.post('/layout', { layout: self.layout });
        return false;
      });
      $('.udata-menu-close').on('click', function () {
        connect.post('/close');
        self.close();
        return false;
      });
      this.callbacks = {
        error: function (text, code) {
          loading.hide();
          if (code == 404 || code == 602) {
            dialog.showMessage(text);
            if (code == 404) {
              recorder.record('noData');
            }
          } else {
            dialog.show(text);
            if (code == 401) {
              if (pageBody.hasClass(realMissionMode)) {
                recorder.record('noRealRight');
              } else {
                recorder.record('noRight');
              }
            }
          }
        },
        stop: function () {
          dialog.hide();
        }
      };
      var udataCon = global.container;
      this.container.delegate('click', '.udata-items-more-wrapper', function (ev) {
        var $this = $(ev.currentTarget), $tar = $this.all('.udata-items-more');
        if ($tar.hasClass('udata-items-collapsed')) {
          $tar.removeClass('udata-items-collapsed');
          if (udataCon.hasClass('udata-vertical')) {
            $('#udata-menu-sub-items').slideUp(0.3);
          } else if (udataCon.hasClass('udata-horizontal')) {
            $('#udata-menu-sub-items').hide();
          }
          recorder.record('hideSub');
        } else {
          $tar.addClass('udata-items-collapsed');
          if (udataCon.hasClass('udata-vertical')) {
            $('#udata-menu-sub-items').slideDown(0.3);
          } else if (udataCon.hasClass('udata-horizontal')) {
            $('#udata-menu-sub-items').css('display', '-webkit-flex');
          }
          recorder.record('showSub');
        }
        return false;
      }).delegate('click', '.udata-items-config', function () {
        if (global.getEnv() == 'normal') {
          connect.post('/options/open');
        }
      }).delegate('click', '.udata-lottery-trigger', function () {
        S.use('udata/lottery', function (S, Lottery) {
          Lottery.init();
        });
      });
      return this;
    },
    layoutChange: function () {
      datetime.updatePosition(this.layout);
    },
    run: function () {
      this.closed = false;
      global.container.show();
      menu.render(this.data);
    },
    close: function () {
      if (this.closed) {
        return;
      }
      this.closed = true;
      this.status = false;
      global.container.hide();
      menu.close();
    }
  };
  return exports;
}();
udataInit = function (exports) {
  var $ = node.all, body = $(document.body), main = udataIndex, global = udataCommonGlobal, response = udataResponse, dataService = udataDataService, dialog = udataCommonDialog, connect = udataConnect, recorder = udataRecorder, lock = 'udata_running_lock';
  function showMock() {
    if (global.isMock()) {
      setTimeout(function () {
        $('#udata-mock-container').show();
      }, 1500);
      recorder.record('noRight');
    }
  }
  exports = {
    init: function (config) {
      if ($('#' + lock).length > 0) {
        return;
      }
      body.append($('<u id="' + lock + '"></u>'));
      global.init(config);
      dialog.init();
      if (!this.checkEnv()) {
        dialog.showMessage('<div>\u4EB2\uFF0C\u60A8\u4F7F\u7528\u7684\u6D4F\u89C8\u5668\u5185\u6838\u7248\u672C\u592A\u4F4E\uFF0C\u8BF7\u4E0B\u8F7D\u6700\u65B0\u7248chrome\u6D4F\u89C8\u5668\u4F7F\u7528Udata\uFF0C<a href="http://www.google.cn/intl/zh-CN/chrome/browser/">\u70B9\u51FB\u4E0B\u8F7D\u6700\u65B0\u7248\u6D4F\u89C8\u5668</a>\uFF01</div>', 10 * 1000);
        return;
      }
      if (global.aplus) {
        return S.use('udata/apps/aplus/main', function (S, aplus) {
          aplus.init();
        });
      }
      config = config || {};
      recorder.init();
      var self = this;
      function callback(res) {
        var data = res.data;
        if (data.running) {
          self.config = S.merge(data, config);
          self._init();
        } else {
          self.close();
        }
      }
      connect.post('/reload', { time: config.background });
      connect.post('/udata/running', callback);
      connect.on('/udata/update_status', callback);
    },
    _init: function () {
      if (this.hasInitMenu) {
        return;
      }
      if (this.inited) {
        this.auth();
        return;
      }
      this.inited = true;
      this.auth();
    },
    auth: function () {
      var self = this;
      global._init();
      if (!global.getSPMId()) {
        connect.post('/error', { type: 'spm' });
        recorder.record('noSPM');
        return;
      }
      dataService.getPanel().done(function (data) {
        showMock();
        self.initMenu(data);
      }).error(function (err, data) {
        if (err.code < 0) {
          if (err.code == global.config.ERROR_CODE['NOT_LOGIN']) {
            return dialog.show('<div class="udata-alert-password">\u4EB2\uFF0C\u60A8\u8FD8\u6CA1\u6709\u767B\u5F55\u65E0\u6CD5\u76F4\u63A5\u4F7F\u7528uData\u3002\u8BF7\u76F4\u63A5\u8BBF\u95EEA+\u8FDB\u884C\u767B\u5F55\uFF1A<p class="udata-alert-right"><a class="visit_aplus" href="http://dwaplus.taobao.ali.com/" target="_blank">\u767B\u9646A+</a></p></div>', function () {
            }, function () {
            }, true, function () {
              connect.post('/close');
            });
          }
        }
        if (err.code == global.config.ERROR_CODE['UNAUTHORIZED']) {
          if (this.params.type && this.params.type == 'real') {
            dialog.showMessage('<div>\u4EB2\uFF0C\u60A8\u8FD8\u6CA1\u6709\u67E5\u770B\u5B9E\u65F6\u6570\u636E\u7684\u6743\u9650\uFF0C\u8BF7<a href="http://wf.alibaba-inc.com/new/smartflow/default/index?requesttypename=c_data_proj&role=13521" target="_blank">\u70B9\u51FB\u8BE5\u94FE\u63A5</a>\u7533\u8BF7\u6743\u9650\uFF01</div>', 10 * 1000);
          } else {
            dialog.show('<div class="udata-alert-password">\u4EB2\uFF0C\u60A8\u76EE\u524D\u8FD8\u6CA1\u6709\u6743\u9650\u54E6\uFF0C\u60A8\u53EF\u4EE5\u70B9\u51FB\u300E\u4F53\u9A8CuData\u300F\u6765\u8FDB\u884C\u8BD5\u7528\u3002\u7533\u8BF7\u6743\u9650\u540E\u5373\u53EF\u4F7F\u7528\u5B8C\u6574\u7684\u529F\u80FD\u3002<p class="udata-alert-right"><a href="http://www.taobao.com?udata=1" class="tryit" target="_blank">\u4F53\u9A8CuData</a><a class="applyit" href="http://wf.alibaba-inc.com/new/smartflow/default/index?requesttypename=c_data_proj&role=13521" target="_blank">\u7533\u8BF7\u6743\u9650</a></p></div>', function () {
            }, function () {
            }, true, function () {
              connect.post('/close');
            });
            chrome.runtime.sendMessage({ type: 'hasMocked' });
            if (!global.isMock()) {
              return;
            }
          }
        } else {
          dialog.showMessage(err.message, 3 * 1000);
        }
        self.initMenu(data);
      }, true);
    },
    initMenu: function (data) {
      var self = this;
      global.userId = data.workId;
      if (self.hasInitMenu) {
        return;
      }
      self.hasInitMenu = true;
      main.init(data, self.config);
    },
    close: function () {
      global.container && global.container.hide();
    },
    checkEnv: function () {
      var div = document.createElement('div');
      if (!div.webkitCreateShadowRoot && !div.createShadowRoot) {
        div = null;
        return false;
      }
      div = null;
      return true;
    }
  };
  return exports;
}();
module.exports = udataInit;
});