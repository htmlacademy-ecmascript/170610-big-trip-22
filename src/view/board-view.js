
import { createElement } from '../render.js';

const createBoardViewTemplate = () => (
  '<section class="trip-events"></section >'
);

export default class BoardView {
  getTemplate() {
    return createBoardViewTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
