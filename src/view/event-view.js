import AbstractView from '../framework/view/abstract-view.js';
import {
  humanizePointDateTime,
  humanizePointDateDate,
  humanizePointDateTimeType,
  humanizePointTimeDate,
  getFormattedDiffDuration,
  getTypeOffers,
  getDestinationName,
} from '../utils/point.js';

const createEventViewTemplate = (point, destinations, offers) => {

  const {
    basePrice,
    dateFrom,
    dateTo,
    type: pointType,
    isFavorite,
    destination: pointDestinationId,
    offers: pointOffersIds,
  } = point;

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn--active'
    : '';

  const destinationName = getDestinationName(pointDestinationId, destinations);

  const isSelectedOffers = () => Boolean(pointOffersIds.length);

  const typeOffers = getTypeOffers(pointType, offers);

  const selectedOffers = typeOffers.filter((offer) => pointOffersIds.includes(offer.id));

  const createEventSelectedOffersTemplate = (pointSelectedOffers) => (
    `${isSelectedOffers(pointOffersIds) ? `
            <ul class="event__selected-offers">
                ${pointSelectedOffers.map(({ title, price }) =>
      `<li class="event__offer">
                <span class="event__offer-title">${title}</span>
                +€
                <span class="event__offer-price">${price}</span>
              </li>`).join('')}
            </ul>`
      : ''}`
  );

  const selectedOffersTemplate = createEventSelectedOffersTemplate(selectedOffers);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${humanizePointDateTime(dateFrom)}">${humanizePointDateDate(dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${pointType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${pointType} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${humanizePointDateTimeType(dateFrom)}">${humanizePointTimeDate(dateFrom)}</time>
            —
            <time class="event__end-time" datetime="${humanizePointDateTimeType(dateTo)}">${humanizePointTimeDate(dateTo)}</time>
          </p>
          <p class="event__duration">${getFormattedDiffDuration(dateTo, dateFrom)}</p>
        </div>
        <p class="event__price">
          €&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>

         ${selectedOffersTemplate}

        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class EventView extends AbstractView {

  #point = null;
  #destinations = null;
  #offers = null;

  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({ point }, { destinations }, { offers }, { onEditClick }, { onFavoriteClick }) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createEventViewTemplate(
      this.#point,
      this.#destinations,
      this.#offers,
    );
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
