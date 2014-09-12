var utils = require('./utils'),
    defaultValues = require('./defaultValues'),
    defaultRange = defaultValues.defaultRange,
    defaultLOC = defaultValues.defaultLOC,
    estraverse = require('estraverse');


module.exports = function convertToIIFEDeclaration(obj) {
    var moduleName = obj.moduleName,
        callbackFuncParams = obj.callbackFuncParams,
        isOptimized = obj.isOptimized,
        callback = obj.callbackFunc,
        node = obj.node,
        name = callback.name,
        type = callback.type,
        range = (node.range || defaultValues.defaultRange),
        loc = (node.loc || defaultValues.defaultLOC),
        callbackFunc = (function() {
            var cbFunc = obj.callbackFunc;

            if(type === 'Identifier' && name !== 'undefined') {
                cbFunc = {
                    'type': 'FunctionExpression',
                    'id': null,
                    'params': [],
                    'defaults': [],
                    'body': {
                        'type': 'BlockStatement',
                        'body': [{
                            'type': 'ReturnStatement',
                            'argument': {
                                'type': 'ConditionalExpression',
                                'test': {
                                    'type': 'BinaryExpression',
                                    'operator': '===',
                                    'left': {
                                        'type': 'UnaryExpression',
                                        'operator': 'typeof',
                                        'argument': {
                                            'type': 'Identifier',
                                            'name': name,
                                            'range': range,
                                            'loc': loc
                                        },
                                        'prefix': true,
                                        'range': range,
                                        'loc': loc
                                    },
                                    'right': {
                                        'type': 'Literal',
                                        'value': 'function',
                                        'raw': "'function'",
                                        'range': range,
                                        'loc': loc
                                    },
                                    'range': range,
                                    'loc': loc
                                },
                                'consequent': {
                                    'type': 'CallExpression',
                                    'callee': {
                                        'type': 'Identifier',
                                        'name': name,
                                        'range': range,
                                        'loc': loc
                                    },
                                    'arguments': callbackFuncParams,
                                    'range': range,
                                    'loc': loc
                                },
                                'alternate': {
                                    'type': 'Identifier',
                                    'name': name,
                                    'range': range,
                                    'loc': loc
                                },
                                'range': range,
                                'loc': loc
                            },
                            'range': range,
                            'loc': loc
                        }],
                        'range': range,
                        'loc': loc
                    },
                    'rest': null,
                    'generator': false,
                    'expression': false,
                    'range': range,
                    'loc': loc
                };
            }
            return cbFunc;
        }()),
        dependencyNames = obj.dependencyNames,
        cb = (function() {
            if(callbackFunc.type === 'Literal' || (callbackFunc.type === 'Identifier' && callbackFunc.name === 'undefined') || isOptimized === true) {
                return callbackFunc;
            } else {
                var hasExports = false;
                estraverse.traverse(callbackFunc, {
                    enter: function(node, parent) {
                        if(node.type == "MemberExpression" && node.object && node.object.name == "exports") {
                            if(node.property) {
                                if(node.property) {
                                    hasExports = true;
                                }
                            }
                        }
                    }
                });

                if(hasExports) {
                    callbackFunc.body && callbackFunc.body.body && callbackFunc.body.body.unshift({
                        'type': 'ExpressionStatement',
                        'expression': {
                            'type': 'AssignmentExpression',
                            'operator': '=',
                            'left': {
                                'type': 'Identifier',
                                'name': "exports",
                                'range': defaultRange,
                                'loc': defaultLOC
                            },
                            'right': {
                                'type': 'Identifier',
                                'name': "{}",
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
                return {
                    'type': 'CallExpression',
                    'callee': {
                        'type': 'FunctionExpression',
                        'id': {
                            'type': 'Identifier',
                            'name': '',
                            'range': range,
                            'loc': loc
                        },
                        'params': callbackFuncParams,
                        'defaults': [],
                        'body': callbackFunc.body,
                        'rest': callbackFunc.rest,
                        'generator': callbackFunc.generator,
                        'expression': callbackFunc.expression,
                        'range': range,
                        'loc': loc
                    },
                    'arguments': dependencyNames,
                    'range': range,
                    'loc': loc
                };
            }
        }()),
        updatedNode = {
            'type': 'ExpressionStatement',
            'expression': {
                'type': 'AssignmentExpression',
                'operator': '=',
                'left': {
                    'type': 'Identifier',
                    'name': moduleName,
                    'range': range,
                    'loc': loc
                },
                'right': cb,
                'range': range,
                'loc': loc
            },
            'range': range,
            'loc': loc
        };

    estraverse.replace(callbackFunc, {
      'enter': function (node) {
          if (utils.isModuleExports(node)) {
              return {
                  'type': 'AssignmentExpression',
                  'operator': '=',
                  'left': {
                      'type': 'Identifier',
                      'name': 'exports'
                  },
                  'right': node.right
              };
          } else {
              return node;
          }
      }
    });

    return updatedNode;
};
