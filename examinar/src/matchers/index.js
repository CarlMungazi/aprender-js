const deepEqual = require('deep-equal');

module.exports = {
  deeplyIdentical(a, b) {
    if (deepEqual(a, b)) return true;

    throw new Error(`The values are not deeply identical.\n\nFound: ${
      JSON.stringify(a, null, 4)}\nWanted: ${JSON.stringify(b, null, 4)}
    `)
  },
  throws(fn, errMsg = '') {
    const didNotThrowErr = new Error('The supplied function didn\'t throw an error');

    try {
      fn();
      throw didNotThrowErr;
    } catch (e) {
      if (e === didNotThrowErr) throw didNotThrowErr;

      if (!errMsg || e.message === errMsg) return true;

      throw new Error(`\n\nFound: ${e.message}\nWanted: ${errMsg}\n\n`); 
    }
  },
  isDomElement(element) {
    // this is quite tricky: https://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object/36894871#36894871
    // so we will take a naiive approach and do https://overreacted.io/why-do-react-elements-have-typeof-property/ ??
    return element.hasOwnProperty("$$dom");
  },
  isMounted(element) {
    // element needs to be given an ID so we can use get element by id to check
  }
}