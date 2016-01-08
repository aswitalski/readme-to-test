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

        it('wraps the code after imports as a test case', () => {

            const input = readFile('./test/converter/data/es6/input-import-console-log.js');
            const output = `import assert from 'assert';
import library from 'library-name';

it('Example test', () => {

    if (conditionMet) {
        require('global-pollution');
    }
    const result = library.someFunction();

    console.log(result);
    // prints 'some-result'
});
`;

            const lines = input.split('\n');

            const result = lines
                .reduce((...args) => converters.wrapAsTestCase(...args, {
                    lastImport: 0,
                    testName: 'Example test'
                }), [])
                .join('\n');

            assert.equal(result, output);
        });
    });

});