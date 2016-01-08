'use strict';

import Fragment from './vo/Fragment';
import Example from './vo/Example';

const extractHeaders = (markdown) => {

    let regex = /\s*#{1,4}\s*(.+)[^]/g;
    const fragments = [];
    let match = regex.exec(markdown);
    while (match) {
        fragments.push(new Fragment(match[1].trim(), match.index));
        match = regex.exec(markdown);
    }
    fragments.reverse();
    return fragments;
};

export default (markdown) => {

    let regex = /```\s*js(.|[^])*?```/g;
    const fragments = [];
    let match = regex.exec(markdown);
    while (match) {
        fragments.push(new Fragment(match[0], match.index));
        match = regex.exec(markdown);
    }

    const headers = extractHeaders(markdown);

    if (fragments.length > 0) {

        return fragments
            .map((fragment, index) => {

                const example = fragment.code;

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

                const code =  lines.join('').trim();
                const header = headers.find(h => h.index < fragment.index);
                return new Example(code, header ? header.code : 'Example ' + (index + 1));
            });

    } else {
        console.error('No code examples found.');
        return null;
    }
};