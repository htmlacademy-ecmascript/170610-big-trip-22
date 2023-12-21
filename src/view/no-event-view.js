import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const NoEventsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const createInfoViewTemplate = (filterType) => {

  const noEventsTextValue = NoEventsTextType[filterType];

  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
      <p class="trip-events__msg">${noEventsTextValue}</p>
  </section>`
  );
};

export default class NoEventView extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createInfoViewTemplate(this.#filterType);
  }

}
