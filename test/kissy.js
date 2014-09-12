KISSY.add('bee-demo/index', ["./mods/header", "./mods/article"],function(S, require, exports, module) {
	require("./mods/header");
    exports.a = 123;
});

KISSY.add('bee-demo/mods/header', ["node"], function(S, require, exports, module) {
	var e = require("node");
	module.exports = {
		init: function() {
		}
	};
});
