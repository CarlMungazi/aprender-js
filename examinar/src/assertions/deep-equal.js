function getLengthAndType(obj) {
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    return { type: "array", length: obj.length }
  }

  if (Object.prototype.toString.call(obj) === '[object Object]') {
    return { type: "object", length: Object.keys(obj).length }
  }

  return null;
}

function deepEqual(obj, comparisonObj) {
  const objInfo = getLengthAndType(obj);
  const comparisonObjInfo = getLengthAndType(comparisonObj); 

  // only go forward with arrays or objects
  if ( !objInfo || !comparisonObjInfo) {
    return false
  }

  if (objInfo.length !== comparisonObjInfo.length || objInfo.type !== comparisonObjInfo.type) {
    return false
  }
  
  const compare = (val, comparisonVal) => {
    const isArrayOrObject = getLengthAndType(val);
    const isFunction = Object.prototype.toString.call(val) === '[object Function]';
    
    if (isArrayOrObject) {
      if (!deepEqual(val, comparisonVal)) return false;
    } 
    
    else {
      if (isFunction) {        
        if (val.toString() !== comparisonVal.toString()) return false;
      } else {
        if (val !== comparisonVal) return false; // we are comparing primitive values
      }
    }
  };

  if (objInfo.type === 'array') {
    for (var i = 0; i < objInfo.length; i++) {
      if (compare(obj[i], comparisonObj[i]) === false) return false;
    }    
  } else {    
    for (let [key] of Object.entries(obj)) {
      if (compare(obj[key], comparisonObj[key]) === false) return false;
    }
  }

  return true; // nothing failed
}

module.exports = deepEqual;