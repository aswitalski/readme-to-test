'use strict';

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

	  		// console.log(code);
	  		// console.log('--------------------------------');

	  		return code;
 		});

  	} else {
  		console.error('No code examples found.');
  		return null;
  	}
};

extractExamples.withNames = () => {
  throw 'Not implemented!';
};

module.exports = extractExamples;