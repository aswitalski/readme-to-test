'use strict';

const getLines = (code) => code.trim().split('\n');

const convertImport = (line, context) => {
    if (line.match(new RegExp(`import .+ from '${context.libraryName}'`))) {
        return line.replace(new RegExp(`'${context.libraryName}'`), `'../${context.pathToMainScript}'`);
    } else {
        return line;
    }
};

const convertRequire = (line, context) => {
    if (line.match(new RegExp(`.+require\\('${context.libraryName}'\\)`))) {
        return line.replace(new RegExp(`require\\('${context.libraryName}'\\)`), `require('../${context.pathToMainScript}')`);
    } else {
        return line;
    }
};

const findLastImport = (line, index, context) => {
    if (line.match(/import .+ from/)) {
        context.lastImport = index;
    }
    return line;
};

const wrapAsTestCase = (result, line, index, lines, context) => {
    if (index === 0) {
        result.push(`import assert from 'assert';`);
    }
    if (index > context.lastImport) {
        switch (result.mode) {
            case 'indent':
                result.push(line.length === 0 ? '' : `    ${line}`);
                if (index === lines.length -1) {
                    result.push('});\n');
                }
                break;
            default:
                result.push('');
                result.push(`it('${context.testName}', () => {`);
                if (index === 0) {
                    result.push('');
                }
                result.push(line.length === 0 ? '' : `    ${line}`);
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

const replacePrintsStatement = (line, context) => {
    const logLine = line.match(/console\.log\((.+)\)/);
    if (logLine) {
        context.variableName = logLine[1];
    } else {
        const printsComment = line.match(/\/\/\s*prints (.+)/);
        if (printsComment) {
            if (context.variableName) {
                return line.replace(/\/\/.+/, `assert.deepEqual(${context.variableName}, ${printsComment[1]});`);
            } else {
                console.error('No variable defined for "prints" statement');
            }
        }
    }
    return line;
};

const replaceEqualityStatement = (line) => {
    const operands = line.match(/\/\/\s*(.+) === (.+)/);
    if (operands) {
        return line.replace(/\/\/.+/, `assert.deepEqual(${operands[1]}, ${operands[2]});`)
    }
    return line;
};

module.exports = {
    getLines,
    convertImport,
    convertRequire,
    findLastImport,
    wrapAsTestCase,
    replacePrintsStatement,
    replaceEqualityStatement
};
