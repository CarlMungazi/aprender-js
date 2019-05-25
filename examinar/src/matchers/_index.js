const deepEqual = require('deep-equal');

// create module for error throwing
module.exports = {
  same(a, b) {
    if (a === b) return true;

    throw new Error(`The values are not the same.\n\n Found: ${a}\nWanted: ${b}`);
  },
  identical(a, b) {
    if (a == b) return true;

    throw new Error(`The values are not identical.\n\n Found: ${a}\nWanted: ${b}`);
  },
  deeplyIdentical(a, b) {
    if (deepEqual(a, b)) return true;

    throw new Error(`The values are not deeply identical.\n\nFound: ${
      JSON.stringify(a, null, 4)}\nWanted: ${JSON.stringify(b, null, 4)}
    `)
  },
  falsy(val) {
    if (!val) return true;

    throw new Error(`The value is truthy.\nValue: ${val}`);
  },
  truthy(val) {
    if (val) return true;

    throw new Error(`The value is falsy.\nValue: ${val}`);
  },
  throws(fn, errMsg = '') {
    const didNotThrowErr = new Error('The supplied function didn\'t throw an error');

    try {
      fn();
      throw didNotThrowErr;
    } catch (e) {
      if (e === didNotThrowErr) throw didNotThrowErr;

      if (!errMsg || e.message === errMsg) return true;

      throw new Error(`The error message is different from the expected one \n\nFound: ${e.message}\nWanted: ${errMsg}`);
    }
  }
}