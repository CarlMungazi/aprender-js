function createVirtualElement (type, opts) {
  if ( type == null && (typeof type !== 'string' && typeof type !== 'function')) {
    throw Error('The element type must be a string or function');
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

module.exports = function h (type, opts) {
  return createVirtualElement(type, opts);
}