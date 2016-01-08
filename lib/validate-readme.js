'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rmdir = require('rmdir');

var _rmdir2 = _interopRequireDefault(_rmdir);

var _extractExamples = require('./extractor/extract-examples');

var _extractExamples2 = _interopRequireDefault(_extractExamples);

var _convertToTest = require('./converter/convert-to-test');

var _convertToTest2 = _interopRequireDefault(_convertToTest);

var _mochaRunner = require('./runner/mocha-runner');

var _mochaRunner2 = _interopRequireDefault(_mochaRunner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var packageJson = undefined;
_fs2.default.readFile('./package.json', 'utf8', function (err, contents) {
    packageJson = JSON.parse(contents);
});

module.exports = function () {
    _fs2.default.readFile('./README.md', 'utf8', function (err, markdown) {

        if (err) {
            console.error('Error reading README.md file');
            process.exit(1);
        }

        var examples = (0, _extractExamples2.default)(markdown);

        console.log(' Found ' + examples.length + ' code examples.');

        var tests = examples.map(function (example) {
            return (0, _convertToTest2.default)(example.code, example.name, packageJson.name, packageJson.main);
        });

        console.log('\n==> Validating README examples...');

        try {
            (function () {

                var tempDir = './.tmp';

                _fs2.default.mkdirSync(tempDir);

                tests.map(function (test, index) {
                    _fs2.default.writeFileSync('./.tmp/example-' + (index + 1) + '.test.js', test);
                });

                require('babel-register');

                var files = _fs2.default.readdirSync(tempDir).filter(function (file) {
                    return file.substr(-3) === '.js';
                }).map(function (file) {
                    return _path2.default.join(tempDir, file);
                });

                (0, _mochaRunner2.default)(files);
            })();
        } finally {
            (0, _rmdir2.default)('./.tmp', { fs: _fs2.default });
        }
    });
};