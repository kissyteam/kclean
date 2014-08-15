kclean
======

A build tool that converts KISSY module code to standard JavaScript.

### 如何使用
```js
var kclean = require('kclean'),
    fs = require('fs');

var code = fs.readFileSync("code.js").toString(),
    cleanedCode = kclean.clean(code,{
                                     prefixMode:"camelCase",
                                     outputModule:"udata/init" //输出模块
                              });

fs.writeFileSync("clean.js",cleanedCode);

```

#### gulp插件
gulp-kclean [https://www.npmjs.org/package/gulp-kclean](https://www.npmjs.org/package/gulp-kclean)

#### grunt插件
暂未开发
