'use strict';

export default function(code, testName, libraryName, pathToMainScript) {

    let lines = code.trim().split(/\n/);

    let lastImport;

    //console.log('Code:');
    //console.log('--------');
    //console.log(code.trim());
    //console.log('--------');
    //console.log('Length:');
    //console.log(lines.length);

    const convertImport = () => {

    };


    const wrapAsTestCase = () => {

        const indent = () => {

        };

    };

    const result = lines
        .map(function convertImport(line) {
            if (line.match(new RegExp(`import .+ from '${libraryName}'`))) {
                return line.replace(new RegExp(`'${libraryName}'`), `'../${pathToMainScript}'`);
            } else {
                return line;
            }
        })
        .map(function findLastImport(line, index) {
            if (line.match(/import .+ from/)) {
                lastImport = index;
            }
            return line;
        })
        .reduce(function wrapAsTestCase(result, line, index, lines) {
            if (index === 0) {
                result.push(`import assert from 'assert';`);
            }
            if (index > lastImport) {
                switch (result.mode) {
                    case 'indent':
                        result.push(line.length === 0 ? '' : `    ${line}`);
                        if (index === lines.length -1) {
                            result.push('});\n');
                        }
                        break;
                    default:
                        result.push('');
                        result.push(`it('${testName}', () => {`);
                        result.push(line.length === 0 ? '' : `    ${line}`);
                        result.mode = 'indent';
                }
            } else {
                result.push(line);
            }
            return result;
        }, [])
        .join('\n');

    //console.log(result);

    return result;
};

/*
const amendImport = (example, packageName, mainFile) => {
	return example.replace(new RegExp("\'" + packageName + "\'"), "'../" + mainFile + "'");
};

const interceptConsoleLog = () => {


};

const convertToTest = (test, name) => {

	const testTemplate = `
import assert from 'assert';
${imports}
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

module.exports = function convertToTests(examples, libraryName, mainFile) {

	return examples.map(example => {

		let amendedImport = amendImport(example.code, libraryName, mainFile);
		let withAsserts = replacePrintsComment(amendedImport);
		let asTest = convertToTest(withAsserts, example.name);
		let formattedTest = asTest.trim();
		//console.log(formattedTest);
		return formattedTest;
	});
};

*/