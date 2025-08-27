function createDOMElement(
  type: string,
  classes?: string[],
  text?: string
): HTMLElement {
  const newItem = document.createElement(type);
  if (classes) {
    classes.forEach((itemClass) => {
      newItem.classList.add(itemClass);
    });
  }
  if (text) {
    newItem.innerText = text;
  }
  return newItem;
}
export default createDOMElement;
