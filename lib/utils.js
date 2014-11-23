var errorMsgs = require('./errorMsgs'),
    defaultValues = require('./defaultValues'),
    _ = require('lodash');


 function splitSlash(str) {
    var parts = str.split(/\//);
    if (str.charAt(0) === '/' && parts[0]) {
        parts.unshift('');
    }
    if (str.charAt(str.length - 1) === '/' && str.length > 1 && parts[parts.length - 1]) {
        parts.push('');
    }
    return parts;
}

module.exports = {
    'isDefine': function(node, kclean) {
        var expression = node.expression || {},
            callee = expression.callee;

        if(_.isObject(node) && node.type === 'ExpressionStatement' && expression && expression.type ==='CallExpression'){
            if(callee  && callee.type === 'MemberExpression'  && callee.object) {
                if(callee.object.name === 'modulex' && callee.property && callee.property.name == 'add'){
                    if(kclean){
                        if(!kclean.seajs && !kclean.kissy){
                            kclean.modulex = true;
                        }
                    }
                    return true;
                }else if(callee.object.name === 'KISSY' && callee.property && callee.property.name == 'add'){
                    if(kclean){
                        if(!kclean.seajs && !kclean.modulex){
                            kclean.kissy = true;
                        }
                    }
                    return true;
                }
            }else if(callee && callee.type == "Identifier" && callee.name === 'define'){
                if(kclean){
                    if(!kclean.modulex && !kclean.kissy){
                        kclean.seajs = true;
                    }
                }
                return true;

            }
        }

        return false;
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
        if(!node) {
            return false;
        }

        return (node.type === 'AssignmentExpression' &&
            node.left &&
            node.left.type === 'MemberExpression' &&
            node.left.object &&
            node.left.object.type === 'Identifier' &&
            node.left.object.name === 'module' &&
            node.left.property &&
            node.left.property.type === 'Identifier' &&
            node.left.property.name === 'exports');
    },

    'isRequireExpression': function(node) {
        return node && node.type === 'CallExpression'
               && node.arguments.length === 1
               && node.callee && node.callee.name === 'require';
    },

    'isObjectExpression': function(expression) {
        return (expression &&
            expression &&
            expression.type === 'ObjectExpression');
    },

    'isFunctionExpression': function(expression) {
        return (expression &&
            expression &&
            expression.type === 'FunctionExpression');
    },

    'isFunctionCallExpression': function(expression) {
        return (expression &&
            expression &&
            expression.type === 'CallExpression' &&
            expression.callee &&
            expression.callee.type === 'FunctionExpression');
    },

    'isUseStrict': function(expression) {
        return (expression &&
            expression &&
            expression.value === 'use strict' &&
            expression.type === 'Literal');
    },

    'isAMDConditional': function(node) {
        if(node && node.type !== 'IfStatement' ||
            !node.test ||
            !node.test.left) {
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
            return (_.where(node.test, matchObject).length ||
                _.where([node.test], matchObject).length ||
                _.where(node.test.left, matchObject).length ||
                _.where([node.test.left], matchObject).length ||
                _.where(node.test, reversedMatchObject).length ||
                _.where([node.test], reversedMatchObject).length ||
                _.where(node.test.left, reversedMatchObject).length ||
                _.where([node.test.left], reversedMatchObject).length);
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

        return input.replace(new RegExp(delimiter + '(.)', 'g'), function(match, group1) {
            return group1.toUpperCase();
        });
    },

    'prefixReservedWords': function(name) {
        var reservedWord = false;

        try {
            if(name.length) {
                eval('var ' + name + ' = 1;');
            }
        } catch (e) {
            reservedWord = true;
        }

        if(reservedWord === true) {
            return '_' + name;
        } else {
            return name;
        }
    },

    'normalizeDependencyName': function(moduleId, dep) {
        if(!moduleId || !dep || !this.isRelativeFilePath(dep)) {
            return dep;
        }

        var normalizePath = function(path) {
            var segments = path.split('/'),
                normalizedSegments;

            normalizedSegments = _.reduce(segments, function(memo, segment) {
                switch(segment) {
                    case '.':
                        break;
                    case '..':
                        memo.pop();
                        break;
                    default:
                        memo.push(segment);
                }

                return memo;
            }, []);
            return normalizedSegments.join('/');
        },
        baseName = function(path) {
            var segments = path.split('/');

            segments.pop();
            return segments.join('/');
        };

        return normalizePath([baseName(moduleId), dep].join('/'));
    },

    checkCircle: function(list, nick){//检测是否存在循环依赖
        for(var i = 0, name; name = list[ i++ ];){
            var el =  modules[name];
            if(el ){
                if( el.name == nick || el.deps.length && _checkCircle(el.deps, nick)){
                    return true;
                }
            }
        }
    },

    topologicalSort: function ( nodes ) {
        var map = {};
        function isEmpty( obj ) {
            if ( !obj ) return true;
            for ( var i in obj ) {
                return false;
            }
            return true;
        }

        function clearDep( node, name ) {
            var deps = [];

            for ( var i in node.dependencies ) {
                if ( node.dependencies[i] !== name ) {
                    deps.push( node.dependencies[i] );
                }
            }
            node.dependencies = deps;
        }

        var index = 0;
        var _nodes = JSON.parse(JSON.stringify(nodes)),
            node_list = [];

        for(var i in _nodes) {
            node_list.push(_nodes[i]);
        }

        var node = node_list.pop();
        if(node) {
            //console.log(node.dependencies);
        }

        while( !isEmpty( nodes ) ) {

            for ( var i in nodes ) {

                var b = nodes[ i ];
                if ( b.dependencies.length === 0 ) {
                    map[b.name] = index++;
                    delete nodes[ i ];
                    // 清除所有该某块的依赖
                    for ( var j in nodes ) {
                        clearDep( nodes[j], b.name );
                    }
                }
            }
        }
        return map;
    },

    substitute: function (str, o, regexp) {
        var SUBSTITUTE_REG = /\\?\{([^{}]+)\}/g;
        if (typeof str !== 'string' || !o) {
            return str;
        }
        return str.replace(regexp || SUBSTITUTE_REG, function (match, name) {
            if (match.charAt(0) === '\\') {
                return match.slice(1);
            }
            return o[name] === undefined ? "" : o[name];
        });
    },

    normalizePath: function (parentPath, subPath) {
        var firstChar = subPath.charAt(0);
        if (firstChar !== '.') {
            return subPath;
        }
        var parts = splitSlash(parentPath);
        var subParts = splitSlash(subPath);
        parts.pop();
        for (var i = 0, l = subParts.length; i < l; i++) {
            var subPart = subParts[i];
            if (subPart === '.') {
            } else if (subPart === '..') {
                parts.pop();
            } else {
                parts.push(subPart);
            }
        }
        return parts.join('/').replace(/\/+/, '/');
    },

    getDependency: function(map, module) {

        var self = this,
            dependencies = (map[module] && map[module].dependencies)||[];

        dependencies.length && dependencies.forEach(function(item){
            dependencies = dependencies.concat.apply(dependencies, self.getDependency(map,item));
        });

        return dependencies;
    },

    endsWith: function(str, suffix) {
        var ind = str.length - suffix.length;
        return ind >= 0 && str.indexOf(suffix, ind) === ind;
    }
};
