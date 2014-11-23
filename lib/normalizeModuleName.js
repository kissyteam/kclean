var utils = require('./utils'),
    defaultValues = require('./defaultValues'),
    _ = require('lodash');

module.exports = function normalizeModuleName(name, moduleId) {
    var kclean = this,
        options = kclean.options,
        prefixMode = options.prefixMode,
        prefixTransform = options.prefixTransform,
        dependencyBlacklist = defaultValues.dependencyBlacklist,
        prefixTransformValue,
        preNormalized,
        postNormalized;
        name = name || '';

    if (name === '{}') {
        if (dependencyBlacklist[name] === 'remove') {
            return '';
        } else {
            return name;
        }
    }
    preNormalized = utils.prefixReservedWords(name.replace(/\./g, '').replace(/[^A-Za-z0-9_$]/g, '_').replace(/^_+/, ''));
    postNormalized = prefixMode === 'camelCase' ? utils.convertToCamelCase(preNormalized) : preNormalized;
    if (options.ignoreModules.indexOf(postNormalized) === -1 && kclean.variablesStore[postNormalized]) {
        kclean.storedModules[postNormalized] = false;
        postNormalized = function findValidName(currentName) {
            if (kclean.variablesStore[currentName]) {
                return findValidName('_' + currentName + '_');
            } else {
                return currentName;
            }
        } (postNormalized);

        kclean.storedModules[postNormalized] = true;
    }
    if (_.isFunction(prefixTransform)) {
        prefixTransformValue = prefixTransform(postNormalized, moduleId);
        if (_.isString(prefixTransformValue) && prefixTransformValue.length) {
            postNormalized = prefixTransformValue;
        }
    }


    if(postNormalized && !this.moduleMap[postNormalized]) {
        this.moduleMap[postNormalized] = name;
    }

    return postNormalized;
};
