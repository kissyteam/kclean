var utils = require('./utils'),
    normalizeModuleName = require('./normalizeModuleName');

module.exports = function(node) {
    if(!utils.isDefine(node)) {
        return;
    }

    var kclean = this,
        moduleId = node.expression['arguments'][0].value,
        moduleName = normalizeModuleName.call(kclean, moduleId);

    if(moduleId) {
        this.loadedModules.push(moduleId);
    }

    return moduleName;
};