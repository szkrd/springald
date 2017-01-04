const assert = require('assert');
const multiSplitSearch = require('./multiSplitSearch');

let result;
let desc;

desc = 'it should count occurances of substrings: ';

result = multiSplitSearch('foo bar baz bar asd corge asd qux', ['bar', 'baz']);
assert.equal(result, 3, desc + 'different needles in a haystack');

result = multiSplitSearch('foo bar baz', ['baz', 'foo']);
assert.equal(result, 2, desc + 'different needles in a haystack, start and end');

result = multiSplitSearch('foo bar baz bar asd corge asd qux', ['bar', 'bar', 'bar']);
assert.equal(result, 2, desc + 'non unique needles');

result = multiSplitSearch('abcdefghijk', ['bcdef', 'cde', 'de']);
assert.equal(result, 1, desc + 'nested needles');

result = multiSplitSearch('abcdefghijk', 'bcdef');
assert.equal(result, 1, desc + 'one string');

result = multiSplitSearch('foo bar baz', 'qux');
assert.equal(result, 0, desc + 'not found (irrelevant)');

result = multiSplitSearch('foo bar baz qux', ['foo', 'bar', 'baz', 'qux']);
assert.equal(result, 4, desc + 'all found (high score)');
