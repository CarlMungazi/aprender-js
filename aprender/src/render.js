import copy from 'simple-deep-copy';

import mount from './mount';
import diff from './diff';
import patch from './patch';

function newCopy(target) {
  let value;
  let key;
  const copy = Array.isArray(target) ? [] : {};

  for (key in target) {
    value = target[key];
    copy[key] = (typeof value === "object") && !value.insertBefore ? newCopy(value) : value;
  }

  return copy;
}

const EventDictionary = {
  handleEvent (evt) {
    const eventHandler = this[`on${evt.type}`];
    const result = eventHandler.call(evt.currentTarget, evt);

    if (result === false) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  }
}

function renderElement(vNode) {
  const { type, attrs, children } = vNode;
  const $el = document.createElement(type);

  for (const [attribute, value] of Object.entries(attrs)) {
    if (attribute[0] === 'o' && attribute[1] === 'n') {
      const events = Object.create(EventDictionary);
      $el.addEventListener(attribute.slice(2), events)
      events[attribute] = value;
    }

    // make sure we are not setting props here as well because attrs.props is how
    // props are handled
    $el.setAttribute(attribute, value);
  }

  for (const child of children) {
    const childElement = render(child);
    $el.appendChild(childElement);
  }

  vNode.dom = $el;

  return $el;
};

function _render(vNode) {
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode);
  }

  return renderElement(vNode);
}

/*
  needs to distinguish between
  1. components
  2. vdom objects
  3. text nodes

  TO DO
  1. children only accepts strings at the moment for text nodes. what about numbers?
*/
function render(vNode, oldVNode = {}, $root, redraw = false) {

  // we are dealing with a component
  if (typeof vNode.type === 'function') {
    const Component = vNode.type;

    // the state property is being added dynamically
    vNode.state = vNode.state || {};

    // nextState is the new state object passed in at component level
    // we call render here but this needs to be a diff kind of render
    const updateFn = function updateFn(nextState) {
      vNode.previousState = newCopy(vNode.state);
      const oldVNode = newCopy(vNode);

      Object.assign(vNode.state, nextState);

      return render(vNode, oldVNode, null, true);
    }

    const renderedComponent = Component(vNode.state, updateFn);

    // the problem we have here is that during updates, vNode.previouslyRenderedComp contains
    // the full tree of components with their own previouslyRenderedComp property
    // renderedComponent does not contain that and so, we lose all the info on previouslyRenderedComp
    // for the children. Is this why it's better to store this on the dom?
    vNode.previouslyRenderedComp = {
      ...renderedComponent, 
      ...{ 
        dom: oldVNode.previouslyRenderedComp?.dom || null  
      } 
    };

    // this is when we want to render the dom element
    // it will go to the final else statement from this
    const element = render(
      vNode.previouslyRenderedComp, oldVNode.previouslyRenderedComp, null, redraw
    );

    if ($root) {
      mount(element, $root);
    } else {
      return element;
    }
  } else if (typeof vNode === 'string') {
    return document.createTextNode(vNode);
  } else {
    if (redraw) {
      // we need to ensure any components have a previouslyRenderedComp prop
      const diffObj = diff(oldVNode, vNode);
      patch(oldVNode.dom, diffObj);
    } else {
      return renderElement(vNode);
    }
  } 
};

module.exports = render;