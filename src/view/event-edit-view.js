
import { createElement } from '../render.js';
import { humanizePointInputDateTimeType } from '../utils.js';

const BLANK_POINT = {
  'id': '',
  'base_price': 0,
  'date_from': '',
  'date_to': '',
  'destination': '',
  'is_favorite': false,
  'offers': [],
  'type': ''
};

const createEventEditViewTemplate = (point, destinations, offers) => {

  console.log(point);
  console.log(destinations);
  console.log(offers);

  const {
    id: pointId,
    basePrice,
    dateFrom,
    dateTo,
    type: pointType,
    destination: pointDestinationId,
    offers: pointOffersIds,
  } = point;

  console.log(pointType);

  const pointTypeOffers = offers
    .find(({ type }) => type === pointType)
    ?.offers;

  console.log(pointTypeOffers);

  const toUpperCaseFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  const createEventTypeListTemplate = () => (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
          ${offers.map(({ type }) =>
      `<div class="event__type-item">
                  <input
                    id="event-type-${type}-${pointDestinationId}"
                    class="event__type-input visually-hidden"
                    type="radio"
                    name="event-type"
                    value="${type}"
                    ${type === pointType ? 'checked' : ''}>
                  <label
                    class="event__type-label event__type-label--${type}"
                    for="event-type-${type}-${pointDestinationId}">
                      ${toUpperCaseFirstLetter(type)}
                  </label>
             </div>`
    ).join('')}

      </fieldset >
  </div > `
  );

  const typeListTemplate = createEventTypeListTemplate();

  const pointDestinationName = destinations
    .find(({ id }) => id === pointDestinationId)
    ?.name;

  const createEventDestinationListTemplate = () => (
    `<datalist id="destination-list-${pointDestinationId}">
      ${destinations.map(({ name }) =>
      `<option value="${name}"</option>`
    ).join('')}
     </datalist > `
  );

  const destinationListTemplate = createEventDestinationListTemplate();

  const pointDestination = destinations
    .find(({ id }) => id === pointDestinationId);

  const hasDestinationDescription = Object.keys(pointDestination).some((key) => key === 'description');

  const pointDestinationDescription = pointDestination.description;

  const createDestinationDescriptionTemplate = () => (
    `${hasDestinationDescription ? `
      <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${pointDestinationDescription}</p>
        </section>
      </section>
    ` : ''} `
  );

  const destinationDescriptionTemplate = createDestinationDescriptionTemplate();


  return (
    `< li class="trip-events__item" >
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">

            <label class="event__type  event__type-btn" for="event-type-toggle-${pointDestinationId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="Event type icon">
            </label>

            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointDestinationId}" type="checkbox">

              ${typeListTemplate}

          </div>

          <div class="event__field-group  event__field-group--destination">

            <label class="event__label  event__type-output" for="event-destination-${pointDestinationId}">
              ${pointType}
            </label>

            <input
              class="event__input  event__input--destination"
              id="event-destination-${pointDestinationId}"
              type="text"
              name="event-destination"
              value="${pointDestinationName}"
              list="destination-list-${pointDestinationId}">

              ${destinationListTemplate}

          </div>

          <div class="event__field-group  event__field-group--time">

            <label class="visually-hidden" for="event-start-time-${pointDestinationId}">From</label>

            <input
              class="event__input event__input--time"
              id="event-start-time-${pointDestinationId}"
              type="text"
              name="event-start-time"
              value="${humanizePointInputDateTimeType(dateFrom)}">
              —
              <label class="visually-hidden" for="event-end-time-${pointDestinationId}">To</label>
              <input
                class="event__input event__input--time"
                id="event-end-time-${pointDestinationId}"
                type="text"
                name="event-end-time"
                value="${humanizePointInputDateTimeType(dateTo)}">
              </div>

              <div class="event__field-group event__field-group--price">
                <label class="event__label" for="event-price-${pointDestinationId}">
                  <span class="visually-hidden">Price</span>
                  €
                </label>
                <input
                  class="event__input event__input--price"
                  id="event-price-${pointDestinationId}"
                  type="text"
                  name="event-price"
                  value="${basePrice}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Delete</button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </header>

            <section class="event__details">
              <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                <div class="event__available-offers">
                  <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${pointDestinationId}" type="checkbox" name="event-offer-luggage" checked="">
                      <label class="event__offer-label" for="event-offer-luggage-${pointDestinationId}">
                        <span class="event__offer-title">Add luggage</span>
                        +€&nbsp;
                        <span class="event__offer-price">50</span>
                      </label>
                  </div>

                  <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-${pointDestinationId}" type="checkbox" name="event-offer-comfort" checked="">
                      <label class="event__offer-label" for="event-offer-comfort-${pointDestinationId}">
                        <span class="event__offer-title">Switch to comfort</span>
                        +€&nbsp;
                        <span class="event__offer-price">80</span>
                      </label>
                  </div>

                  <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-${pointDestinationId}" type="checkbox" name="event-offer-meal">
                      <label class="event__offer-label" for="event-offer-meal-${pointDestinationId}">
                        <span class="event__offer-title">Add meal</span>
                        +€&nbsp;
                        <span class="event__offer-price">15</span>
                      </label>
                  </div>

                  <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-${pointDestinationId}" type="checkbox" name="event-offer-seats">
                      <label class="event__offer-label" for="event-offer-seats-${pointDestinationId}">
                        <span class="event__offer-title">Choose seats</span>
                        +€&nbsp;
                        <span class="event__offer-price">5</span>
                      </label>
                  </div>

                  <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-${pointDestinationId}" type="checkbox" name="event-offer-train">
                      <label class="event__offer-label" for="event-offer-train-${pointDestinationId}">
                        <span class="event__offer-title">Travel by train</span>
                        +€&nbsp;
                        <span class="event__offer-price">40</span>
                      </label>
                  </div>
                </div>
              </section>

              ${destinationDescriptionTemplate}

          </form>
        </>`
  );
};

export default class EventEditView {

  constructor({ point = BLANK_POINT }, { destinations }, { offers }) {
    this.point = point;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate() {
    return createEventEditViewTemplate(
      this.point,
      this.destinations,
      this.offers,
    );
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
