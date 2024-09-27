const div = (child = "", attributes = {}) => {
  const div = document.createElement("div");
  if (typeof child === "string") {
    div.textContent = child;
  }
  const entries = Object.entries(attributes);
  entries.forEach(([key, value]) => {
    div.setAttribute(key, value);
  });
  return div;
};
