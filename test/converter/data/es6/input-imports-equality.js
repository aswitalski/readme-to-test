import a from 'a';
import library from 'library-name';
import b from 'b';

if (conditionMet) {
    require('global-pollution');
}
const result = library.someFunction();
// result === 'some-result'