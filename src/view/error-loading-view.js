import AbstractView from '../framework/view/abstract-view.js';

function createErrorLoadingTemplate() {
  return (
    `<p class="trip-events__msg">Destinations or Offers Error Loading :(</p>`
  );
}

export default class ErrorLoadingView extends AbstractView {
  get template() {
    return createErrorLoadingTemplate();
  }
}
