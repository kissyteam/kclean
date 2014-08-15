module.exports = {
	'emptyCode': 'There is no code to generate the AST with',
	'emptyAst': function(methodName) {
	    return 'An AST is not being passed to the ' + methodName + '() method';
	},
	'invalidObject': function(methodName) {
	    return 'An object is not being passed as the first parameter to the ' + methodName + '() method';
	}
}