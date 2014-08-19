var defaultOptions = require('./defaultOptions'),
    errorMsgs = require('./errorMsgs'),
    clean = require('./clean'),
    _ = require('lodash');

function Kclean(options, overloadedOptions) {

            var defaultOptions = _.cloneDeep(this.defaultOptions || {}),
                userOptions = options || overloadedOptions || {};


            if(!_.isPlainObject(options) && _.isString(options)) {
                userOptions = _.merge({
                    'code': options
                }, _.isObject(overloadedOptions) ? overloadedOptions : {});
            }

            this.kissy = false;

            this.seajs = false;

            this.modulex = false;

            this.moduleMap = {};

            this.loadedModules = [];

            this.storedModules = {};

            this.variablesStore = {};

            this.originalAst = {};

            this.callbackParameterMap = {};

            this.conditionalModulesToIgnore = {};

            this.conditionalModulesToNotOptimize = {};

            this.matchingCommentLineNumbers = {};

            this.comments = [];

            this.options = _.merge(defaultOptions, userOptions);
}

Kclean.prototype = {
    'clean': clean,
    'defaultOptions': defaultOptions
};

module.exports = {
     clean: function(options, overloadedOptions) {

         var kclean = new Kclean(options, overloadedOptions),
             cleanedCode = kclean.clean();

         return cleanedCode;
     }
 };