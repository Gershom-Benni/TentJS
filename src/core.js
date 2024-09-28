const rootElement = document.createElement('div');
rootElement.id = 'root';
document.body.appendChild(rootElement); 
function html(htmlString, vdom = null) {
  const parsedLines = splitHTMLLines(htmlString);
  const newNodes = createNodes(parsedLines);

  if (vdom) {
    vdom.diffAndUpdate(newNodes);
  } else {
    vdom = new vDom(newNodes,rootElement);
    vdom.render();
  }

  return vdom;
}

function splitHTMLLines(htmlString) {
  const lines = htmlString
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);
  const parsedLines = lines.map((line) => parseHTML(line));
  return parsedLines.filter((result) => result !== null);
}

function createNodes(parsedLines) {
  return parsedLines.map(
    ({ tagName, child, attributes }) => new vNode(tagName, attributes, child)
  );
}

function parseHTML(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const element = doc.body.firstElementChild;

  if (!element) return null;

  const tagName = element.tagName.toLowerCase();
  const child = element.textContent.trim();
  const attributes = {};
  for (const attr of element.attributes) {
    attributes[attr.name] = attr.value;
  }

  return { tagName, child, attributes };
}

class vNode {
  constructor(tagName, attributes = {}, textContent = null) {
    this.tagName = tagName;
    this.attributes = attributes;
    this.textContent = textContent;
    this.el = null;
  }

  createElement() {
    this.el = document.createElement(this.tagName);
    Object.entries(this.attributes).forEach(([key, value]) => {
      this.el.setAttribute(key, value);
    });
    this.el.textContent = this.textContent;
    return this.el;
  }

  updateElement(newNode) {
    if (this.el && this.textContent !== newNode.textContent) {
      this.el.textContent = newNode.textContent;
    }
    Object.entries(newNode.attributes).forEach(([key, value]) => {
      if (this.el.getAttribute(key) !== value) {
        this.el.setAttribute(key, value);
      }
    });
  }

  isEqual(newNode) {
    return (
      this.tagName === newNode.tagName &&
      this.textContent === newNode.textContent &&
      JSON.stringify(this.attributes) === JSON.stringify(newNode.attributes)
    );
  }
}

class vDom {
  constructor(nodes = [], rootElement = null) {
    this.dom = nodes;
    this.rootElement = rootElement || document.createElement('div');
    document.body.appendChild(this.rootElement);
  }

  addNode(node) {
    this.dom.push(node);
  }

  diffAndUpdate(newNodes) {
    newNodes.forEach((newNode, index) => {
      const oldNode = this.dom[index];
      if (!oldNode) {
        this.addNode(newNode);
        this.mountNode(newNode);
      } else if (!oldNode.isEqual(newNode)) {
        oldNode.updateElement(newNode);
        this.dom[index] = newNode;
      }
    });

    if (this.dom.length > newNodes.length) {
      this.dom.slice(newNodes.length).forEach(node => this.removeNode(node));
      this.dom = this.dom.slice(0, newNodes.length);
    }
  }

  mountNode(node) {
    const element = node.createElement();
    this.rootElement.appendChild(element);
  }

  removeNode(node) {
    if (node.el) {
      node.el.remove();
    }
  }

  render() {
    this.dom.forEach(node => {
      if (!node.el) {
        this.mountNode(node);
      }
    });
  }
}

export { html };