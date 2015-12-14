'use strict';

const amendImport = (example, packageName, mainFile) => {
	return example.replace(new RegExp("\'" + packageName + "\'"), "'../" + mainFile + "'");
};

const interceptConsoleLog = () => {


};

const convertToTest = (test, name) => {

	const testTemplate = `

import assert from 'assert';

it('${name}', () => {

	${test.split('\n').join('\n\t')}
});

`;
	
	return testTemplate;
};

const replacePrintsComment = (example, packageName, mainFile) => {
	return example.split('\n').map(line => {
		let match = line.match(/(.. prints)(.+)/);
		if (match) {
			return 'assert.deepEqual(result, ' + match[2] + ')'; 
		} else {
			return line;
		}
	}).join('\n');
};

module.exports = function convertToTests(examples, packageName, mainFile) {

	return examples.map(example => {
		let amendedImport = amendImport(example, packageName, mainFile);
		let withAsserts = replacePrintsComment(amendedImport);
		let asTest = convertToTest(withAsserts, 'Example');
		let formattedTest = asTest.trim();
		console.log(formattedTest)
		return formattedTest;
	});
};