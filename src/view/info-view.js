import AbstractView from '../framework/view/abstract-view.js';
import { getTotalPrice, getRoute } from '../utils/point.js';

const createInfoViewTemplate = ({ isEmpty, totalPrice, route }) => isEmpty ?
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">Loading...</h1>
      <p class="trip-info__dates">Loading...</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>
    </p>
  </section>` : `
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title" > ${route}</h1>
      <p class="trip-info__dates" > 18 & nbsp;& mdash;& nbsp; 20 Mar</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  </section>`;


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
    return createInfoViewTemplate({
      isEmpty: this.#points.length === 0 || this.#destinations.length === 0,
      totalPrice: getTotalPrice(this.#points, this.#offers),
      route: getRoute(this.#points, this.#destinations),
    });
  }

}
