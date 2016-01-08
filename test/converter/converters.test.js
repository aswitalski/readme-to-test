'use strict';

import converters from '../../src/converter/converters';

describe('Converters', () => {

    describe('Division into lines', () => {

        it('splits the trimmed code by line-end characters', () => {

            const code = 'a\nb\nc\n';
            const result = converters.getLines(code);

            assert.deepEqual(result, ['a', 'b', 'c']);
        });

    });

    describe('Import converter', () => {

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

    describe('Test case code wrapper', () => {

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
`import assert from 'assert';

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
`import assert from 'assert';

it('Two-line code', () => {

    library.doSomething();
    library.doSomethingElse();
});
`; /* ------------------------- */

            assert.equal(wrapAsTestCase(input, 'Two-line code'), output);
        });

    });

});