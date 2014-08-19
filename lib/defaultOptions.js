module.exports = {
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
	// 'standard' : 'utils/example' -> 'utils_example'
	// 'camelCase': 'utils/example' -> 'utilsExample'
	'prefixMode': 'standard',

	'prefixTransform': function(moduleName) {
	    return moduleName;
	},
	'wrap': {
	    'kissy':{
	        'start': 'KISSY.add("{moduleName}", {dependencies}, function(S ,require, exports, module) {\n',
            'end': '\n});'
	    },
	    "modulex":{
            'start': 'modulex.add("{moduleName}", {dependencies}, function(require, exports, module) {\n',
            'end': '\n});'
        },
		"seajs":{
		    'start': 'define("{moduleName}", {dependencies}, function(require, exports, module) {\n',
            'end': '\n});'
		}
	},
	'aggressiveOptimizations': true
};