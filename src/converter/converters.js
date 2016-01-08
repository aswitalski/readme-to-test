'use strict';

const convertImport = (line, config) => {
    if (line.match(new RegExp(`import .+ from '${config.libraryName}'`))) {
        return line.replace(new RegExp(`'${config.libraryName}'`), `'../${config.pathToMainScript}'`);
    } else {
        return line;
    }
};

const convertRequire = (line, config) => {
    if (line.match(new RegExp(`.+require\\('${config.libraryName}'\\)`))) {
        return line.replace(new RegExp(`require\\('${config.libraryName}'\\)`), `require('../${config.pathToMainScript}')`);
    } else {
        return line;
    }
};

const findLastImport = (line, index, config) => {
    if (line.match(/import .+ from/)) {
        config.lastImport = index;
    }
    return line;
};

const wrapAsTestCase = (result, line, index, lines, config) => {
    if (index === 0) {
        result.push(`import assert from 'assert';`);
    }
    if (index > config.lastImport) {
        switch (result.mode) {
            case 'indent':
                result.push(line.length === 0 ? '' : `    ${line}`);
                if (index === lines.length -1) {
                    result.push('});\n');
                }
                break;
            default:
                result.push('');
                result.push(`it('${config.testName}', () => {`);
                if (index === 0) {
                    result.push('');
                }
                result.push(line.length === 0 ? '' : `    ${line}`);
                result.mode = 'indent';
        }
    } else {
        result.push(line);
    }
    return result;
};

const replacePrintsStatement = (line, config) => {
    const logLine = line.match(/console\.log\((.+?)\)/);
    if (logLine) {
        config.variableName = logLine[1];
    } else {
        const printsComment = line.match(/\/\/\s*prints (.+)/);
        if (printsComment) {
            if (config.variableName) {
                return line.replace(/\/\/.+/, `assert.deepEqual(${config.variableName}, ${printsComment[1]});`);
            } else {
                console.error('No variable defined for "prints" statement');
            }
        }
    }
    return line;
};

const replaceEqualityStatement = (line) => {
    const equality = line.match(/\/\/\s*(.+) === (.+)/);
    if (equality) {
        return line.replace(/\/\/.+/, `assert.deepEqual(${equality[1]}, ${equality[2]});`)
    }
    return line;
};

module.exports = {
    convertImport,
    convertRequire,
    findLastImport,
    wrapAsTestCase,
    replacePrintsStatement,
    replaceEqualityStatement
};
