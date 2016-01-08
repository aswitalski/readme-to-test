'use strict';

require('babel-register');

const fs = require('fs');
const rmdir = require('rmdir');
const rootRequire = require('root-require');

const extractExamples = require('./extract-examples');
const convertToTests = require('./converter');

let packageJson;
fs.readFile('./package.json', 'utf8', (err, contents) => {
	packageJson = JSON.parse(contents);
});

const validate = () => {
    fs.readFile('./README.md', 'utf8', (err, markdown) => {

        if (err) {
            console.error('Error reading README.md file');
            process.exit(1);
        }

        const examples = extractExamples(markdown);

        console.log(` Found ${examples.length} code examples.`);

        const tests = examples.map(example =>  convertToTests(example.code, example.name, packageJson.name, packageJson.main));

  console.log('\n==> Validating README examples...\n');

	try {

		fs.mkdirSync('./.tmp');

		tests.map((test, index) => {
			fs.writeFileSync('./.tmp/example-' + (index + 1) + '.test.js', test);
		});

		require('./test-runner');

	} finally {
		rmdir('./.tmp', { fs: fs });
	}

  });
};

module.exports = validate;
