'use strict';

import fs from 'fs';
import path from 'path';
import rmdir from 'rmdir';

import extractExamples from './extractor/extract-examples';
import convertToTest from './converter/convert-to-test';
import mochaRunner from './runner/mocha-runner';

let packageJson;
fs.readFile('./package.json', 'utf8', (err, contents) => {
    packageJson = JSON.parse(contents);
});

module.exports = () => {
    fs.readFile('./README.md', 'utf8', (err, markdown) => {

        if (err) {
            console.error('Error reading README.md file');
            process.exit(1);
        }

        const examples = extractExamples(markdown);

        console.log(` Found ${examples.length} code examples.`);

        const tests = examples.map(example => convertToTest(example.code, example.name, packageJson.name, packageJson.main));

        console.log('\n==> Validating README examples...');

        try {

            const tempDir = './.tmp';

            fs.mkdirSync(tempDir);

            tests.map((test, index) => {
                fs.writeFileSync('./.tmp/example-' + (index + 1) + '.test.js', test);
            });

            require('babel-register');

            const files = fs.readdirSync(tempDir)
                .filter(file => file.substr(-3) === '.js')
                .map(file => path.join(tempDir, file));

            mochaRunner(files);

        } finally {
            rmdir('./.tmp', { fs: fs });
        }
    });
};
