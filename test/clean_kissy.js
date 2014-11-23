KISSY.add("bee-demo/index", ["node"], function(S ,require, exports, module) {
var node = require("node");
var beeDemoModsIndex, beeDemoIndex;
beeDemoModsIndex = function (exports) {
  var e = node;
  exports = {
    init: function () {
    }
  };
  return exports;
}();
beeDemoIndex = function (exports) {
  exports = {};
  exports.a = 123;
  return exports;
}();
module.exports = beeDemoIndex;
});