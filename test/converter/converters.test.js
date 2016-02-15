'use strict';

import converters from '../../src/converter/converters';

describe('Converters', () => {

    describe('Get lines', () => {

        it('splits the trimmed code by line-end characters', () => {

            const code = 'a\nb\nc\n';
            const result = converters.getLines(code);

            assert.deepEqual(result, ['a', 'b', 'c']);
        });
    });

    describe('Convert import', () => {

        it('replaces library name with a path to the main script', () => {

            const code = `import library from 'library-name';`
            const libraryName = 'library-name';
            const pathToMainScript = 'main.js';

            const result = converters.convertImport(code, {
                libraryName,
                pathToMainScript
            });

            assert.equal(result, `import library from '../main.js';`)
        });

        it('does not replace variable name', () => {

            const code = `import library from 'library';`
            const libraryName = 'library';
            const pathToMainScript = 'main.js';

            const result = converters.convertImport(code, {
                libraryName,
                pathToMainScript
            });

            assert.equal(result, `import library from '../main.js';`)
        });
    });

    describe('Convert require', () => {

        it('replaces library name with a path to the main script', () => {

            const code = `var library = require('library-name');`
            const libraryName = 'library-name';
            const pathToMainScript = 'main.js';

            const result = converters.convertRequire(code, {
                libraryName,
                pathToMainScript
            });

            assert.equal(result, `var library = require('../main.js');`)
        });
    });

        describe('Wrap as test case', () => {

        const wrapAsTestCase = (code, testName, lastImport = -1) => {
            return code.split('\n')
                .reduce((...args) => converters.wrapAsTestCase(...args, {
                    lastImport,
                    testName
                }), [])
                .join('\n');
        };

        it('wraps the single-line code', () => {

            const input =
/* ---------------------------- */
`library.doSomething();`;
/* ---------------------------- */
            const output =
/* ---------------------------- */
`var assert = require('assert');

it('Single-line code', () => {

    library.doSomething();
});
`; /* ------------------------- */

            assert.equal(wrapAsTestCase(input, 'Single-line code'), output);
        });

        it('wraps the multi-line code', () => {

            const input =
/* ---------------------------- */
`library.doSomething();
library.doSomethingElse();`;
/* ---------------------------- */
            const output =
/* ---------------------------- */
`var assert = require('assert');

it('Two-line code', () => {

    library.doSomething();
    library.doSomethingElse();
});
`; /* ------------------------- */

            assert.equal(wrapAsTestCase(input, 'Two-line code'), output);
        });
    });

    describe('Find last import', () => {

        it('finds the index of the last import', () => {

            const context = {};
            const lines = [`import a from 'a';`, `import b from 'b';`, 'not an import'];

            lines.map((line, index) => converters.findLastImport(line, index, context));

            assert.equal(context.lastImport, 1);
        });

        it('finds the index of the last import when destructuring', () => {

            const context = {};
            const lines = [`import a from 'a';`, ``, `import b from 'b';`, `import { c, d } from 'cd';`, 'this is not an import'];

            lines.map((line, index) => converters.findLastImport(line, index, context));

            assert.equal(context.lastImport, 3);
        });
    });

    describe('Replace prints statement', () => {

        it('works for strings', () => {

            const line = `// prints 'some-string'`;
            const result = converters.replacePrintsStatement(line, {
                variableName: 'result'
            });

            assert.equal(result, `assert.deepEqual(result, 'some-string');`);
        });

        it('works for objects', () => {

            const line = `// prints { foo: 'bar' }`;
            const result = converters.replacePrintsStatement(line, {
                variableName: 'result'
            });

            assert.equal(result, `assert.deepEqual(result, { foo: 'bar' });`);
        });

        it('preserves indentation', () => {

            const line = `    // prints 48`;
            const result = converters.replacePrintsStatement(line, {
                variableName: 'result'
            });

            assert.equal(result, `    assert.deepEqual(result, 48);`);
        });
    });

    describe('Replace equality statement', () => {

        it('works for strings', () => {

            const line = `// result === 'some-string'`;
            const result = converters.replaceEqualityStatement(line);

            assert.equal(result, `assert.deepEqual(result, 'some-string');`);
        });

        it('works for objects', () => {

            const line = `// object === { foo: 'bar' }`;
            const result = converters.replaceEqualityStatement(line);

            assert.equal(result, `assert.deepEqual(object, { foo: 'bar' });`);
        });

        it('preserves indentation', () => {

            const line = `    // magicNumber === 48`;
            const result = converters.replaceEqualityStatement(line);

            assert.equal(result, `    assert.deepEqual(magicNumber, 48);`);
        });
    });
});
