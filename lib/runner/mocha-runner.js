'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mocha = require('mocha');

var _mocha2 = _interopRequireDefault(_mocha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (files) {

    var mocha = new _mocha2.default();
    files.map(function (file) {
        return mocha.addFile(file);
    });

    mocha.run(function (failures) {
        process.on('exit', function () {
            return process.exit(failures);
        });
    });
};