var utils = require('./utils'),
    convertToFunctionExpression = require('./convertToFunctionExpression'),
    convertToObjectDeclaration = require('./convertToObjectDeclaration'),
    defaultValues = require('./defaultValues'),
    normalizeModuleName = require('./normalizeModuleName'),
    createAst = require('./createAst'),
    estraverse = require('estraverse'),
    _ = require('lodash')

module.exports = function convertDefinesAndRequires(node, parent) {
    var kclean = this,
        options = kclean.options,
        moduleName,
        args,
        dependencies,
        moduleReturnValue,
        moduleId,
        params,
        isDefine = utils.isDefine(node, this),
        isRequire = utils.isRequire(node),
        startLineNumber,
        callbackFuncArg = false,
        type = '',
        shouldBeIgnored,
        moduleToBeIgnored,
        parentHasFunctionExpressionArgument,
        defaultRange = defaultValues.defaultRange,
        defaultLOC = defaultValues.defaultLOC,
        range = node.range || defaultRange,
        loc = node.loc || defaultLOC,
        dependencyBlacklist = defaultValues.dependencyBlacklist,
        shouldOptimize;

    startLineNumber = isDefine || isRequire ? node.expression.loc.start.line : node && node.loc && node.loc.start ? node.loc.start.line : null;

    shouldBeIgnored = (kclean.matchingCommentLineNumbers[startLineNumber] || kclean.matchingCommentLineNumbers[startLineNumber - 1]);

    if(utils.isAMDConditional(node)) {

        estraverse.traverse(node, {
            'enter': function(node) {
                var normalizedModuleName;
                if(utils.isDefine(node, kclean)) {
                    if(node.expression && node.expression.arguments && node.expression.arguments.length) {
                        if(node.expression.arguments[0].type === 'Literal' && node.expression.arguments[0].value) {
                            normalizedModuleName = normalizeModuleName.call(kclean, node.expression.arguments[0].value);
                            if(options.transformAMDChecks !== true) {
                                kclean.conditionalModulesToIgnore[normalizedModuleName] = true;
                            } else {
                                kclean.conditionalModulesToNotOptimize[normalizedModuleName] = true;
                            }
                            if(options.createAnonymousAMDModule === true) {
                                kclean.storedModules[normalizedModuleName] = false;
                                node.expression.arguments.shift();
                            }
                        }
                    }
                }
            }
        });


        if(!shouldBeIgnored && options.transformAMDChecks === true) {

            node.test = {
                'type': 'Literal',
                'value': true,
                'raw': 'true',
                'range': range,
                'loc': loc
            };

            return node;
        }

    }

    if(isDefine || isRequire) {
        args = Array.prototype.slice.call(node.expression['arguments'], 0);

        moduleReturnValue = isRequire ? args[1] : args[args.length - 1];

        moduleId = node.expression['arguments'][0].value;

        moduleName = normalizeModuleName.call(kclean, moduleId);

        shouldOptimize = !kclean.conditionalModulesToNotOptimize[moduleName];

        dependencies = (function() {
            var deps = isRequire ? args[0] : args[args.length - 2],
                depNames = [],
                hasExportsParam;

            if(_.isPlainObject(deps)) {
                deps = deps.elements || [];
            } else {
                deps = [];
            }

            hasExportsParam = _.where(deps, {
                'value': 'exports'
            }).length;

            if(_.isArray(deps) && deps.length) {
                _.each(deps, function(currentDependency) {
                    if(dependencyBlacklist[currentDependency.value] && !shouldOptimize) {
                        depNames.push(currentDependency.value);
                    } else if(dependencyBlacklist[currentDependency.value] !== 'remove') {
                        if(dependencyBlacklist[currentDependency.value]) {
                            depNames.push('{}');
                        } else {
                            depNames.push(currentDependency.value);
                        }
                    } else {
                        if(!hasExportsParam) {
                            depNames.push('{}');
                        }
                    }
                });
            }
            return depNames;
        }());


        params = {
            'node': node,
            'moduleName': moduleName,
            'moduleId': moduleId,
            'dependencies': dependencies,
            'moduleReturnValue': moduleReturnValue,
            'isDefine': isDefine,
            'isRequire': isRequire,
            'range': range,
            'loc': loc,
            'shouldOptimize': shouldOptimize
        };

        if(isDefine) {

            if(shouldBeIgnored || !moduleName || kclean.conditionalModulesToIgnore[moduleName] === true) {
                kclean.options.ignoreModules.push(moduleName);
                return node;
            }

            if(_.contains(options.removeModules, moduleName)) {

                kclean.storedModules[moduleName] = false;

                return {
                    'type': 'EmptyStatement'
                };
            }

            if(_.isObject(options.shimOverrides) && options.shimOverrides[moduleName]) {
                params.moduleReturnValue = createAst.call(kclean, options.shimOverrides[moduleName]);

                if(_.isArray(params.moduleReturnValue.body) && _.isObject(params.moduleReturnValue.body[0])) {

                    if(_.isObject(params.moduleReturnValue.body[0].expression)) {
                        params.moduleReturnValue = params.moduleReturnValue.body[0].expression;
                        type = 'objectExpression';
                    }
                } else {
                    params.moduleReturnValue = moduleReturnValue;
                }
            }

            if(params.moduleReturnValue && params.moduleReturnValue.type === 'Identifier') {
                type = 'functionExpression';
            }

            if(_.contains(options.ignoreModules, moduleName)) {
                return node;
            } else if(utils.isFunctionExpression(moduleReturnValue) || type === 'functionExpression') {
                return convertToFunctionExpression.call(kclean, params);
            } else if(utils.isObjectExpression(moduleReturnValue) || type === 'objectExpression') {
                return convertToObjectDeclaration.call(kclean, params);
            } else if(utils.isFunctionCallExpression(moduleReturnValue)) {
                return convertToObjectDeclaration.call(kclean, params, 'functionCallExpression');
            }

        } else if(isRequire) {

            if(shouldBeIgnored) {
                return node;
            }

            callbackFuncArg = _.isArray(node.expression['arguments']) && node.expression['arguments'].length ? node.expression['arguments'][1] && node.expression['arguments'][1].body && node.expression['arguments'][1].body.body && node.expression['arguments'][1].body.body.length : false;

            if(options.removeAllRequires !== true && callbackFuncArg) {
                return convertToFunctionExpression.call(kclean, params);
            } else {
                return {
                    'type': 'EmptyStatement',
                    'range': range,
                    'loc': loc
                };
            }
        }
    } else {

        if(node.type === 'FunctionExpression' &&
            _.isArray(node.params) &&
            _.where(node.params, { 'type': 'Identifier', 'name': 'exports' }).length &&
            _.isObject(node.body) &&
            _.isArray(node.body.body) &&
            !_.where(node.body.body, {
                'type': 'ReturnStatement'
            }).length) {

            parentHasFunctionExpressionArgument = (function () {

                if (!parent || !parent.arguments) {
                    return false;
                }

                if (parent && parent.arguments && parent.arguments.length) {
                    return _.where(parent.arguments, { 'type': 'FunctionExpression' }).length;
                }

                return false;
            }());

            if(parentHasFunctionExpressionArgument) {

                node.body.body.unshift({
                    'type': 'ExpressionStatement',
                    'expression': {
                        'type': 'AssignmentExpression',
                        'operator': '=',
                        'left': {
                            'type': 'Identifier',
                            'name': 'exports',
                            'range': defaultRange,
                            'loc': defaultLOC
                        },
                        'right': {
                            'type': 'LogicalExpression',
                            'operator': '||',
                            'left': {
                                'type': 'Identifier',
                                'name': 'exports',
                                'range': defaultRange,
                                'loc': defaultLOC
                            },
                            'right': {
                                'type': 'ObjectExpression',
                                'properties': [],
                                'range': defaultRange,
                                'loc': defaultLOC
                            },
                            'range': defaultRange,
                            'loc': defaultLOC
                        },
                        'range': defaultRange,
                        'loc': defaultLOC
                    },
                    'range': defaultRange,
                    'loc': defaultLOC
                });
            }

            node.body.body.push({
                'type': 'ReturnStatement',
                'argument': {
                    'type': 'Identifier',
                    'name': 'exports',
                    'range': defaultRange,
                    'loc': defaultLOC
                },
                'range': defaultRange,
                'loc': defaultLOC
            });
        }
        return node;
    }
};
