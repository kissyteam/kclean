var kclean = require('kclean'),
    fs = require('fs');

var code = fs.readFileSync("sea.js").toString(),
    cleanedCode = kclean.clean(code,{
         outputModule:"sys/main",
         ignoreModule: ["sys/util","sys/status-manager"]
    });

fs.writeFileSync("clean_sea.js",cleanedCode);