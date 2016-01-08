'use strict';

import extractExamples from '../src/extract-examples';

describe('JavaScript code examples extraction', () => {

	it('exposes extractExamples()', () => {
		assert.equal(typeof extractExamples, 'function');
	});

	it('extracts basic example', () => {

        const readMePath = './test/extractor/data/input-basic-example.md';

		const singleExampleReadMe = readFile(readMePath);
		const singleExampleCode = readFile('./test/extractor/data/output-basic-example.js');

		const examples = extractExamples(singleExampleReadMe);

        assert(examples, 'Examples not found in file: ' + fileName(readMePath));
		assert.equal(examples.length, 1);
		assert.equal(examples[0].code, singleExampleCode);
        assert.equal(examples[0].name, 'Basic example');
	});

	it('extracts redundant examples', () => {

        const readMePath = './test/extractor/data/input-redundant-examples.md';

        const redundantExamplesReadMe = readFile(readMePath);
        const redundantExamplesCode = readFile('./test/extractor/data/output-redundant-examples.js');

        const examples = extractExamples(redundantExamplesReadMe);

        assert(examples, 'Examples not found in file: ' + fileName(readMePath));
        assert.equal(examples.length, 2);
        assert.equal(examples[0].code, redundantExamplesCode);
        assert.equal(examples[0].name, 'Redundant example one');
        assert.equal(examples[1].code, redundantExamplesCode);
        assert.equal(examples[1].name, 'Redundant example two');
    });

    it('extracts example with extra white spaces', () => {

        const readMePath = './test/extractor/data/input-extra-white-spaces.md';

        const extraSpacesReadMe = readFile(readMePath);
        const extraSpacesCode = readFile('./test/extractor/data/output-extra-white-spaces.js');

        const examples = extractExamples(extraSpacesReadMe);

        assert(examples, 'Examples not found in file: ' + fileName(readMePath));
        assert.equal(examples.length, 1);
        assert.equal(examples[0].code, extraSpacesCode);
        assert.equal(examples[0].name, 'Excessive spaces example');
    });

});