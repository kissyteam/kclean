KISSY.add('bee-demo/index',["./mods/header","./mods/article"],function(S ,require, exports, module) {var e=require("./mods/header");
e.init();var r=require("./mods/article");
r.init();

exports.a=123;

});KISSY.add('bee-demo/mods/header',["node"],function(S ,require, exports, module) {var e=require("node").all;module.exports={init:function(){S.log("header init"),e("header").html("this is header")}};});KISSY.add('bee-demo/mods/article',["node"],function(S ,require, exports, module) {var i=require("node").all;module.exports={init:function(){S.log("article init"),i("article").html("this is article")}};});