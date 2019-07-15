const deepEqual = require('./deep-equal');

module.exports = {
  isDeeplyEqual(a, b) {
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
    if (element.hasOwnProperty("$$dom") && element.$$dom) return true;

    throw new Error('The supplied element is not a DOM element')
  },
  isMounted(element, parentElement) {
    if (parentElement.childNodes.length > 1) throw new Error('The root element has more than one child');

    if (parentElement.childNodes[0] === element) return true;

    throw new Error('The supplied element has not been mounted');
  }
}