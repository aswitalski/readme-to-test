'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rmdir = require('rmdir');

var _rmdir2 = _interopRequireDefault(_rmdir);

var _extractExamples = require('./extractor/extract-examples');

var _extractExamples2 = _interopRequireDefault(_extractExamples);

var _convertToTest = require('./converter/convert-to-test');

var _convertToTest2 = _interopRequireDefault(_convertToTest);

var _mochaRunner = require('./runner/mocha-runner');

var _mochaRunner2 = _interopRequireDefault(_mochaRunner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadPackageJson = new Promise(function (resolve, reject) {
    _fs2.default.readFile('./package.json', 'utf8', function (err, contents) {
        if (err) {
            reject(err);
        } else {
            resolve(JSON.parse(contents));
        }
    });
});

var loadReadMe = new Promise(function (resolve, reject) {
    _fs2.default.readFile('./README.md', 'utf8', function (err, markdown) {
        if (err) {
            reject(err);
        } else {
            resolve(markdown);
        }
    });
});

var loadOptions = new Promise(function (resolve) {
    resolve({
        tempDir: './.tmp/'
    });
});

module.exports = function () {

    Promise.all([loadPackageJson, loadReadMe, loadOptions]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 3);

        var packageJson = _ref2[0];
        var markdown = _ref2[1];
        var options = _ref2[2];

        var examples = (0, _extractExamples2.default)(markdown);
        var tests = examples.map(function (example) {
            return (0, _convertToTest2.default)(example.code, example.name, packageJson.name, packageJson.main);
        });

        console.log('\n==> Validating ' + examples.length + ' README examples...');

        try {

            _fs2.default.mkdirSync(options.tempDir);

            var testFileNames = tests.map(function writeTestsToFiles(test, index) {
                var path = options.tempDir.concat('example-' + (index + 1) + '.test.js');
                _fs2.default.writeFileSync(path, test);
                return path;
            });

            (0, _mochaRunner2.default)(testFileNames);
        } finally {
            (0, _rmdir2.default)(options.tempDir, { fs: _fs2.default }, function (err) {
                console.error(err);
            });
        }
    }).catch(function (err) {
        console.error(err && err.stack ? err.stack : err);
    });
};