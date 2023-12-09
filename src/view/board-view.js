import AbstractView from '../framework/view/abstract-view.js';

const createBoardViewTemplate = () => (
  '<section class="trip-events"></section >'
);

export default class BoardView extends AbstractView {
  get template() {
    return createBoardViewTemplate();
  }
}
