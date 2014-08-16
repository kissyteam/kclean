var kclean = require('kclean'),
    fs = require('fs');

var code = fs.readFileSync("sea.js").toString(),
    cleanedCode = kclean.clean(code,{
         outputModule:"sys/main"
    });

fs.writeFileSync("clean_sea.js",cleanedCode);