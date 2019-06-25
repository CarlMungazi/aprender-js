 module.exports = function createElement (type, opts) {
  if (type == null || typeof type !== 'string') {
    throw Error('The element type must be a string');
  }

  if (arguments[1] !== undefined && Object.prototype.toString.call(opts) !== '[object Object]') { 
    throw Error('The options argument must be an object'); 
  }

  const { attrs = {}, children = [] } = opts || {};

  return {
    type,
    attrs,
    children
  }
}