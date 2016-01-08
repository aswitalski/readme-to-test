'use strict';

import {
    getLines,
    convertImport,
    convertRequire,
    findLastImport,
    wrapAsTestCase,
    replacePrintsStatement,
    replaceEqualityStatement
} from './converters';

export default function (code, testName, libraryName, pathToMainScript) {

    const context = {
        // parameters
        testName,
        libraryName,
        pathToMainScript,
        // processing information
        lastImport: -1,
        variableName: null
    };

    return getLines(code)
        .map(line => convertImport(line, context))
        .map(line => convertRequire(line, context))
        .map((line, index) => findLastImport(line, index, context))
        .reduce((...args) => wrapAsTestCase(...args, context), [])
        .map(line => replacePrintsStatement(line, context))
        .map(line => replaceEqualityStatement(line))
        .join('\n');
};