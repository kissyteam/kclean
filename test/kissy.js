KISSY.add('bee-demo/index', ["./mods/", "./mods/article"],function(S, require, exports, module) {
	require("./mods/");
    exports.a = 123;
});

KISSY.add('bee-demo/mods/index', ["node"], function(S, require, exports, module) {
	var e = require("node");
	module.exports = {
		init: function() {
		}
	};
});
