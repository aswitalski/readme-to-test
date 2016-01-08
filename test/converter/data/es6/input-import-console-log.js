import library from 'library-name';

if (conditionMet) {
    require('global-pollution');
}
const result = library.someFunction();

console.log(result);
// prints 'some-result'