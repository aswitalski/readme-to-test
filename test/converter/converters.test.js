'use strict';

import converters from '../../src/converter/converters';

describe('Converters', () => {

    describe('Import converter', () => {

        it('swaps library name with a path to the main script', () => {

            const importStatement = `import library from 'library-name';`
            const libraryName = 'library-name';
            const pathToMainScript = 'main.js';

            const replacedImportStatement = converters.convertImport(importStatement, {
                libraryName,
                pathToMainScript
            });

            assert.equal(replacedImportStatement, `import library from '../main.js';`)
        });
    });

    describe('Code wrapper', () => {

        it('wraps the single line as a test case', () => {

            const input =
/* ---------------------------- */
`library.doSomething();`;
/* ---------------------------- */
            const output =
/* ---------------------------- */
`import assert from 'assert';

it('Example test', () => {

    library.doSomething();
});
`; /* ------------------------- */
            const lines = input.split('\n');

            const result = lines
                .reduce((...args) => converters.wrapAsTestCase(...args, {
                    lastImport: -1,
                    testName: 'Example test'
                }), [])
                .join('\n');

            assert.equal(result, output);
        });
    });

});