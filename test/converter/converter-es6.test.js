import assert from 'assert';
import converter from '../../src/converter'

describe.only('Converter - ES6 mode', function() {

    it.skip('feature | swaps library name with a path to the main script', () => {

        const importStatement = `import library from 'library-name';`
        const libraryName = 'library-name';
        const pathToMainScript = './main-script';

        const replacedImportStatement = converter(importStatement, libraryName, pathToMainScript);

        assert.equal(replacedImportStatement, `import library from '.././main-script';`)
    });

    it.skip('feature | wraps the code after imports as a test case', () => {

        const input = readFile('./test/converter/data/es6/input-import-console-log.js');
        const output = `import library from 'library-name';

it('Example test', () => {

    if (conditionMet) {
        require('global-pollution');
    }
    const result = library.someFunction();

    console.log(result);
    // prints 'some-result'
});
`;
        assert.equal(converter(input, 'Example test'), output);
    });

    it('transforms code with import and console.log', () => {

        const input = readFile('./test/converter/data/es6/input-import-console-log.js');
        const output = readFile('./test/converter/data/es6/output-import-console-log.js');

        assert.equal(converter(input, 'Example one', 'library-name', './main-script.js'), output);
    });

    it('transforms code with imports and equality comparison', () => {

        const input = readFile('./test/converter/data/es6/input-imports-equality.js');
        const output = readFile('./test/converter/data/es6/output-imports-equality.js');

        assert.equal(converter(input, 'Example two', 'library-name', './main-script.js'), output);
    });
});