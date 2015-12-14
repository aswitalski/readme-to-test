'use strict';

const fs = require('fs');

const extractExamples = (markdown) => {

	let regex = /```\s*js(.|[^])*?```/g;

  	let codeExamples = markdown.match(regex);

  	if (codeExamples) {

   		return codeExamples.map(example => {

  			let found = false;
  			let finished = false;
  			
  			let lines = example.match(/(.)*[^]/g).reduce((result, line) => {
  				if (finished === false) {
	  				if (line.match(/```/)) {
	  					if (found) {
	  						finished = true;
	  					}
	  				} else {
	  					result.push(line);
	  				}
  				}
				return result;
  			}, []);

  			const code = lines.join('').trim();

	  		console.log(code);
	  		console.log('--------------------------------');

	  		return code;
 		});

  	} else {
  		console.error('No code examples found.');
  		return null;
  	}
};

const validate = () => {
  console.log('\n==> Validating README examples...\n');

  fs.readFile('./README.md', 'utf8', (err, markdown) => {

  	if (err) {
  		console.error('Error reading README.md file');
  		process.exit(1);
  	}

  	const examples = extractExamples(markdown);

	console.log(` Found ${examples.length} code examples.`);

  });
};




validate();

module.exports = validate;
