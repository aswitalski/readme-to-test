'use strict';

import fs from 'fs';
import rmdir from 'rmdir';

import extractExamples from './extractor/extract-examples';
import convertToTest from './converter/convert-to-test';
import mochaRunner from './runner/mocha-runner';

const loadPackageJson = new Promise((resolve, reject) => {
    fs.readFile('./package.json', 'utf8', (err, contents) => {
        if (err) {
            reject(err);
        } else {
            resolve(JSON.parse(contents));
        }
    });
});

const loadReadMe = new Promise((resolve, reject) => {
    fs.readFile('./README.md', 'utf8', (err, markdown) => {
        if (err) {
            reject(err);
        } else {
            resolve(markdown);
        }
    });
});

const loadOptions = new Promise(resolve => {
   resolve({
     tempDir: './.tmp/'
   });
});

module.exports = () => {

    Promise.all([loadPackageJson, loadReadMe, loadOptions]).then(([packageJson, markdown, options]) => {

        const examples = extractExamples(markdown);
        const tests = examples.map(example => convertToTest(example.code, example.name, packageJson.name, packageJson.main));

        console.log(`\n==> Validating ${examples.length} README examples...`);

        try {

            fs.mkdirSync(options.tempDir);

            const testFileNames = tests.map(function writeTestsToFiles(test, index) {
                const path = options.tempDir.concat('example-' + (index + 1) + '.test.js');
                fs.writeFileSync(path, test);
                return path;
            });

            mochaRunner(testFileNames);

        } finally {
            rmdir(options.tempDir, { fs: fs });
        }

    }).catch((err) => {

        console.error(err);
    });
};
