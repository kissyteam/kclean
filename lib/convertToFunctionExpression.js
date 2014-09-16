var utils = require('./utils'),
    convertToIIFE = require('./convertToIIFE'),
    convertToIIFEDeclaration = require('./convertToIIFEDeclaration'),
    defaultValues = require('./defaultValues'),
    normalizeModuleName = require('./normalizeModuleName'),
    defaultValues = require('./defaultValues'),
    _ = require('lodash'),
    estraverse = require('estraverse');

module.exports = function convertToFunctionExpression(obj) {
        var kclean = this,
            options = kclean.options,
            ignoreModules = options.ignoreModules,
            node = obj.node,
            isDefine = obj.isDefine,
            isRequire = obj.isRequire,
            isOptimized = false,
            moduleName  = obj.moduleName,
            moduleId = obj.moduleId,
            dependencies = obj.dependencies,
            depLength = dependencies.length,
            aggressiveOptimizations = options.aggressiveOptimizations,
            exportsExpressions = [],
            moduleExportsExpressions = [],
            defaultRange = defaultValues.defaultRange,
            defaultLOC = defaultValues.defaultLOC,
            range = obj.range || defaultRange,
            loc = obj.loc || defaultLOC,
            shouldOptimize = obj.shouldOptimize,
            dependencyBlacklist = defaultValues.dependencyBlacklist,
            hasNonMatchingParameter = false,
            callbackFunc = (function() {
                var callbackFunc = obj.moduleReturnValue,
                    body,
                    returnStatements,
                    firstReturnStatement,
                    returnStatementArg;


                if(callbackFunc && callbackFunc.type === 'FunctionExpression' && callbackFunc.body && _.isArray(callbackFunc.body.body) && callbackFunc.body.body.length) {

                    body = _.filter(callbackFunc.body.body, function(node) {
                        if(options.removeUseStricts === true) {
                            return !utils.isUseStrict(node.expression);
                        } else {
                            return node;
                        }
                    });

                    returnStatements = _.where(body, {
                        'type': 'ReturnStatement'
                    });

                    exportsExpressions = _.where(body, {
                        'left': {
                            'type': 'Identifier',
                            'name': 'exports'
                        }
                    });

                    moduleExportsExpressions = _.where(body, {
                        'left': {
                            'type': 'MemberExpression',
                            'object': {
                                'type': 'Identifier',
                                'name': 'module'
                            },
                            'property': {
                                'type': 'Identifier',
                                'name': 'exports'
                            }
                        }
                    });

                    if(returnStatements.length) {
                        firstReturnStatement = returnStatements[0];
                        returnStatementArg = firstReturnStatement.argument;

                        hasNonMatchingParameter = function () {
                            var nonMatchingParameter = false;
                            _.each(callbackFunc.params, function (currentParam) {
                                var currentParamName = currentParam.name;
                                if(!kclean.storedModules[currentParamName] && !dependencyBlacklist[currentParamName]) {
                                    nonMatchingParameter = true;
                                }
                            });
                            return nonMatchingParameter;
                        }();

                        if(hasNonMatchingParameter || !shouldOptimize || (!utils.isFunctionExpression(firstReturnStatement) && body.length > 1) || (returnStatementArg && returnStatementArg.type === 'Identifier')) {
                            return callbackFunc;
                        } else {
                            callbackFunc = returnStatementArg;
                            isOptimized = true;

                            if(callbackFunc.params) {
                                depLength = callbackFunc.params.length;
                            }
                        }
                    }
                } else if(callbackFunc && callbackFunc.type === 'FunctionExpression' && callbackFunc.body && _.isArray(callbackFunc.body.body) && callbackFunc.body.body.length === 0) {
                    callbackFunc = {
                        'type': 'Identifier',
                        'name': 'undefined',
                        'range': range,
                        'loc': loc
                    };
                    depLength = 0;
                }
                return callbackFunc;
            }()),
            hasReturnStatement = (function() {
                var returns = [];

                if(callbackFunc && callbackFunc.body && _.isArray(callbackFunc.body.body)) {
                    returns = _.where(callbackFunc.body.body, { 'type': 'ReturnStatement' });
                    if(returns.length) {
                        return true;
                    }
                }
                return false;
            }()),
            originalCallbackFuncParams,
            hasExportsParam = (function() {
                var cbParams = callbackFunc.params || [];

                return _.where(cbParams, {
                    'name': 'exports'
                }).length;
            }()),
            normalizeDependencyNames = {},
            dependencyNames = [],

            findNewParamName = function findNewParamName(name) {
                name = '_' + name + '_';
                var containsLocalVariable = (function() {
                    var containsVariable = false;

                    if(normalizeDependencyNames[name]) {
                        containsVariable = true;
                    } else {
                        estraverse.traverse(callbackFunc, {
                            'enter': function(node) {
                                if(node.type === 'VariableDeclarator' &&
                                    node.id &&
                                    node.id.type === 'Identifier' &&
                                    node.id.name === name) {
                                    containsVariable = true;
                                }
                            }
                        });
                    }
                    return containsVariable;
                }());

                if(!containsLocalVariable) {
                    return name;
                } else {
                    return findNewParamName(name);
                }
            },
            matchingRequireExpressionNames = (function() {
                var matchingNames = [];

                if(hasExportsParam) {
                    estraverse.traverse(callbackFunc, {
                        'enter': function(node) {
                            var variableName,
                                expressionName;

                            if(node.type === 'VariableDeclarator' && utils.isRequireExpression(node.init)) {

                                if(node.id && node.id.name && node.init && node.init['arguments'] && node.init['arguments'][0] && node.init['arguments'][0].value) {
                                    variableName = node.id.name;
                                    expressionName = normalizeModuleName.call(kclean, utils.normalizeDependencyName(moduleId, node.init['arguments'][0].value, moduleId));
                                
                                    if (!_.contains(ignoreModules, expressionName) && (variableName === expressionName)) {
                                        matchingNames.push({
                                            'originalName': expressionName,
                                            'newName': findNewParamName(expressionName),
                                            'range': (node.range || defaultRange),
                                            'loc': (node.loc || defaultLOC)
                                        });
                                    }
                                }
                            }
                        }
                    });
                }
                return matchingNames;
            }()),
            matchingRequireExpressionParams = (function() {
                var params = [];

                _.each(matchingRequireExpressionNames, function(currentParam) {
                    params.push({
                        'type': 'Identifier',
                        'name': currentParam.newName ? currentParam.newName : currentParam,
                        'range': currentParam.range,
                        'loc': currentParam.loc
                    });
                });

                return params;
            }()),
            callbackFuncParams = (function() {
                var deps = [],
                    currentName,
                    cbParams = _.union((callbackFunc.params && callbackFunc.params.length ? callbackFunc.params : !shouldOptimize && dependencyNames && dependencyNames.length ? dependencyNames : []), matchingRequireExpressionParams),
                    mappedParameter = {};

                _.each(cbParams, function(currentParam, iterator) {
                    if(currentParam) {
                        currentName = currentParam.name;
                    } else {
                        currentName = dependencyNames[iterator].name;
                    }

                    if(!shouldOptimize && currentName !== '{}') {
                        deps.push({
                            'type': 'Identifier',
                            'name': currentName,
                            'range': defaultRange,
                            'loc': defaultLOC
                        });
                    } else if(currentName !== '{}' && (!hasExportsParam || defaultValues.dependencyBlacklist[currentName] !== 'remove')) {
                        deps.push({
                            'type': 'Identifier',
                            'name': currentName,
                            'range': defaultRange,
                            'loc': defaultLOC
                        });

                        if(!isOptimized && aggressiveOptimizations === true && !kclean.storedModules[currentName] && dependencyNames[iterator]) {

                            if(!kclean.callbackParameterMap[dependencyNames[iterator].name]) {
                                kclean.callbackParameterMap[dependencyNames[iterator].name] = [
                                    {
                                        'name': currentName,
                                        'count': 1
                                    }
                                ];
                            } else {
                                mappedParameter = _.where(kclean.callbackParameterMap[dependencyNames[iterator].name], {
                                    'name': currentName
                                });

                                if(mappedParameter.length) {
                                    mappedParameter = mappedParameter[0];
                                    mappedParameter.count += 1;
                                } else {
                                    kclean.callbackParameterMap[dependencyNames[iterator].name].push({
                                        'name': currentName,
                                        'count': 1
                                    });
                                }
                            }
                        }
                    }
                });

                originalCallbackFuncParams = deps;

                return _.filter(deps || [], function(currentParam) {
                    return aggressiveOptimizations === true && shouldOptimize ? !kclean.storedModules[currentParam.name] : true;
                });
            }()),
            isCommonJS = !hasReturnStatement && hasExportsParam,
            hasExportsAssignment = exportsExpressions.length || moduleExportsExpressions.length,
            dependencyNameLength,
            callbackFuncParamsLength;

        dependencyNameLength = dependencyNames.length;
        callbackFuncParamsLength = callbackFuncParams.length;

        if (dependencyNameLength > callbackFuncParamsLength) {
            dependencyNames.splice(callbackFuncParamsLength, dependencyNameLength - callbackFuncParamsLength);
        }

        if(isCommonJS && hasExportsAssignment) {
            callbackFunc.body.body.push({
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

        estraverse.replace(callbackFunc, {
            'enter': function(node, parent) {
                var normalizedModuleName,
                    newName;

                if(utils.isRequireExpression(node)) {

                    if(node['arguments'] && node['arguments'][0] && node['arguments'][0].value) {

                        normalizedModuleName = normalizeModuleName.call(kclean, utils.normalizeDependencyName(moduleId, node['arguments'][0].value, moduleId));

                        if(_.contains(ignoreModules, normalizedModuleName)) {
                            return node;
                        }

                        if(_.where(matchingRequireExpressionNames, {
                            'originalName': normalizedModuleName
                        }).length) {
                            newName = _.where(matchingRequireExpressionNames, {
                            'originalName': normalizedModuleName
                            })[0].newName;
                        }


                        if(parent.type == 'VariableDeclarator') {
                            return {
                                'type': 'Identifier',
                                'name': newName ? newName : normalizedModuleName,
                                'range': (node.range || defaultRange),
                                'loc': (node.loc || defaultLOC)
                            };
                        }
                    } else {
                        return node;
                    }
                }
            }
        });

        if(isDefine) {
            return convertToIIFEDeclaration.call(kclean, {
                'moduleName': moduleName,
                'dependencyNames': dependencyNames,
                'callbackFuncParams': callbackFuncParams,
                'hasExportsParam': hasExportsParam,
                'callbackFunc': callbackFunc,
                'isOptimized': isOptimized,
                'node': node
            });
        } else if(isRequire) {
            return convertToIIFE.call(kclean, {
                'dependencyNames': dependencyNames,
                'callbackFuncParams': callbackFuncParams,
                'callbackFunc': callbackFunc,
                'node': node
            });
        }
    };
