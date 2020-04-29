const render = require('./render');

/**
 * @param {HTML element} rootDomNode - the HTML element being updated
 * @param {object} patches - the object which contains the changes being made
 * @return {void}
 */
function patch(rootDomNode, patches) {
  // keep track of where we are in the process
  const index = 0;
  performPatches(rootDomNode, patches, index)
}

/**
 * @param {HTML element} node - the HTML element being updated
 * @param {object} patches - the object which contains the changes being made
 * @param {index} index - a counter to store where we are in the process
 * @return {void}
 */
function performPatches(node, patches, index) {
  const currentPatches = patches[index];

  // does this node have any children?
  if (node.childNodes) {
    node.childNodes.forEach(node => {
      index++
      performPatches(node, patches, index)
    });
  }

  if (currentPatches) {
    applyPatches(node, currentPatches)
  }
}

/**
 * @param {HTML element} node - the HTML element being updated
 * @param {object} currentPatches - the object which contains the changes being made in the current iteration
 * @return {void}
 */
function applyPatches(node, currentPatches) {
  currentPatches.forEach(patch => {
    switch (patch.type) {
      case 'TEXT': {
        if (node.textContent) {
          node.textContent = patch.content
        }
        break;
      }
      case 'REPLACE': {
        const newNode = render(patch.node);
        node.parentNode.replaceChild(newNode, node);
        break;
      }
    }
  })
}

module.exports = patch