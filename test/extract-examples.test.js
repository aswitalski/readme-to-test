const extractExamples = require('../src/extractor');

describe('JavaScript code examples extraction', () => {

	it('exposes extractExamples()', () => {
		assert.equal(typeof extractExamples, 'function');
	});

	it('exposes extractExamples.withNames()', () => {
		assert.equal(typeof extractExamples.withNames, 'function');
	});

	it('extracts basic example', () => {

		const singleExampleReadMe = readFile('./test/extractor/data/input-basic-example.md');
		const singleExampleCode = readFile('./test/extractor/data/output-basic-example.js');

		const examples = extractExamples(singleExampleReadMe);

		assert.equal(examples.length, 1);
		assert.equal(examples[0], singleExampleCode);
	});

	it('extracts redundant examples', () => {

        const redundantExamplesReadMe = readFile('./test/extractor/data/input-redundant-examples.md');
        const redundantExamplesCode = readFile('./test/extractor/data/output-redundant-examples.js');

        const examples = extractExamples(redundantExamplesReadMe);

        assert.equal(examples.length, 2);
        assert.equal(examples[0], redundantExamplesCode);
        assert.equal(examples[1], redundantExamplesCode);

    });

});