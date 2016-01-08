'use strict';

var getLines = function getLines(code) {
    return code.trim().split('\n');
};

var convertImport = function convertImport(line, context) {
    if (line.match(new RegExp('import .+ from \'' + context.libraryName + '\''))) {
        return line.replace(new RegExp('\'' + context.libraryName + '\''), '\'../' + context.pathToMainScript + '\'');
    } else {
        return line;
    }
};

var convertRequire = function convertRequire(line, context) {
    if (line.match(new RegExp('.+require\\(\'' + context.libraryName + '\'\\)'))) {
        return line.replace(new RegExp('require\\(\'' + context.libraryName + '\'\\)'), 'require(\'../' + context.pathToMainScript + '\')');
    } else {
        return line;
    }
};

var findLastImport = function findLastImport(line, index, context) {
    if (line.match(/import .+ from/)) {
        context.lastImport = index;
    }
    return line;
};

var wrapAsTestCase = function wrapAsTestCase(result, line, index, lines, context) {
    if (index === 0) {
        result.push('import assert from \'assert\';');
    }
    if (index > context.lastImport) {
        switch (result.mode) {
            case 'indent':
                result.push(line.length === 0 ? '' : '    ' + line);
                if (index === lines.length - 1) {
                    result.push('});\n');
                }
                break;
            default:
                result.push('');
                result.push('it(\'' + context.testName + '\', () => {');
                if (index === 0) {
                    result.push('');
                }
                result.push(line.length === 0 ? '' : '    ' + line);
                result.mode = 'indent';
                if (lines.length === 1) {
                    result.push('});\n');
                }
        }
    } else {
        result.push(line);
    }
    return result;
};

var replacePrintsStatement = function replacePrintsStatement(line, context) {
    var logLine = line.match(/console\.log\((.+?)\)/);
    if (logLine) {
        context.variableName = logLine[1];
    } else {
        var printsComment = line.match(/\/\/\s*prints (.+)/);
        if (printsComment) {
            if (context.variableName) {
                return line.replace(/\/\/.+/, 'assert.deepEqual(' + context.variableName + ', ' + printsComment[1] + ');');
            } else {
                console.error('No variable defined for "prints" statement');
            }
        }
    }
    return line;
};

var replaceEqualityStatement = function replaceEqualityStatement(line) {
    var operands = line.match(/\/\/\s*(.+) === (.+)/);
    if (operands) {
        return line.replace(/\/\/.+/, 'assert.deepEqual(' + operands[1] + ', ' + operands[2] + ');');
    }
    return line;
};

module.exports = {
    getLines: getLines,
    convertImport: convertImport,
    convertRequire: convertRequire,
    findLastImport: findLastImport,
    wrapAsTestCase: wrapAsTestCase,
    replacePrintsStatement: replacePrintsStatement,
    replaceEqualityStatement: replaceEqualityStatement
};