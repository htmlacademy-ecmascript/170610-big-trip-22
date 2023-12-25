import AbstractView from '../framework/view/abstract-view.js';

function createErrorLoadingTemplate() {
  return (
    '<p class="trip-events__msg">Destinations data or Offers data Error Loading</p>'
  );
}

export default class ErrorLoadingView extends AbstractView {
  get template() {
    return createErrorLoadingTemplate();
  }
}
