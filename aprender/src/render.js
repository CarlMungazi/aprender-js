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

function renderElement({ type, attrs, children }) {
  const $el = document.createElement(type);

  for (const [attribute, value] of Object.entries(attrs)) {
    if (attribute[0] === 'o' && attribute[1] === 'n') {
      const events = Object.create(EventDictionary);
      $el.addEventListener(attribute.slice(2), events)
      events[attribute] = value;
    }

    $el.setAttribute(attribute, value);
  }
  for (const child of children) {
    $el.appendChild(render(child));
  }

  return $el;
};

function render(vNode) {
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode);
  }

  return renderElement(vNode);
};

module.exports = render;