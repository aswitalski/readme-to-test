'use strict';

import {
    convertImport,
    convertRequire,
    findLastImport,
    wrapAsTestCase,
    replacePrintsStatement,
    replaceEqualityStatement
} from './converters';

export default function (code, testName, libraryName, pathToMainScript) {

    const config = {
        // parameters
        testName,
        libraryName,
        pathToMainScript,
        // processing information
        lastImport: -1,
        variableName: null
    };

    return code.trim().split(/\n/)
        .map(line => convertImport(line, config))
        .map(line => convertRequire(line, config))
        .map((line, index) => findLastImport(line, index, config))
        .reduce((...args) => wrapAsTestCase(...args, config), [])
        .map(line => replacePrintsStatement(line, config))
        .map(line => replaceEqualityStatement(line))
        .join('\n');
};