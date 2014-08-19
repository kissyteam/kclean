kclean
======

A build tool that converts KISSY module code to standard JavaScript.

### 如何使用
##### KISSY(默认)
```js
var kclean = require('kclean'),
    fs = require('fs');

var code = fs.readFileSync("code.js").toString(),
    cleanedCode = kclean.clean(code,{
                                outputModule:"udata/init" //输出模块
                              });

fs.writeFileSync("clean.js",cleanedCode);

```
##### sea.js
```js
var kclean = require('kclean'),
    fs = require('fs');

var code = fs.readFileSync("sea.js").toString(),
    cleanedCode = kclean.clean(code,{
         outputModule:"sys/main"
    });

fs.writeFileSync("clean_sea.js",cleanedCode);
//配置完全一样，kclean内部会自动识别
```
##### 转化为原生代码
```js
var kclean = require('kclean'),
    fs = require('fs');

var code = fs.readFileSync("sea.js").toString(),
    cleanedCode = kclean.clean(code,{
         prefixMode:"camelCase",
         wrap:{
            start:"(function(){",
            end:"\nsysMain.init();\n})();"
         }
    });

fs.writeFileSync("clean.js",cleanedCode);
```
##### modulex
支持[https://github.com/kissyteam/modulex](https://github.com/kissyteam/modulex)

#### gulp插件
gulp-kclean [https://www.npmjs.org/package/gulp-kclean](https://www.npmjs.org/package/gulp-kclean)

#### grunt插件
暂未开发
