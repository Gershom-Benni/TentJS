function splitHTMLLines(htmlString) {
  const lines = htmlString.split('\n').map(line => line.trim()).filter(line => line);
  const parsedLines = lines.map(line => parseHTML(line));
  return parsedLines.filter(result => result !== null);
}

function html(htmlString, vdom) {
  const parsedLines = splitHTMLLines(htmlString);
  const newNodes = createNode(parsedLines);
  const newVDom = new vDom(newNodes);
  if (vdom) {
    vdom.diffAndUpdate(newVDom);
  } else {
    newVDom.render();
  }

  return newVDom;
}

function createNode(parsedLines) {
  return parsedLines.map(({ tagName, child, attributes }) =>
    new vNode(tagName, attributes, child)
  );
}

function parseHTML(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const element = doc.body.firstElementChild;

  if (!element) {
    return null;
  }

  const tagName = element.tagName.toLowerCase();
  const child = element.textContent.trim();
  const attributes = {};
  for (const attr of element.attributes) {
    attributes[attr.name] = attr.value;
  }

  return { tagName, child, attributes };
}

// Virtual DOM Node Class
class vNode {
  constructor(tagName, attributes = {}, textContent = null) {
    this.tagName = tagName;
    this.attributes = attributes;
    this.textContent = textContent;
  }

  isEqual(node) {
    if (this.tagName !== node.tagName) return false;
    if (this.textContent !== node.textContent) return false;

    const thisAttributes = Object.entries(this.attributes);
    const nodeAttributes = Object.entries(node.attributes);
    if (thisAttributes.length !== nodeAttributes.length) return false;

    return thisAttributes.every(([key, value]) => node.attributes[key] === value);
  }
}

// Virtual DOM Class
class vDom {
  constructor(nodes = []) {
    this.dom = nodes;
  }

  addNode(node) {
    this.dom.push(node);
  }

  diffAndUpdate(newVDom) {
    const minLength = Math.min(this.dom.length, newVDom.dom.length);

    for (let i = 0; i < minLength; i++) {
      const oldNode = this.dom[i];
      const newNode = newVDom.dom[i];

      if (!oldNode.isEqual(newNode)) {
        this.updateRealDOM(oldNode, newNode); 
        this.dom[i] = newNode;
      }
    }

    if (newVDom.dom.length > this.dom.length) {
      newVDom.dom.slice(this.dom.length).forEach(node => {
        this.addNode(node);
        this.createRealDOM(node);
      });
    }

    if (this.dom.length > newVDom.dom.length) {
      this.dom.slice(newVDom.dom.length).forEach(node => this.removeRealDOM(node));
      this.dom = this.dom.slice(0, newVDom.dom.length);
    }
  }

  updateRealDOM(oldNode, newNode) {
    const element = document.querySelector(
      `${oldNode.tagName}[${Object.entries(oldNode.attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')}]`
    );

    if (element) {
      Object.entries(newNode.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
      if (newNode.textContent !== oldNode.textContent) {
        element.textContent = newNode.textContent;
      }
    }
  }

  createRealDOM(node) {
    const element = document.createElement(node.tagName);
    Object.entries(node.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    element.textContent = node.textContent;
    document.body.appendChild(element);
  }

  removeRealDOM(node) {
    const element = document.querySelector(
      `${node.tagName}[${Object.entries(node.attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')}]`
    );

    if (element) {
      element.remove();
    }
  }

  render() {
    const fragment = document.createDocumentFragment();
    this.dom.forEach(node => {
      const element = document.createElement(node.tagName);
      Object.entries(node.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
      if (node.textContent) {
        element.textContent = node.textContent;
      }
      fragment.appendChild(element);
    });
    document.body.appendChild(fragment);
  }
}