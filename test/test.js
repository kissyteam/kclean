var kclean = require('kclean'),
    fs = require('fs');

var code = fs.readFileSync("code.js").toString(),
    cleanedCode = kclean.clean(code,{
                                     prefixMode:"camelCase",
                                     outputModule:"udata/init"
                              });

fs.writeFileSync("clean.js",cleanedCode);
