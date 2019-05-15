const { guarantee, check, group } = require('../../../aprender/tests/node_modules/examinar');
const strUtils = require('../src/str-utils');

group('strUtils', () => {
  group('method: capitalizeFirstLetter', () => {
    check('capitalizes the first letter of a string', () => {
      guarantee(strUtils.capitalizeFirstLetter('why so serious?') === 'Why so serious?');
    });

    check('don\'t change the case of the remaining characters', () => {
      guarantee(strUtils.capitalizeFirstLetter('why So Serious?') === 'Why So Serious?');
    });
  });

  group('method: isBlank', () => {
    check('returns true when passing an empty string', () => {
      guarantee(strUtils.isBlank(''));
    });

    check('returns true when passing a string containing only spaces', () => {
      guarantee(strUtils.isBlank('      '));
    });

    check('returns false when passing a non-blank string', () => {
      guarantee(!strUtils.isBlank('whatever'));
    });
  });

  group('method: startsWith', () => {
    check('returns true when it starts with the passed string', () => {
      guarantee(strUtils.startsWith('Just when I...', 'Just'));
    });

    check('returns false when it contains the passed string, but doesn\'t start with it', () => {
      guarantee(!strUtils.startsWith('Just when I...', 'when I'));
    });

    check('returns false when it doesn\'t contain the passed string', () => {
      guarantee(!strUtils.startsWith('Just when I...', 'corleone'));
    });
  });
});