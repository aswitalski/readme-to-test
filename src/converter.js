'use strict';

export default function(code, testName, libraryName, pathToMainScript) {

    let lines = code.trim().split(/\n/);

    let lastImport;
    let variableName;

    return lines
        .map(function convertImport(line) {
            if (line.match(new RegExp(`import .+ from '${libraryName}'`))) {
                return line.replace(new RegExp(`'${libraryName}'`), `'../${pathToMainScript}'`);
            } else {
                return line;
            }
        })
        .map(function findLastImport(line, index) {
            if (line.match(/import .+ from/)) {
                lastImport = index;
            }
            return line;
        })
        .reduce(function wrapAsTestCase(result, line, index, lines) {
            if (index === 0) {
                result.push(`import assert from 'assert';`);
            }
            if (index > lastImport) {
                switch (result.mode) {
                    case 'indent':
                        result.push(line.length === 0 ? '' : `    ${line}`);
                        if (index === lines.length -1) {
                            result.push('});\n');
                        }
                        break;
                    default:
                        result.push('');
                        result.push(`it('${testName}', () => {`);
                        result.push(line.length === 0 ? '' : `    ${line}`);
                        result.mode = 'indent';
                }
            } else {
                result.push(line);
            }
            return result;
        }, [])
        .map(function replacePrintsStatement(line) {
            const logLine = line.match(/console\.log\((.+?)\)/);
            if (logLine) {
                variableName = logLine[1];
            } else {
                const printsComment = line.match(/\/\/\s*prints (.+)/);
                if (printsComment) {
                    if (variableName) {
                        return line.replace(/\/\/.+/, `assert.deepEqual(${variableName}, ${printsComment[1]});`);
                    } else {
                        console.error('No variable defined for "prints" statement');
                    }
                }
            }
            return line;
        })
        .map(function replaceEqualityStatement(line) {
            const equality = line.match(/\/\/\s*(.+) === (.+)/);
            if (equality) {
                return line.replace(/\/\/.+/, `assert.deepEqual(${equality[1]}, ${equality[2]});`)
            }
            return line;
        })
        .join('\n');
};
