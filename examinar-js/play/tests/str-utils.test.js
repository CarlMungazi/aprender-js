const { guarantee } = require('examinar');
const strUtils = require('../src/str-utils');

// Group: capitalizeFirstLetter method
// Test: capitalizes the first letter of a string
guarantee(strUtils.capitalizeFirstLetter('why so serious?') === 'Why so serious?');
// Test: don't change the case of the remaining characters
guarantee(strUtils.capitalizeFirstLetter('why So Serious?') === 'Why So Serious?');

// Group: isBlank method
// Test: returns true when passing an empty string
guarantee(strUtils.isBlank(''));
// Test: returns true when passing a string containing only spaces
guarantee(strUtils.isBlank('      '));
// Test: returns false when passing a non-blank string
guarantee(!strUtils.isBlank('whatever'));

// Group: startsWith method
// Test: returns true when it starts with the passed string
guarantee(strUtils.startsWith('Just when I...', 'Just'));
// Test: returns false when it contains the passed string, but doesn't start with it
guarantee(!strUtils.startsWith('Just when I...', 'when I'));
// Test: returns false when it doesn't contain the passed string
guarantee(!strUtils.startsWith('Just when I...', 'corleone'));