import assert from 'assert';
import convertToTest from '../../src/converter/convert-to-test';

describe('Convert to test', () => {

    describe('==> ES6 mode', () => {

        it('transforms code with import and console.log', () => {

            const input = readFile('./test/converter/data/es6/input-import-console-log.js');
            const output = readFile('./test/converter/data/es6/output-import-console-log.js');

            assert.equal(convertToTest(input, 'Example one', 'library-name', './main-script.js'), output);
        });

        it('transforms code with imports and equality comparison', () => {

            const input = readFile('./test/converter/data/es6/input-imports-equality.js');
            const output = readFile('./test/converter/data/es6/output-imports-equality.js');

            assert.equal(convertToTest(input, 'Example two', 'library-name', './main-script.js'), output);
        });

        it('transforms code with require and console.log', () => {

            const input = readFile('./test/converter/data/es5/input-require-console-log.js');
            const output = readFile('./test/converter/data/es5/output-require-console-log.js');

            assert.equal(convertToTest(input, 'Example three', 'key-facsimile', 'index.js'), output);
        });

    });
});