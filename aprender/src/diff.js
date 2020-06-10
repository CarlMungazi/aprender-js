/**
 * 
 * @param {object} oldChildren - the current child tree
 * @param {object} newChildren - the new child tree
 * @param {object} patches - the object which stores the changes between the trees
 * @param {index} index - a counter to store where we are in the process
 */
function diffChildren(oldChildren, newChildren, patches, index) {
  oldChildren.forEach((oldChild, idx) => {
    index++
    performDiff(oldChild, newChildren[idx], patches, index)
  })
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
  // keep track of where we are in the process
  const index = 0;
  performDiff(oldTree, newTree, patches, index)

  return patches;
}

/**
 * 
 * @param {object} oldTree - the current virtual dom tree
 * @param {object} newTree - the new virtual dom tree
 * @param {object} patches - the object which stores the changes between the trees
 * @param {index} index - a counter to store where we are in the process
 */
function performDiff(oldTree, newTree, patches, index) {
  // if we are in a recursive call, we need to keep track of the changes that
  // need to be made
  const currentPatch = [];

  if (newTree === undefined) {
    // we do nothing here because the final else statement will deal with it
  } else if (typeof oldTree === 'string' && typeof newTree === 'string') {  // are we deal with text nodes?
    if (oldTree !== newTree) {
      // the trees are both strings with different values
      currentPatch.push({
        type: 'TEXT',
        content: newTree
      })
    }
  } else if (oldTree.type === newTree.type) {
    // what if only one of them has children?

    // let us work on the children 
    diffChildren(oldTree.children, newTree.children, patches, index)
  } else {
    // the trees are different, so out with the old and in with the new
    currentPatch.push({
      type: 'REPLACE',
      node: newTree
    })
  }

  // we have changes which need to be recorded
  if (currentPatch.length) {
    patches[index] = currentPatch
  }
}

module.exports = diff