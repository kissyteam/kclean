KISSY.add("bee-demo/index", ["node","./mods/header"], function(S ,require, exports, module) {
var node = require("node");
var modsHeader = require("./mods/header");
var beeDemoModsHeader, beeDemoIndex;
beeDemoModsHeader = function (exports) {
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