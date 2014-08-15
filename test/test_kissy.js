var kclean = require('kclean'),
    fs = require('fs');

var code = fs.readFileSync("kissy.js").toString(),
    cleanedCode = kclean.clean(code,{
                                     prefixMode:"camelCase",
                                     outputModule:"udata/init"
                              });

fs.writeFileSync("clean_kissy.js",cleanedCode);
