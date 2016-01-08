'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (code, testName, libraryName, pathToMainScript) {

    var context = {
        // parameters
        testName: testName,
        libraryName: libraryName,
        pathToMainScript: pathToMainScript,
        // processing information
        lastImport: -1,
        variableName: null
    };

    return (0, _converters.getLines)(code).map(function (line) {
        return (0, _converters.convertImport)(line, context);
    }).map(function (line) {
        return (0, _converters.convertRequire)(line, context);
    }).map(function (line, index) {
        return (0, _converters.findLastImport)(line, index, context);
    }).reduce(function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _converters.wrapAsTestCase.apply(undefined, args.concat([context]));
    }, []).map(function (line) {
        return (0, _converters.replacePrintsStatement)(line, context);
    }).map(function (line) {
        return (0, _converters.replaceEqualityStatement)(line);
    }).join('\n');
};

var _converters = require('./converters');

;