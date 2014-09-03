KISSY.add("bee-demo/index", ["node"], function(S ,require, exports, module) {
var node = require("node");
var beeDemoModsHeader, beeDemoModsArticle, beeDemoIndex;
beeDemoModsHeader = function (exports) {
  var e = node.all;
  exports = {
    init: function () {
      S.log('header init'), e('header').html('this is header');
    }
  };
  return exports;
}();
beeDemoModsArticle = function (exports) {
  var i = node.all;
  exports = {
    init: function () {
      S.log('article init'), i('article').html('this is article');
    }
  };
  return exports;
}();
beeDemoIndex = function (exports) {
  var e = beeDemoModsHeader;
  e.init();
  var r = beeDemoModsArticle;
  r.init(), exports = {};
  return exports;
}();
module.exports = beeDemoIndex;
});