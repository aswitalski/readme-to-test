'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mocha = require('mocha');

var _mocha2 = _interopRequireDefault(_mocha);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (files) {

    require('babel-register');

    var mocha = new _mocha2.default();
    files.map(function (file) {
        return mocha.addFile(file);
    });

    return new _bluebird2.default(function (resolve, reject) {
        mocha.run(resolve);
    });
};