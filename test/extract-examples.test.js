const extractExamples = require('../src/extractor');

describe('JavaScript code examples extraction', () => {

	it('exposes extractExamples()', () => {
		assert.equal(typeof extractExamples, 'function');
	})

	it('exposes extractExamples.withNames()', () => {
		assert.equal(typeof extractExamples.withNames, 'function');
	})

	it('extracts basic example', () => {

		const singleExampleReadme = fs.readFileSync('./test/extractor/data/input-basic-example.md', 'utf8');
		const singleExampleCode = fs.readFileSync('./test/extractor/data/output-basic-example.js', 'utf8');

		const examples = extractExamples(singleExampleReadme);

		assert.equal(examples.length, 1);
		assert.equal(examples[0], singleExampleCode);
	});

});