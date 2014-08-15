var errorMsgs = require('./errorMsgs'),
    getNormalizedModuleName = require('./getNormalizedModuleName'),
    _ = require('lodash'),
    estraverse = require('estraverse');

module.exports = function findAndStoreAllModuleIds(ast) {
		var kclean = this;

		if(!ast) {
			throw new Error(errorMsgs.emptyAst('findAndStoreAllModuleIds'));
		}


		estraverse.traverse(ast, {
			'enter': function(node, parent) {
			    var moduleName = getNormalizedModuleName.call(kclean, node, parent);

			    if(moduleName && !kclean.storedModules[moduleName]) {
						kclean.storedModules[moduleName] = true;
			    }


			    if(node.type === 'ReturnStatement' && node.argument && node.argument.callee && node.argument.callee.name === 'define') {
			    	node.type = 'ExpressionStatement';
			    	node.expression = node.argument;
			    	delete node.argument;
			    }

			    if(node.type === 'VariableDeclarator') {
						kclean.variablesStore[node.id.name] = true;
			    }
			}
		});
	};