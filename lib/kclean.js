var moduleMap = {},
    util = require("util"),
    path = require("path"),
    UglifyJS = require("uglify-js"),
    loadedModules = [];

function minify(code) {
    return UglifyJS.minify('(function(){' + code + '})();',{fromString: true}).code
                .replace(/!function\(\)\{/,"")
                .replace(/\}\(\)\;$/,";");
}

; (function() {
	var esprima,
	estraverse,
	escodegen,
	_;
	var errorMsgs,
	defaultValues,
	utils,
	convertToIIFE,
	convertToIIFEDeclaration,
	normalizeModuleName,
	convertToFunctionExpression,
	convertToObjectDeclaration,
	createAst,
	convertDefinesAndRequires,
	traverseAndUpdateAst,
	getNormalizedModuleName,
	findAndStoreAllModuleIds,
	generateCode,
	clean,
	_defaultOptions_;

	_defaultOptions_ = {
		'code': '',
		'filePath': '',
		'globalModules': [],
		'esprima': {
			'comment': true,
			'loc': true,
			'range': true,
			'tokens': true
		},
		'escodegen': {
			'comment': true,
			'format': {
				'indent': {
					'style': '  ',
					'adjustMultilineComment': true
				}
			}
		},
		'commentCleanName': 'kclean',
		'ignoreModules': [],
		'removeModules': [],
		'removeAllRequires': false,
		'removeUseStricts': true,
		'transformAMDChecks': true,
		'createAnonymousAMDModule': false,
		'shimOverrides': {},
		'prefixMode': 'standard',
		'prefixTransform': function(moduleName) {
			return moduleName;
		},
		'wrap': {
			'start': ';(function() {\n',
			'end': '\n}());'
		},
		'aggressiveOptimizations': false
	};
	errorMsgs = {
		'emptyCode': 'There is no code to generate the AST with',
		'emptyAst': function(methodName) {
			return 'An AST is not being passed to the ' + methodName + '() method';
		},
		'invalidObject': function(methodName) {
			return 'An object is not being passed as the first parameter to the ' + methodName + '() method';
		},
		'lodash': 'Make sure you have included lodash (https://github.com/lodash/lodash).',
		'esprima': 'Make sure you have included esprima (https://github.com/ariya/esprima).',
		'estraverse': 'Make sure you have included estraverse (https://github.com/Constellation/estraverse).',
		'escodegen': 'Make sure you have included escodegen (https://github.com/Constellation/escodegen).'
	};
	defaultValues = {
		'dependencyBlacklist': {
			'require': 'remove',
			'exports': true,
			'module': 'remove',
			'S': 'remove',
			'KISSY': 'remove'
		},
		'defaultLOC': {
			'start': {
				'line': 0,
				'column': 0
			}
		},
		'defaultRange': [0, 0]
	};
	utils = function() {
		var Utils = {
			'isDefine': function(node) {
			    //is KISSY.add
				var expression = node.expression || {},
				callee = expression.callee;

                var flag = _.isObject(node) && node.type === 'ExpressionStatement'
                				       && expression && expression.type === 'CallExpression'
                				       && callee.type === 'MemberExpression'
                				       && callee.object
                				       && (callee.object.name === 'KISSY'||callee.object.name === 'S')
                				       && callee.property
                				       && callee.property.name === 'add';
				return flag;
			},
			'isRequire': function(node) {
				var expression = node.expression || {},
				callee = expression.callee;

				return node && node.type === 'ExpressionStatement'
				       && expression && expression.type === 'CallExpression'
				       && expression.arguments.length ===1
				       && callee.type === 'Identifier' && callee.name === 'require';
			},
			'isModuleExports': function(node) {
				if (!node) {
					return false;
				}
				return node.type === 'AssignmentExpression' && node.left
				       && node.left.type === 'MemberExpression'
				       && node.left.object && node.left.object.type === 'Identifier'
				       && node.left.object.name === 'module' && node.left.property
				       && node.left.property.type === 'Identifier'
				       && node.left.property.name === 'exports';
			},
			'isRequireExpression': function(node) {
				return node && node.type === 'CallExpression'
				       && node.arguments.length === 1
				       && node.callee && node.callee.name === 'require';
			},
			'isObjectExpression': function(expression) {
				return expression && expression && expression.type === 'ObjectExpression';
			},
			'isFunctionExpression': function(expression) {
				return expression && expression && expression.type === 'FunctionExpression';
			},
			'isFunctionCallExpression': function(expression) {
				return expression && expression && expression.type === 'CallExpression'
				       && expression.callee && expression.callee.type === 'FunctionExpression';
			},
			'isUseStrict': function(expression) {
				return expression && expression && expression.value === 'use strict'
				       && expression.type === 'Literal';
			},
			'isAMDConditional': function(node) {
				if (node && node.type !== 'IfStatement' || !node.test || !node.test.left) {
					return false;
				}
				var matchObject = {
					'left': {
						'operator': 'typeof',
						'argument': {
							'type': 'Identifier',
							'name': 'define'
						}
					},
					'right': {
						'type': 'Literal',
						'value': 'function'
					}
				};
				var reversedMatchObject = {
					'left': matchObject.right,
					'right': matchObject.left
				};
				try {
					return _.where(node.test, matchObject).length || _.where([node.test], matchObject).length || _.where(node.test.left, matchObject).length || _.where([node.test.left], matchObject).length || _.where(node.test, reversedMatchObject).length || _.where([node.test], reversedMatchObject).length || _.where(node.test.left, reversedMatchObject).length || _.where([node.test.left], reversedMatchObject).length;
				} catch(e) {
					return false;
				}
			},
			'returnExpressionIdentifier': function(name) {
				return {
					'type': 'ExpressionStatement',
					'expression': {
						'type': 'Identifier',
						'name': name,
						'range': defaultValues.defaultRange,
						'loc': defaultValues.defaultLOC
					},
					'range': defaultValues.defaultRange,
					'loc': defaultValues.defaultLOC
				};
			},
			'readFile': function(path) {
				if (typeof exports !== 'undefined') {
					var fs = require('fs');
					return fs.readFileSync(path, 'utf8');
				} else {
					return '';
				}
			},
			'isRelativeFilePath': function(path) {
				var segments = path.split('/');
				return segments.length !== -1 && (segments[0] === '.' || segments[0] === '..');
			},
			convertToCamelCase: function(input, delimiter) {
				delimiter = delimiter || '_';
				return input.replace(new RegExp(delimiter + '(.)', 'g'),
				function(match, group1) {
					return group1.toUpperCase();
				});
			},
			'prefixReservedWords': function(name) {
				var reservedWord = false;
				try {
					if (name.length) {
						eval('var ' + name + ' = 1;');
					}
				} catch(e) {
					reservedWord = true;
				}
				if (reservedWord === true) {
					return '_' + name;
				} else {
					return name;
				}
			},
			'normalizeDependencyName': function(moduleId, dep) {
				if (!moduleId || !dep || !Utils.isRelativeFilePath(dep)) {
					return dep;
				}
				var normalizePath = function(path) {
					var segments = path.split('/'),
					normalizedSegments;
					normalizedSegments = _.reduce(segments,
					function(memo, segment) {
						switch (segment) {
						case '.':
							break;
						case '..':
							memo.pop();
							break;
						default:
							memo.push(segment);
						}
						return memo;
					},
					[]);
					return normalizedSegments.join('/');
				},
				baseName = function(path) {
					var segments = path.split('/');
					segments.pop();
					return segments.join('/');
				};
				return normalizePath([baseName(moduleId), dep].join('/'));
			}
		};
		return Utils;
	} ();
	convertToIIFE = function convertToIIFE(obj) {
		var callbackFuncParams = obj.callbackFuncParams,
		callbackFunc = obj.callbackFunc,
		dependencyNames = obj.dependencyNames,
		node = obj.node,
		range = node.range || defaultValues.defaultRange,
		loc = node.loc || defaultValues.defaultLOC;
		return {
			'type': 'ExpressionStatement',
			'expression': {
				'type': 'CallExpression',
				'callee': {
					'type': 'FunctionExpression',
					'id': null,
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
			},
			'range': range,
			'loc': loc
		};
	};
	convertToIIFEDeclaration = function convertToIIFEDeclaration(obj) {
		var moduleName = obj.moduleName,
		callbackFuncParams = obj.callbackFuncParams,
		isOptimized = obj.isOptimized,
		callback = obj.callbackFunc,
		node = obj.node,
		name = callback.name,
		type = callback.type,
		range = node.range || defaultValues.defaultRange,
		loc = node.loc || defaultValues.defaultLOC,
		callbackFunc = function() {
			var cbFunc = obj.callbackFunc;
			if (type === 'Identifier' && name !== 'undefined') {
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
										'raw': '\'function\'',
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
		} (),
		dependencyNames = obj.dependencyNames,
		cb = function() {
			if (callbackFunc.type === 'Literal' || callbackFunc.type === 'Identifier' && callbackFunc.name === 'undefined' || isOptimized === true) {
				return callbackFunc;
			} else {
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
		} (),
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
			'enter': function(node) {
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
	normalizeModuleName = function normalizeModuleName(name, moduleId) {
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

		if(!moduleMap[postNormalized]) {
		    moduleMap[postNormalized] = name;
		}
		return postNormalized;
	};
	convertToFunctionExpression = function convertToFunctionExpression(obj) {
		var kclean = this,
		options = kclean.options,
		ignoreModules = options.ignoreModules,
		node = obj.node,
		isDefine = obj.isDefine,
		isRequire = obj.isRequire,
		isOptimized = false,
		moduleName = obj.moduleName,
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
		callbackFunc = function() {
			var callbackFunc = obj.moduleReturnValue,
			body,
			returnStatements,
			firstReturnStatement,
			returnStatementArg;

			if (callbackFunc && callbackFunc.type === 'FunctionExpression' && callbackFunc.body && _.isArray(callbackFunc.body.body) && callbackFunc.body.body.length) {
				body = _.filter(callbackFunc.body.body, function(node) {
					if (options.removeUseStricts === true) {
						return ! utils.isUseStrict(node.expression);
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
				if (returnStatements.length) {
					firstReturnStatement = returnStatements[0];
					returnStatementArg = firstReturnStatement.argument;
					hasNonMatchingParameter = function() {
						var nonMatchingParameter = false;
						_.each(callbackFunc.params,
						function(currentParam) {
							var currentParamName = currentParam.name;
							if (!kclean.storedModules[currentParamName] && !dependencyBlacklist[currentParamName]) {
								nonMatchingParameter = true;
							}
						});
						return nonMatchingParameter;
					} ();
					if (hasNonMatchingParameter || !shouldOptimize || !utils.isFunctionExpression(firstReturnStatement) && body.length > 1 || returnStatementArg && returnStatementArg.type === 'Identifier') {
						return callbackFunc;
					} else {
						callbackFunc = returnStatementArg;
						isOptimized = true;
						if (callbackFunc.params) {
							depLength = callbackFunc.params.length;
						}
					}
				}
			} else if (callbackFunc && callbackFunc.type === 'FunctionExpression' && callbackFunc.body && _.isArray(callbackFunc.body.body) && callbackFunc.body.body.length === 0) {
				callbackFunc = {
					'type': 'Identifier',
					'name': 'undefined',
					'range': range,
					'loc': loc
				};
				depLength = 0;
			}
			return callbackFunc;
		} (),

		hasReturnStatement = function() {
			var returns = [];
			if (callbackFunc && callbackFunc.body && _.isArray(callbackFunc.body.body)) {
				returns = _.where(callbackFunc.body.body, {
					'type': 'ReturnStatement'
				});
				if (returns.length) {
					return true;
				}
			}
			return false;
		} (),
		originalCallbackFuncParams,
		hasExportsParam = function() {
			var cbParams = callbackFunc.params || [];
			return _.where(cbParams, {
				'name': 'exports'
			}).length;
		} (),
		normalizeDependencyNames = {},
		dependencyNames = function() {
			var deps = [],
			currentName;
			_.each(dependencies,
			function(currentDependency) {
				currentName = normalizeModuleName.call(kclean, utils.normalizeDependencyName(moduleId, currentDependency), moduleId);
				normalizeDependencyNames[currentName] = true;
				deps.push({
					'type': 'Identifier',
					'name': currentName,
					'range': defaultRange,
					'loc': defaultLOC
				});
			});
			return deps;
		} (),

		findNewParamName = function findNewParamName(name) {
			name = '_' + name + '_';
			var containsLocalVariable = function() {
				var containsVariable = false;
				if (normalizeDependencyNames[name]) {
					containsVariable = true;
				} else {
					estraverse.traverse(callbackFunc, {
						'enter': function(node) {
							if (node.type === 'VariableDeclarator' && node.id && node.id.type === 'Identifier' && node.id.name === name) {
								containsVariable = true;
							}
						}
					});
				}
				return containsVariable;
			} ();
			if (!containsLocalVariable) {
				return name;
			} else {
				return findNewParamName(name);
			}
		},
		matchingRequireExpressionNames = function() {
			var matchingNames = [];
			if (hasExportsParam) {
				estraverse.traverse(callbackFunc, {
					'enter': function(node) {
						var variableName,
						expressionName;
						if (node.type === 'VariableDeclarator' && utils.isRequireExpression(node.init)) {
							if (node.id && node.id.name && node.init && node.init['arguments'] && node.init['arguments'][0] && node.init['arguments'][0].value) {
								variableName = node.id.name;
								expressionName = normalizeModuleName.call(kclean, utils.normalizeDependencyName(moduleId, node.init['arguments'][0].value, moduleId));

								if (!_.contains(ignoreModules, expressionName) && variableName === expressionName) {
									matchingNames.push({
										'originalName': expressionName,
										'newName': findNewParamName(expressionName),
										'range': node.range || defaultRange,
										'loc': node.loc || defaultLOC
									});
								}
							}
						}
					}
				});
			}
			return matchingNames;
		} (),
		matchingRequireExpressionParams = function() {
			var params = [];
			_.each(matchingRequireExpressionNames,function(currentParam) {
				params.push({
					'type': 'Identifier',
					'name': currentParam.newName ? currentParam.newName: currentParam,
					'range': currentParam.range,
					'loc': currentParam.loc
				});
			});
			return params;
		} (),
		callbackFuncParams = function() {
			var deps = [],
			currentName,
			cbParams = _.union(callbackFunc.params && callbackFunc.params.length ? callbackFunc.params: !shouldOptimize && dependencyNames && dependencyNames.length ? dependencyNames: [], matchingRequireExpressionParams),
			mappedParameter = {};
			_.each(cbParams, function(currentParam, iterator) {
				if (currentParam) {
					currentName = currentParam.name;
				} else {
					currentName = dependencyNames[iterator].name;
				}

				if (!shouldOptimize && currentName !== '{}') {
					deps.push({
						'type': 'Identifier',
						'name': currentName,
						'range': defaultRange,
						'loc': defaultLOC
					});
				} else if (currentName !== '{}' && (!hasExportsParam || defaultValues.dependencyBlacklist[currentName] !== 'remove')) {

					deps.push({
						'type': 'Identifier',
						'name': currentName,
						'range': defaultRange,
						'loc': defaultLOC
					});
					if (!isOptimized && aggressiveOptimizations === true && !kclean.storedModules[currentName] && dependencyNames[iterator]) {
						if (!kclean.callbackParameterMap[dependencyNames[iterator].name]) {
							kclean.callbackParameterMap[dependencyNames[iterator].name] = [{
								'name': currentName,
								'count': 1
							}];
						} else {
							mappedParameter = _.where(kclean.callbackParameterMap[dependencyNames[iterator].name], {
								'name': currentName
							});
							if (mappedParameter.length) {
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
		} (),
		isCommonJS = !hasReturnStatement && hasExportsParam,
		hasExportsAssignment = exportsExpressions.length || moduleExportsExpressions.length,
		dependencyNameLength,
		callbackFuncParamsLength;


//		dependencyNames = _.filter(dependencyNames || [], function(currentDep, iterator) {
//			var mappedCallbackParameter = originalCallbackFuncParams[iterator],
//			currentDepName = currentDep.name;
//			return aggressiveOptimizations === true && shouldOptimize ? !mappedCallbackParameter || kclean.storedModules[mappedCallbackParameter.name] && mappedCallbackParameter.name === currentDepName ? !kclean.storedModules[currentDepName] : !kclean.storedModules[mappedCallbackParameter.name] : true;
//		});
//		dependencyNames = _.map(dependencyNames || [],function(currentDep, iterator) {
//			if (dependencyBlacklist[currentDep.name]) {
//				currentDep.name = '{}';
//			}
//			return currentDep;
//		});
		dependencyNames = [];
		dependencyNameLength = dependencyNames.length;
		callbackFuncParamsLength = callbackFuncParams.length;
		if (dependencyNameLength > callbackFuncParamsLength) {
			dependencyNames.splice(callbackFuncParamsLength, dependencyNameLength - callbackFuncParamsLength);
		}
		if (isCommonJS && hasExportsAssignment) {
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
			'enter': function(node) {
				var normalizedModuleName,
				newName;
				if (utils.isRequireExpression(node)) {
					if (node['arguments'] && node['arguments'][0] && node['arguments'][0].value) {

						normalizedModuleName = normalizeModuleName.call(kclean, utils.normalizeDependencyName(moduleId, node['arguments'][0].value, moduleId));

						if (_.contains(ignoreModules, normalizedModuleName)) {
							return node;
						}

						if (_.where(matchingRequireExpressionNames, {
							'originalName': normalizedModuleName
						}).length) {
							newName = _.where(matchingRequireExpressionNames, {
								'originalName': normalizedModuleName
							})[0].newName;
						}

						return {
							'type': 'Identifier',
							'name': newName ? newName: normalizedModuleName,
							'range': node.range || defaultRange,
							'loc': node.loc || defaultLOC
						};
					} else {
						return node;
					}
				}
			}
		});

		if (isDefine) {
			return convertToIIFEDeclaration.call(kclean, {
				'moduleName': moduleName,
				'dependencyNames': dependencyNames,
				'callbackFuncParams': callbackFuncParams,
				'hasExportsParam': hasExportsParam,
				'callbackFunc': callbackFunc,
				'isOptimized': isOptimized,
				'node': node
			});
		} else if (isRequire) {
			return convertToIIFE.call(kclean, {
				'dependencyNames': dependencyNames,
				'callbackFuncParams': callbackFuncParams,
				'callbackFunc': callbackFunc,
				'node': node
			});
		}
	};
	convertToObjectDeclaration = function(obj, type) {
		var node = obj.node,
		defaultRange = defaultValues.defaultRange,
		defaultLOC = defaultValues.defaultLOC,
		range = node.range || defaultRange,
		loc = node.loc || defaultLOC,
		moduleName = obj.moduleName,
		moduleReturnValue = function() {
			var modReturnValue,
			callee,
			params,
			returnStatement,
			nestedReturnStatement,
			internalFunctionExpression;

			if (type === 'functionCallExpression') {
				modReturnValue = obj.moduleReturnValue;
				callee = modReturnValue.callee;
				params = callee.params;
				if (params && params.length && _.isArray(params) && _.where(params, {
					'name': 'global'
				})) {
					if (_.isObject(callee.body) && _.isArray(callee.body.body)) {
						returnStatement = _.where(callee.body.body, {
							'type': 'ReturnStatement'
						})[0];
						if (_.isObject(returnStatement) && _.isObject(returnStatement.argument) && returnStatement.argument.type === 'FunctionExpression') {
							internalFunctionExpression = returnStatement.argument;
							if (_.isObject(internalFunctionExpression.body) && _.isArray(internalFunctionExpression.body.body)) {
								nestedReturnStatement = _.where(internalFunctionExpression.body.body, {
									'type': 'ReturnStatement'
								})[0];
								if (_.isObject(nestedReturnStatement.argument) && _.isObject(nestedReturnStatement.argument.right) && _.isObject(nestedReturnStatement.argument.right.property)) {
									if (nestedReturnStatement.argument.right.property.name) {
										modReturnValue = {
											'type': 'MemberExpression',
											'computed': false,
											'object': {
												'type': 'Identifier',
												'name': 'window',
												'range': range,
												'loc': loc
											},
											'property': {
												'type': 'Identifier',
												'name': nestedReturnStatement.argument.right.property.name,
												'range': range,
												'loc': loc
											},
											'range': range,
											'loc': loc
										};
									}
								}
							}
						}
					}
				}
			}
			modReturnValue = modReturnValue || obj.moduleReturnValue;
			return modReturnValue;
		} (),
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
				'right': moduleReturnValue,
				'range': range,
				'loc': loc
			},
			'range': range,
			'loc': loc
		};
		return updatedNode;
	};
	createAst = function createAst(providedCode) {
		var kclean = this,
		options = kclean.options,
		filePath = options.filePath,
		code = providedCode || options.code || (filePath ? utils.readFile(filePath) : ''),
		esprimaOptions = options.esprima;
		if (!code) {
			throw new Error(errorMsgs.emptyCode);
		} else {
			if (!_.isPlainObject(esprima) || !_.isFunction(esprima.parse)) {
				throw new Error(errorMsgs.esprima);
			}
			return esprima.parse(code, esprimaOptions);
		}
	};
	convertDefinesAndRequires = function convertDefinesAndRequires(node, parent) {
		var kclean = this,
		options = kclean.options,
		moduleName,
		args,
		dependencies,
		moduleReturnValue,
		moduleId,
		params,
		isDefine = utils.isDefine(node),
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
		startLineNumber = isDefine || isRequire ? node.expression.loc.start.line: node && node.loc && node.loc.start ? node.loc.start.line: null;
		shouldBeIgnored = kclean.matchingCommentLineNumbers[startLineNumber] || kclean.matchingCommentLineNumbers[startLineNumber - 1];
		if (utils.isAMDConditional(node)) {
			estraverse.traverse(node, {
				'enter': function(node) {
					var normalizedModuleName;
					if (utils.isDefine(node)) {
						if (node.expression && node.expression.arguments && node.expression.arguments.length) {
							if (node.expression.arguments[0].type === 'Literal' && node.expression.arguments[0].value) {
								normalizedModuleName = normalizeModuleName.call(kclean, node.expression.arguments[0].value);
								if (options.transformAMDChecks !== true) {
									kclean.conditionalModulesToIgnore[normalizedModuleName] = true;
								} else {
									kclean.conditionalModulesToNotOptimize[normalizedModuleName] = true;
								}
								if (options.createAnonymousAMDModule === true) {
									kclean.storedModules[normalizedModuleName] = false;
									node.expression.arguments.shift();
								}
							}
						}
					}
				}
			});
			if (!shouldBeIgnored && options.transformAMDChecks === true) {
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
		if (isDefine || isRequire) {
			args = Array.prototype.slice.call(node.expression['arguments'], 0);
			moduleReturnValue = isRequire ? args[1] : args[args.length - 1];
			moduleId = node.expression['arguments'][0].value;
			moduleName = normalizeModuleName.call(kclean, moduleId);
			shouldOptimize = !kclean.conditionalModulesToNotOptimize[moduleName];

			dependencies = function() {
				var deps = isRequire ? args[0] : args[args.length - 2],
				depNames = [],
				hasExportsParam;
				if (_.isPlainObject(deps)) {
					deps = deps.elements || [];
				} else {
					deps = [];
				}
				hasExportsParam = _.where(deps, {
					'value': 'exports'
				}).length;
				if (_.isArray(deps) && deps.length) {
					_.each(deps, function(currentDependency) {
						if (dependencyBlacklist[currentDependency.value] && !shouldOptimize) {
							depNames.push(currentDependency.value);
						} else if (dependencyBlacklist[currentDependency.value] !== 'remove') {
							if (dependencyBlacklist[currentDependency.value]) {
								depNames.push('{}');
							} else {
								depNames.push(currentDependency.value);
							}
						} else {
							if (!hasExportsParam) {
								depNames.push('{}');
							}
						}
					});
				}
				return depNames;
			} ();

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
			if (isDefine) {

				if (shouldBeIgnored || !moduleName || kclean.conditionalModulesToIgnore[moduleName] === true) {
					kclean.options.ignoreModules.push(moduleName);
					return node;
				}

				if (_.contains(options.removeModules, moduleName)) {
					kclean.storedModules[moduleName] = false;
					return {
						'type': 'EmptyStatement'
					};
				}

				if (_.isObject(options.shimOverrides) && options.shimOverrides[moduleName]) {
					params.moduleReturnValue = createAst.call(kclean, options.shimOverrides[moduleName]);
					if (_.isArray(params.moduleReturnValue.body) && _.isObject(params.moduleReturnValue.body[0])) {
						if (_.isObject(params.moduleReturnValue.body[0].expression)) {
							params.moduleReturnValue = params.moduleReturnValue.body[0].expression;
							type = 'objectExpression';
						}
					} else {
						params.moduleReturnValue = moduleReturnValue;
					}
				}
				if (params.moduleReturnValue && params.moduleReturnValue.type === 'Identifier') {
					type = 'functionExpression';
				}

				if (_.contains(options.ignoreModules, moduleName)) {
					return node;
				} else if (utils.isFunctionExpression(moduleReturnValue) || type === 'functionExpression') {
					return convertToFunctionExpression.call(kclean, params);
				} else if (utils.isObjectExpression(moduleReturnValue) || type === 'objectExpression') {
					return convertToObjectDeclaration.call(kclean, params);
				} else if (utils.isFunctionCallExpression(moduleReturnValue)) {
					return convertToObjectDeclaration.call(kclean, params, 'functionCallExpression');
				}
			} else if (isRequire) {
				if (shouldBeIgnored) {
					return node;
				}
				callbackFuncArg = _.isArray(node.expression['arguments']) && node.expression['arguments'].length ? node.expression['arguments'][1] && node.expression['arguments'][1].body && node.expression['arguments'][1].body.body && node.expression['arguments'][1].body.body.length: false;
				if (options.removeAllRequires !== true && callbackFuncArg) {
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
			if (node.type === 'FunctionExpression' && _.isArray(node.params) && _.where(node.params, {
				'type': 'Identifier',
				'name': 'exports'
			}).length && _.isObject(node.body) && _.isArray(node.body.body) && !_.where(node.body.body, {
				'type': 'ReturnStatement'
			}).length) {
				parentHasFunctionExpressionArgument = function() {
					if (!parent || !parent.arguments) {
						return false;
					}
					if (parent && parent.arguments && parent.arguments.length) {
						return _.where(parent.arguments, {
							'type': 'FunctionExpression'
						}).length;
					}
					return false;
				} ();
				if (parentHasFunctionExpressionArgument) {
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
	traverseAndUpdateAst = function traverseAndUpdateAst(obj) {
		var kclean = this,
		options = kclean.options,
		ast = obj.ast;
		if (!_.isPlainObject(obj)) {
			throw new Error(errorMsgs.invalidObject('traverseAndUpdateAst'));
		}
		if (!ast) {
			throw new Error(errorMsgs.emptyAst('traverseAndUpdateAst'));
		}
		if (!_.isPlainObject(estraverse) || !_.isFunction(estraverse.replace)) {
			throw new Error(errorMsgs.estraverse);
		}
		estraverse.replace(ast, {
			'enter': function(node, parent) {
				var ignoreComments;
				if (node.type === 'Program') {
					ignoreComments = function() {
						var arr = [],
						currentLineNumber;
						kclean.comments = node.comments;
						_.each(node.comments, function(currentComment) {
							var currentCommentValue = currentComment.value.trim();
							if (currentCommentValue === options.commentCleanName) {
								arr.push(currentComment);
							}
						});
						return arr;
					} ();

					_.each(ignoreComments, function(currentComment) {
						currentLineNumber = currentComment.loc.start.line;
						kclean.matchingCommentLineNumbers[currentLineNumber] = true;
					});
					return node;
				}
				return convertDefinesAndRequires.call(kclean, node, parent);
			},
			'leave': function(node) {
				return node;
			}
		});
		return ast;
	};
	getNormalizedModuleName = function getNormalizedModuleName(node) {
		if (!utils.isDefine(node)) {
			return;
		}
		var kclean = this,
		moduleId = node.expression['arguments'][0].value,
		moduleName = normalizeModuleName.call(kclean, moduleId);
		loadedModules.push(moduleId);
		return moduleName;
	};
	findAndStoreAllModuleIds = function findAndStoreAllModuleIds(ast) {
		var kclean = this;
		if (!ast) {
			throw new Error(errorMsgs.emptyAst('findAndStoreAllModuleIds'));
		}
		if (!_.isPlainObject(estraverse) || !_.isFunction(estraverse.traverse)) {
			throw new Error(errorMsgs.estraverse);
		}
		estraverse.traverse(ast, {
			'enter': function(node, parent) {
				var moduleName = getNormalizedModuleName.call(kclean, node, parent);
				if (moduleName && !kclean.storedModules[moduleName]) {
					kclean.storedModules[moduleName] = true;
				}
				if (node.type === 'ReturnStatement' && node.argument && node.argument.callee && node.argument.callee.name === 'define') {
					node.type = 'ExpressionStatement';
					node.expression = node.argument;
					delete node.argument;
				}
				if (node.type === 'VariableDeclarator') {
					kclean.variablesStore[node.id.name] = true;
				}
			}
		});
	};
	generateCode = function generateCode(ast) {
		var kclean = this,
		options = kclean.options,
		esprimaOptions = options.esprima || {},
		escodegenOptions = options.escodegen || {};
		if (!_.isPlainObject(escodegen) || !_.isFunction(escodegen.generate)) {
			throw new Error(errorMsgs.escodegen);
		}
		if (esprimaOptions.comment === true && escodegenOptions.comment === true) {
			try {
				ast = escodegen.attachComments(ast, ast.comments, ast.tokens);
			} catch(e) {}
		}
		return escodegen.generate(ast, escodegenOptions);
	};

	clean = function clean() {
		var kclean = this,
		options = kclean.options,
		ignoreModules = options.ignoreModules,
		originalAst = {},
		ast = {},
		generatedCode,
		declarations = [],
		hoistedVariables = {},
		hoistedCallbackParameters = {},
		defaultRange = defaultValues.defaultRange,
		defaultLOC = defaultValues.defaultLOC;
		originalAst = createAst.call(kclean);

        function getModuleName(moduleName, name) {
            if(name.charAt(0) == '.') {
                var dirname = path.dirname(moduleName);
                return path.join(dirname, name);
            }
            return name;
        }

        var dependencyMap = {};

        originalAst.body.forEach(function(body){
              var args = body.expression.arguments,
                  moduleName = args[0].value,
                  dependencies = [];
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
            dependencyMap[key].dependencies = dependencyMap[key].dependencies.filter(function(item){
                return dependencyMap[item];
            });
        }

        function topologicalSort( bundles ) {
            var map = {};
            function isEmpty( obj ) {
                if ( !obj ) return true;
                for ( var i in obj ) {
                    return false;
                }
                return true;
            }

            function clearDep( bundle, name ) {
                var deps = [];

                for ( var i in bundle.dependencies ) {
                    if ( bundle.dependencies[i] !== name ) {
                        deps.push( bundle.dependencies[i] );
                    }
                }
                bundle.dependencies = deps;
            }

            var index = 0;
            while( !isEmpty( bundles ) ) {
                for ( var i in bundles ) {
                    var b = bundles[ i ];
                    if ( b.dependencies.length === 0 ) {
                        map[b.name] = index++;
                        delete bundles[ i ];
                        // 清除所有该某块的依赖
                        for ( var j in bundles ) {
                            clearDep( bundles[j], b.name );
                        }
                    }
                }
            }
            return map;
        }

        var map = topologicalSort(dependencyMap);

        originalAst.body.sort(function(a,b){
            var  mod1 = a.expression.arguments[0].value,
                 mod2 = b.expression.arguments[0].value;

            return map[mod1] - map[mod2];
        });


		findAndStoreAllModuleIds.call(kclean, originalAst);

		ast = traverseAndUpdateAst.call(kclean, {
			ast: originalAst
		});

		if (ast && _.isArray(ast.body)) {
			estraverse.replace(ast, {
				enter: function(node, parent) {
					var normalizedModuleName,
					assignmentName = node && node.left && node.left.name ? node.left.name: '',
					cb = node.right,
					assignmentNodes = [],
					assignments = {},
					mappedParameters = _.filter(kclean.callbackParameterMap[assignmentName],
					function(currentParameter) {
						return currentParameter && currentParameter.count > 1;
					}),
					mappedCbDependencyNames,
					mappedCbParameterNames,
					paramsToRemove = [];
					if (node === undefined || node.type === 'EmptyStatement') {
						_.each(parent.body,
						function(currentNode, iterator) {
							if (currentNode === undefined || currentNode.type === 'EmptyStatement') {
								parent.body.splice(iterator, 1);
							}
						});
					} else if (utils.isRequireExpression(node)) {
						if (node['arguments'] && node['arguments'][0] && node['arguments'][0].value) {
							normalizedModuleName = normalizeModuleName.call(kclean, node['arguments'][0].value);

							if (ignoreModules.indexOf(normalizedModuleName) === -1) {
								return {
									'type': 'Identifier',
									'name': normalizedModuleName,
									'range': node.range || defaultRange,
									'loc': node.loc || defaultLOC
								};
							} else {
								return node;
							}
						} else {
							return node;
						}
					} else if (options.aggressiveOptimizations === true && node.type === 'AssignmentExpression' && assignmentName) {
						mappedCbParameterNames = _.map(cb && cb.callee && cb.callee.params ? cb.callee.params: [],
						function(currentParam) {
							return currentParam.name;
						});
						mappedCbDependencyNames = _.map(cb.arguments,
						function(currentArg) {
							return currentArg.name;
						});
						_.each(mappedCbDependencyNames,
						function(currentDependencyName) {
							_.each(kclean.callbackParameterMap[currentDependencyName], function(currentMapping) {
								var mappedName = currentMapping.name,
								mappedCount = currentMapping.count;
								_.each(mappedCbParameterNames,
								function(currentParameterName, iterator) {
									if (mappedCount > 1 && mappedName === currentParameterName) {
										paramsToRemove.push(iterator);
									}
								});
							});
						});
						_.each(paramsToRemove,
						function(currentParam) {
							cb.arguments.splice(currentParam, currentParam + 1);
							cb.callee.params.splice(currentParam, currentParam + 1);
						});
						if (kclean.callbackParameterMap[assignmentName]) {
							node.right = function() {
								if (options.aggressiveOptimizations === true && mappedParameters.length) {
									assignmentNodes = _.map(mappedParameters,
									function(currentDependency, iterator) {
										return {
											'type': 'AssignmentExpression',
											'operator': '=',
											'left': {
												'type': 'Identifier',
												'name': currentDependency.name,
												'range': defaultRange,
												'loc': defaultLOC
											},
											'right': iterator < mappedParameters.length - 1 ? {
												'range': defaultRange,
												'loc': defaultLOC
											}: cb,
											'range': defaultRange,
											'loc': defaultLOC
										};
									});
									assignments = _.reduce(assignmentNodes,
									function(result, assignment) {
										result.right = assignment;
										return result;
									});
									return assignmentNodes.length ? assignments: cb;
								} else {
									return cb;
								}
							} ();
							return node;
						}
					}
				}
			});
		}
		if (_.isArray(options.globalModules)) {
			_.each(options.globalModules, function(currentModule) {
				if (_.isString(currentModule) && currentModule.length) {
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
		hoistedCallbackParameters = function() {
			var obj = {},
			callbackParameterMap = kclean.callbackParameterMap,
			currentParameterName;
			_.each(callbackParameterMap, function(mappedParameters) {
				_.each(mappedParameters,
				function(currentParameter) {
					if (currentParameter.count > 1) {
						currentParameterName = currentParameter.name;
						obj[currentParameterName] = true;
					}
				});
			});
			return obj;
		} ();

		hoistedVariables = _.merge(_.cloneDeep(_.reduce(kclean.storedModules,
		function(storedModules, key, val) {
			if (key !== false) {
				storedModules[val] = true;
			}
			return storedModules;
		},
		{})), hoistedCallbackParameters);

		_.each(hoistedVariables,function(moduleValue, moduleName) {
			if (!_.contains(options.ignoreModules, moduleName)) {
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
		if (declarations.length) {
		    declarations = declarations.filter(function(item){
		        return loadedModules.indexOf(moduleMap[item.id.name]) > -1;
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

        var _code = [],dependencies = [];

        for(var k in moduleMap) {
            if(loadedModules.indexOf(moduleMap[k]) == -1){
                _code.push(util.format('var %s = require("%s");',k, moduleMap[k]));
                dependencies.push(moduleMap[k]);
            }
        }

        generatedCode = _code.join("\n") +"\n" + generatedCode;
        if(options.outputModule){
            var sep = "\n";
            for(var m in moduleMap){
                if(moduleMap[m] == options.outputModule){
                    generatedCode = generatedCode + util.format('\nmodule.exports = %s;',m);
                    break;
                }
            }
            if(options.minify) {
                generatedCode = minify(generatedCode);
                sep = "";
            }
            generatedCode = util.format('KISSY.add("%s", %s, function(S ,require, exports, module) {%s', options.outputModule, JSON.stringify(dependencies), sep) + generatedCode;

            generatedCode = generatedCode + sep + '});';

        }
        return generatedCode;
	};

	(function(defaultOptions) {
	    (function(root, factory, undefined) {
			if (typeof define === 'function' && define.amd) {
				factory.amd = true;
				define(['esprima', 'estraverse', 'escodegen', 'underscore'],
				function(esprima, estraverse, escodegen, underscore) {
					return factory({
						'esprima': esprima,
						'estraverse': estraverse,
						'escodegen': escodegen,
						'underscore': underscore
					},
					root);
				});
			} else if (typeof exports !== 'undefined') {
				factory.commonjs = true;
				module.exports = factory(null, root);
			} else {
				root.kclean = factory(null, root);
			}
		} (this,
		function cleanamd(amdDependencies, context) {
			esprima = function() {
				if (cleanamd.amd && amdDependencies && amdDependencies.esprima && amdDependencies.esprima.parse) {
					return amdDependencies.esprima;
				} else if (cleanamd.commonjs) {
					return require('esprima');
				} else if (context && context.esprima && context.esprima.parse) {
					return context.esprima;
				}
			} ();
			estraverse = function() {
				if (cleanamd.amd && amdDependencies && amdDependencies.estraverse && amdDependencies.estraverse.traverse) {
					return amdDependencies.estraverse;
				} else if (cleanamd.commonjs) {
					return require('estraverse');
				} else if (context && context.estraverse && context.estraverse.traverse) {
					return context.estraverse;
				}
			} ();
			escodegen = function() {
				if (cleanamd.amd && amdDependencies && amdDependencies.escodegen && amdDependencies.escodegen.generate) {
					return amdDependencies.escodegen;
				} else if (cleanamd.commonjs) {
					return require('escodegen');
				} else if (context && context.escodegen && context.escodegen.generate) {
					return context.escodegen;
				}
			} ();
			_ = function() {
				if (cleanamd.amd && amdDependencies && (amdDependencies.underscore || amdDependencies.lodash || amdDependencies._)) {
					return amdDependencies.underscore || amdDependencies.lodash || amdDependencies._;
				} else if (cleanamd.commonjs) {
					return require('lodash');
				} else if (context && context._) {
					return context._;
				}
			} ();
			var Kclean = function(options, overloadedOptions) {
				if (!esprima) {
					throw new Error(errorMsgs.esprima);
				} else if (!estraverse) {
					throw new Error(errorMsgs.estraverse);
				} else if (!escodegen) {
					throw new Error(errorMsgs.escodegen);
				} else if (!_) {
					throw new Error(errorMsgs.lodash);
				}
				var defaultOptions = _.cloneDeep(this.defaultOptions || {}),
				userOptions = options || overloadedOptions || {};
				if (!_.isPlainObject(options) && _.isString(options)) {
					userOptions = _.merge({
						'code': options
					},
					_.isObject(overloadedOptions) ? overloadedOptions: {});
				}
				this.storedModules = {};
				this.variablesStore = {};
				this.originalAst = {};
				this.callbackParameterMap = {};
				this.conditionalModulesToIgnore = {};
				this.conditionalModulesToNotOptimize = {};
				this.matchingCommentLineNumbers = {};
				this.comments = [];
				this.options = _.merge(defaultOptions, userOptions);
			},
			publicAPI = {
				'VERSION': '2.2.4',
				'clean': function(options, overloadedOptions) {
					var kclean = new Kclean(options, overloadedOptions),
					cleanedCode = kclean.clean();
					return cleanedCode;
				}
			};
			Kclean.prototype = {
				'clean': clean,
				'defaultOptions': defaultOptions
			};
			return publicAPI;
		}));
	} (_defaultOptions_));
} ());