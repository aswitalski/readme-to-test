'use strict';

const Example = require('./Example');

const extractExamples = (markdown) => {

	let regex = /```\s*js(.|[^])*?```/g;

  	let codeExamples = markdown.match(regex);

  	if (codeExamples) {

   		return codeExamples
            .map(example => {

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

  			    return lines.join('').trim();
     		})
            .map((code, index) => {
                return new Example(code, 'Example ' + (index + 1));
            });
        ;

  	} else {
  		console.error('No code examples found.');
  		return null;
  	}
};

module.exports = extractExamples;