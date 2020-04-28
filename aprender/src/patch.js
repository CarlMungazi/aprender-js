const render = require('./render');

function patch(rootDomNode, patches) {
  const walker = 0;
  performPatches(rootDomNode, patches, walker)
}

function performPatches(node, patches, walker) {
  const currentPatches = patches[walker];

  // does this node have any children?
  if (node.childNodes) {
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      walker++;
      performPatches(child, patches, walker)
    }
  }

  if (currentPatches) {
    applyPatches(node, currentPatches)
  }
}

function applyPatches(node, currentPatches) {
  function each(array, fn) {
    for (let i = 0, length = array.length; i < length; i++) {
      fn(array[i], i)
    }
  }

  each(currentPatches, function renderNewDomElement(currentPatch) {
    switch(currentPatch.type) {
      case 'TEXT': {
        if (node.textContent) {
          node.textContent = currentPatch.content
        }
        break;
      }
      case 'REPLACE': {
        const newNode = render(currentPatch.node);
        node.parentNode.replaceChild(newNode, node);
        break;
      }
    }
  })
}

module.exports = patch