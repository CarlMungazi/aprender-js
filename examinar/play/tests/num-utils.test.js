const { guarantee, check, xcheck, group } = require('examinar');
const numUtils = require('../src/num-utils');

group('numUtils', () => {
  group('method: isPrime', () => {
    xcheck('returns true for prime numbers', () => {
      guarantee(numUtils.isPrime(2));
      guarantee(numUtils.isPrime(3));
      guarantee(numUtils.isPrime(5));
      guarantee(numUtils.isPrime(7));
      guarantee(numUtils.isPrime(23));
    });

    check('this test should fail', () => {
      guarantee(123 === 321);
    });

    check('returns false for non-prime numbers', () => {
      guarantee(!numUtils.isPrime(4));
      guarantee(!numUtils.isPrime(8));
      guarantee(!numUtils.isPrime(10));
      guarantee(!numUtils.isPrime(20));
    });
  });

  group('matchers', () => {
    check('playing with the new matchers', () => {
      guarantee(123 === 123);
  
      guarantee.truthy('abc');
      guarantee.falsy(null);
  
      const a = { foo: 777 };
      const b = a;
  
      guarantee.same(a, b);
      guarantee.identical(undefined, null);
  
      const c = { foo: { baz: { bar: 1 } } };
      const d = Object.assign({}, c);
      guarantee.deeplyIdentical(c, d);
  
      function boom() { throw new Error('Some error...'); }
      guarantee.throws(boom);
      guarantee.throws(boom, 'Some error...');
    });
  });
});

