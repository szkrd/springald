const assert = require('assert');
const multiHtmlUnderline = require('./multiHtmlUnderline');

let result;
let expected;
let desc;

desc = 'it should mark occurances of substrings with html underline tags: ';

result = multiHtmlUnderline('foo bar baz bar asd corge asd qux', ['bar', 'baz']);
expected = 'foo <u>bar</u> <u>baz</u> <u>bar</u> asd corge asd qux';
assert.equal(result, expected, desc + 'different needles in a haystack');

result = multiHtmlUnderline('foo bar baz', ['baz', 'foo']);
expected = '<u>foo</u> bar <u>baz</u>';
assert.equal(result, expected, desc + 'different needles in a haystack, start and end');

result = multiHtmlUnderline('foo bar baz bar asd corge asd qux', ['bar', 'bar', 'bar']);
expected = 'foo <u>bar</u> baz <u>bar</u> asd corge asd qux';
assert.equal(result, expected, desc + 'non unique needles');

result = multiHtmlUnderline('abcdefghijk', ['bcdef', 'cde', 'de']);
expected = 'a<u>bcdef</u>ghijk';
assert.equal(result, expected, desc + 'nested needles');

result = multiHtmlUnderline('abcdefghijk', 'bcdef');
expected = 'a<u>bcdef</u>ghijk';
assert.equal(result, expected, desc + 'one string');

result = multiHtmlUnderline('foo bar baz', 'qux');
expected = 'foo bar baz';
assert.equal(result, expected, desc + 'not found (irrelevant)');
