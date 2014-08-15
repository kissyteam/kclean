var kclean = require('kclean'),
    fs = require('fs');

var code = fs.readFileSync("define.js").toString(),
    cleanedCode = kclean.clean(code,{
                                     prefixMode:"camelCase",
                                     outputModule:"sys/main",
                                     wrap:{
		                                start: 'define("{moduleName}", {dependencies}, function(require, exports, module) {\n',
                                     }
                              });

fs.writeFileSync("clean_define.js",cleanedCode);