const strUtils = {};

strUtils.capitalizeFirstLetter = str => {
  return str ? str.charAt(0).toUpperCase() + str.slice : '';
}

strUtils.isBlank = str => {
  return str.trim().length === 0;
}

strUtils.startsWith = (str, sub) => {
  return str.indexOf(sub) === 0;
}

module.exports = strUtils;

