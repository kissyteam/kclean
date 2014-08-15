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
	// 'standard' example: 'utils/example' -> 'utils_example'
	// 'camelCase' example: 'utils/example' -> 'utilsExample'
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