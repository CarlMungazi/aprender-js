const { guarantee } = require('examinar');
const numUtils = require('../src/num-utils');

// Group: isPrime method

// Test: returns true for prime numbers
guarantee(numUtils.isPrime(2));
guarantee(numUtils.isPrime(3));
guarantee(numUtils.isPrime(5));
guarantee(numUtils.isPrime(7));
guarantee(numUtils.isPrime(23));

// Test: returns false for non-prime numbers
guarantee(!numUtils.isPrime(4));
guarantee(!numUtils.isPrime(8));
guarantee(!numUtils.isPrime(10));
guarantee(!numUtils.isPrime(20));

guarantee(123 === 321);
