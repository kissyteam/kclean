var kclean = require('kclean'),
    fs = require('fs');

var code = fs.readFileSync("modulex.js").toString(),
    cleanedCode = kclean.clean(code,{
         outputModule:"anim/base"
    });

fs.writeFileSync("clean_sea.js",cleanedCode);