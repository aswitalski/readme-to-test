'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Fragment = require('./vo/Fragment');

var _Fragment2 = _interopRequireDefault(_Fragment);

var _Example = require('./vo/Example');

var _Example2 = _interopRequireDefault(_Example);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extractHeaders = function extractHeaders(markdown) {

    var regex = /\s*#{1,4}\s*(.+)[^]/g;
    var fragments = [];
    var match = regex.exec(markdown);
    while (match) {
        fragments.push(new _Fragment2.default(match[1].trim(), match.index));
        match = regex.exec(markdown);
    }
    fragments.reverse();
    return fragments;
};

exports.default = function (markdown) {

    var regex = /```\s*js(.|[^])*?```/g;
    var fragments = [];
    var match = regex.exec(markdown);
    while (match) {
        fragments.push(new _Fragment2.default(match[0], match.index));
        match = regex.exec(markdown);
    }

    var headers = extractHeaders(markdown);

    if (fragments.length > 0) {

        return fragments.map(function (fragment, index) {

            var example = fragment.code;

            var found = false;
            var finished = false;

            var lines = example.match(/(.)*[^]/g).reduce(function (result, line) {
                if (finished === false) {
                    if (line.match(/```/)) {
                        if (found) {
                            finished = true;
                        }
                    } else {
                        result.push(line);
                    }
                }
                return result;
            }, []);

            var code = lines.join('').trim();
            var header = headers.find(function (h) {
                return h.index < fragment.index;
            });
            return new _Example2.default(code, header ? header.code : 'Example ' + (index + 1));
        });
    } else {
        console.error('No code examples found.');
        return null;
    }
};