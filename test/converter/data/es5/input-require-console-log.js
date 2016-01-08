let keyPrefix = require('key-facsimile').prefix('MODE-');

const Consts = keyPrefix({
    MOBILE: null,
    TABLET: null,
    DESKTOP: null
});

console.log(Consts);
// prints { MOBILE: 'MODE-MOBILE', TABLET: 'MODE-TABLET', DESKTOP: 'MODE-DESKTOP' }
