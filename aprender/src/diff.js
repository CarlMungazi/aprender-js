const render = require('./render');

function removeNode($node) {
  $node.remove();
  // the patch should return the new root node
  // but because there is none we will return undefined
  return undefined;
}

function renderNewTree(newTree, $node) {
  const $newNode = render(newTree);
  $node.replaceWith($newNode);
  return $newNode;
}

function diffAttributes(oldAttrs, newAttrs) {
  const patches = [];

  // set new attributes
  for (const [attribute, value] of Object.entries(newAttrs)) {
    patches.push($node => {
      $node.setAttribute(attribute, value);
      return $node;
    })
  }

  // remove attributes
  for (const attribute in oldAttrs) {
    if (!(attribute in newAttrs)) {
      patches.push($node => {
        $node.removeAttribute(attribute);
        return $node;
      })
    }
  }

  return $node => {
    for (const patch of patches) {
      patch($node);
    }

    return $node
  }
}

function diffChildren(oldChildren, newChildren) {
  function zipFn(xs, ys) {
    const zipped = [];
    for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
      zipped.push([xs[i], ys[i]]);
    }

    return zipped;
  }

  const childPatches = [];
  oldChildren.forEach((oldChild, idx) => {
    childPatches.push(performDiff(oldChild, newChildren[idx]))
  })

  const additionalPatches = [];
  for (const additionalChild of newChildren.slice(oldChildren.length)) {
    additionalPatches.push(($node => {
      $node.appendChild(render(additionalChild));
      return $node;
    }))
  }

  return $parent => {
    // child patches expecting the $child, not parent
    // so we cannot just loop through them & call patch($parent)
    for (const [patch, $child] of zipFn(childPatches, $parent.childNodes)) {
      patch($child);
    }

    for (const patch of additionalPatches) {
      patch($parent)
    }

    return $parent;
  }
}


/**
 * 
 * @param {object} oldTree - the current virtual dom tree
 * @param {object} newTree - the new virtual dom tree
 * @return {object} patches - an object containing the differences between the two trees
 */
function diff(oldTree, newTree) {
  // store the differences between the two trees
  const patches = {};
  performDiff(oldTree, newTree, patches)

  return patches;
}

/**
 * 
 * @param {object} oldTree - the current virtual dom tree
 * @param {object} newTree - the new virtual dom tree
 * @param {object} patches - the object which stores the changes between the trees
 */
function performDiff(oldTree, newTree, patches) {
  // if we are in a recursive call, we need to keep track of the changes that
  // need to be made
  const currentPatch = [];

  if (newTree === undefined) {
    // not sure what to do here?
    // this would mean the tree has been removed?
  }


  
  if (typeof oldTree === 'string' || typeof newTree === 'string') {
    if (oldTree !== newTree) {
      // they could have different values
        // or one tree is a text node and the other an element node
        // but render the new tree regardless
        return renderNewTree.bind(null, newTree)
    } else {
      // the trees are both strings with different values
      return $node => $node;
    }
  }

  if (oldTree.tagName !== newTree.tagName) {
    // assume they are different and do attempt to find differences
    // render the new tree and mount it
    return renderNewTree.bind(null, newTree)
  }

  // we also assume both objects share the same `tagName
  if (oldTree.attrs && newTree.attrs) {
    const patchAttrs = diffAttributes(oldTree.attrs, newTree.attrs);
    const patchChildren = diffChildren(oldTree.children, newTree.children);
  
    return $node => {
      patchAttrs($node);
      patchChildren($node);
      return $node;
    }
  }
}

module.exports = diff