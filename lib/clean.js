var utils = require('./utils'),
    defaultValues = require('./defaultValues'),
    defaultOptions = require('./defaultOptions'),
    traverseAndUpdateAst = require('./traverseAndUpdateAst'),
    findAndStoreAllModuleIds = require('./findAndStoreAllModuleIds'),
    createAst = require('./createAst'),
    generateCode = require('./generateCode'),
    normalizeModuleName = require('./normalizeModuleName'),
    _ = require('lodash'),
    estraverse = require('estraverse'),
    path = require('path'),
    util = require('util');

module.exports = function clean() {
    var kclean = this,
        options = kclean.options,
        ignoreModules = options.ignoreModules,
        ignoreModule = options.ignoreModule,
        originalAst = {},
        ast = {},
        generatedCode,
        declarations = [],
        hoistedVariables = {},
        hoistedCallbackParameters = {},
        defaultRange = defaultValues.defaultRange,
        defaultLOC = defaultValues.defaultLOC;

    if(ignoreModule && !_.isArray(ignoreModule)) {
        ignoreModule = [ignoreModule];
    }

    originalAst = createAst.call(kclean);

    function getModuleName(moduleName, name) {
        if(name.charAt(0) == '.') {
            var dirname = path.dirname(moduleName);
            name = path.join(dirname, name);
        }
        if(utils.endsWith(name,'/')) {
            name = path.join(name,'index');
        }
        return name;
    }

    var dependencyMap = {},
        ignore_code = [],
        ignore_ast = createAst.call({options:_.extend({},options,{code:'1'})});


    originalAst.body.forEach(function(body, index){
          var args = body.expression.arguments,
              moduleName = args[0].value,
              dependencies = [];

          estraverse.replace(_.last(args),{
            enter: function(node,parent) {
                if(parent.type == 'CallExpression' && parent.callee.name == 'require') {
                    if(node.type == 'Literal') {
                            if(node.value.indexOf('.') == 0) {
                               node.value = utils.normalizePath(moduleName, node.value);
                               if(utils.endsWith(node.value,'/')) {
                                    node.value +='index';
                               }
                            }
                    }
                }
                return node;
            },
            leave: function(node){
                return node;
            }
          });

          if(args[1].type == "ArrayExpression") {
            dependencies = args[1].elements.map(function(item){
                return getModuleName(moduleName,item.value);
            });
          }

          dependencyMap[moduleName] = {
              name : moduleName,
              dependencies :  dependencies
          }
    });


    for(var key in dependencyMap) {
        dependencyMap[key].dependencies = dependencyMap[key].dependencies.map(function(item){
            item = item.replace(/\\/g,'/');
            if(utils.endsWith(item,'/')) {
                item = item+'index';
            }
            return item;
        }).filter(function(item){
            return dependencyMap[item];
        });
    }


    var list = ignoreModule;
    if(ignoreModule) {
        ignoreModule.forEach(function(module){
            list = list.concat.apply(list,utils.getDependency(dependencyMap, module));
        });
    }

    if(list && list.length) {
        originalAst.body = originalAst.body.filter(function(body){
            var args = body.expression.arguments,
                moduleName = args[0].value;

            if(list.indexOf(moduleName)>-1) {
                ignore_ast.body = [body];
                ignore_code.push(generateCode.call(kclean, ignore_ast));
                return false;
            }
            return true;
        });
    }

    var map = utils.topologicalSort(dependencyMap);

    originalAst.body.sort(function(a,b){
        var  mod1 = a.expression.arguments[0].value,
             mod2 = b.expression.arguments[0].value;

        return map[mod1] - map[mod2];
    });
    findAndStoreAllModuleIds.call(kclean, originalAst);

    ast = traverseAndUpdateAst.call(kclean, {
        ast: originalAst
    });


    if(ast && _.isArray(ast.body)) {
        estraverse.replace(ast, {
            enter: function(node, parent) {
                var normalizedModuleName,
                    assignmentName = node && node.left && node.left.name ? node.left.name : '',
                    cb = node.right,
                    assignmentNodes = [],
                    assignments = {},
                    mappedParameters = _.filter(kclean.callbackParameterMap[assignmentName], function(currentParameter) {
                        return currentParameter && currentParameter.count > 1;
                    }),
                    mappedCbDependencyNames,
                    mappedCbParameterNames,
                    paramsToRemove = [];

                if(node === undefined || node.type === 'EmptyStatement') {
                    _.each(parent.body, function(currentNode, iterator) {
                        if(currentNode === undefined || currentNode.type === 'EmptyStatement') {
                            parent.body.splice(iterator, 1);
                        }
                    });
                } else if(utils.isRequireExpression(node)) {

                    if(node['arguments'] && node['arguments'][0] && node['arguments'][0].value) {
                        normalizedModuleName = normalizeModuleName.call(kclean, node['arguments'][0].value);

                        if(ignoreModules.indexOf(normalizedModuleName) === -1) {
                            return {
                                'type': 'Identifier',
                                'name': normalizedModuleName,
                                'range': (node.range || defaultRange),
                                'loc': (node.loc || defaultLOC)
                            };
                        } else {
                            return node;
                        }
                    } else {
                        return node;
                    }
                } else if(options.aggressiveOptimizations === true && node.type === 'AssignmentExpression' && assignmentName) {

                    mappedCbParameterNames = _.map((cb && cb.callee && cb.callee.params ? cb.callee.params : []), function(currentParam) {
                        return currentParam.name;
                    });

                    mappedCbDependencyNames = _.map(cb.arguments, function(currentArg) {
                        return currentArg.name;
                    });

                    _.each(mappedCbDependencyNames, function(currentDependencyName) {


                        _.each(kclean.callbackParameterMap[currentDependencyName], function(currentMapping) {
                            var mappedName  = currentMapping.name,
                                mappedCount = currentMapping.count;


                            _.each(mappedCbParameterNames, function(currentParameterName, iterator) {
                                if(mappedCount > 1 && mappedName === currentParameterName) {
                                    paramsToRemove.push(iterator);
                                }
                            });
                        });
                    });

                    _.each(paramsToRemove, function(currentParam) {
                        cb.arguments.splice(currentParam, currentParam + 1);
                        cb.callee.params.splice(currentParam, currentParam + 1);
                    });


                    if(kclean.callbackParameterMap[assignmentName]) {
                        node.right = (function() {


                            if(options.aggressiveOptimizations === true && mappedParameters.length) {


                                assignmentNodes = _.map(mappedParameters, function(currentDependency, iterator) {
                                    return {
                                        'type': 'AssignmentExpression',
                                        'operator': '=',
                                        'left': {
                                            'type': 'Identifier',
                                            'name': currentDependency.name,
                                            'range': defaultRange,
                                            'loc': defaultLOC
                                        },
                                        'right': (iterator < mappedParameters.length - 1) ? {
                                            'range': defaultRange,
                                            'loc': defaultLOC
                                        } : cb,
                                        'range': defaultRange,
                                        'loc': defaultLOC
                                    };
                                });


                                assignments = _.reduce(assignmentNodes, function(result, assignment) {
                                    result.right =  assignment;
                                    return result;
                                });


                                return assignmentNodes.length ? assignments : cb;
                            } else {
                                return cb;
                            }
                        }());
                        return node;
                    }
                }
            }
        });
    }

    if(_.isArray(options.globalModules)) {

        _.each(options.globalModules, function(currentModule) {

            if(_.isString(currentModule) && currentModule.length) {
                ast.body.push({
                    'type': 'ExpressionStatement',
                    'expression': {
                        'type': 'AssignmentExpression',
                        'operator': '=',
                        'left': {
                            'type': 'MemberExpression',
                            'computed': false,
                            'object': {
                                'type': 'Identifier',
                                'name': 'window',
                                'range': defaultRange,
                                'loc': defaultLOC
                            },
                            'property': {
                                'type': 'Identifier',
                                'name': currentModule,
                                'range': defaultRange,
                                'loc': defaultLOC
                            },
                            'range': defaultRange,
                            'loc': defaultLOC
                        },
                        'right': {
                            'type': 'Identifier',
                            'name': currentModule,
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
        });
    }

    hoistedCallbackParameters = (function() {
        var obj = {},
            callbackParameterMap = kclean.callbackParameterMap,
            currentParameterName;

        _.each(callbackParameterMap, function(mappedParameters) {

            _.each(mappedParameters, function(currentParameter) {
                if(currentParameter.count > 1) {
                    currentParameterName = currentParameter.name;
                    obj[currentParameterName] = true;
                }
            });
        });
        return obj;
    }());


    hoistedVariables = _.merge(_.cloneDeep(_.reduce(kclean.storedModules, function(storedModules, key, val) {
        if(key !== false) {
            storedModules[val] = true;
        }
        return storedModules;
    }, {})), hoistedCallbackParameters);


    _.each(hoistedVariables, function(moduleValue, moduleName) {
        if(!_.contains(options.ignoreModules, moduleName)) {
            declarations.push({
                'type': 'VariableDeclarator',
                'id': {
                    'type': 'Identifier',
                    'name': moduleName,
                    'range': defaultRange,
                    'loc': defaultLOC
                },
                'init': null,
                'range': defaultRange,
                'loc': defaultLOC
            });
        }
    });


    if(declarations.length) {
        declarations = declarations.filter(function(item){
            return kclean.loadedModules.indexOf(kclean.moduleMap[item.id.name]) > -1;
        });

        ast.body.unshift({
            'type': 'VariableDeclaration',
            'declarations': declarations,
            'kind': 'var',
            'range': defaultRange,
            'loc': defaultLOC
        });
    }


    generatedCode = generateCode.call(kclean, ast);


    var _code = [],dependencies = [],
        moduleMap = this.moduleMap;


    for(var k in moduleMap) {
        if(this.loadedModules.indexOf(moduleMap[k]) == -1){
            _code.push(util.format('var %s = require("%s");',k, moduleMap[k]));
            dependencies.push(moduleMap[k]);
        }
    }

    generatedCode = _code.join("\n") +"\n" + generatedCode;

    if(options.outputModule){
        for(var m in moduleMap){
            if(moduleMap[m] == options.outputModule){
                if(this.variablesStore[m]){
                    m = '_' + m +'_';
                }
                generatedCode = generatedCode + util.format('\nmodule.exports = %s;',m);
                break;
            }
        }
    }


    var lib = "kissy";
    if(this.seajs){
        lib = "seajs";
    }else if(this.modulex){
        lib = "modulex";
    }

    var wrap = options.wrap || {},
        start  = wrap.hasOwnProperty("start")?wrap.start : defaultOptions.wrap[lib].start,
        end = wrap.hasOwnProperty("end")?wrap.end : defaultOptions.wrap[lib].end;

    generatedCode = utils.substitute(start, {
                        moduleName   : options.outputModule,
                        dependencies : JSON.stringify(dependencies)
                    }) + generatedCode + end;

    if(ignore_code.length) {
        generatedCode = ignore_code.join("\n") +'\n'+generatedCode;
    }
    return generatedCode;
};

