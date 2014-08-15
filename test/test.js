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