var errorMsgs = require('./errorMsgs'),
    _ = require('lodash'),
    escodegen = require('escodegen');

module.exports = function generateCode(ast) {
    var kclean = this,
        options = kclean.options,
        esprimaOptions = options.esprima || {},
        escodegenOptions = options.escodegen || {};

    if(!_.isPlainObject(escodegen) || !_.isFunction(escodegen.generate)) {
        throw new Error(errorMsgs.escodegen);
    }

    if(esprimaOptions.comment === true && escodegenOptions.comment === true) {
        try {
            ast = escodegen.attachComments(ast, ast.comments, ast.tokens);
        } catch(e) {}
    }

    return escodegen.generate(ast, escodegenOptions);
};
