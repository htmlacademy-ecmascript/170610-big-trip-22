import AbstractView from '../framework/view/abstract-view.js';

const createInfoViewTemplate = (points, destinations, offers) => {

  console.log(points);
  console.log(destinations);
  console.log(offers);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
      <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>
        <p class="trip-info__dates">18&nbsp;&mdash;&nbsp;20 Mar</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
      </p>
    </section>`
  );

};

export default class InfoView extends AbstractView {

  #points = null;
  #destinations = null;
  #offers = null;

  constructor({ points, destinations, offers }) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;

  }

  get template() {
    return createInfoViewTemplate(this.#points, this.#destinations, this.#offers);
  }

}
