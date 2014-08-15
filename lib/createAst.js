var errorMsgs = require('./errorMsgs'),
    utils = require('./utils'),
    _ = require('lodash'),
    esprima = require('esprima');
        
module.exports = function createAst(providedCode) {
    var kclean = this,
        options = kclean.options,
        filePath = options.filePath,
        code = providedCode || options.code || (filePath ? utils.readFile(filePath) : ''),
        esprimaOptions = options.esprima;

    if(!code) {
        throw new Error(errorMsgs.emptyCode);
    } else {
        if(!_.isPlainObject(esprima) || !_.isFunction(esprima.parse)) {
            throw new Error(errorMsgs.esprima);
        }
        return esprima.parse(code, esprimaOptions);
    }
};
