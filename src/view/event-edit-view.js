import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {
  humanizePointInputDateTimeType,
  getPointDestinationName
} from '../utils/point.js';

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

  const {
    id: pointId,
    basePrice,
    dateFrom,
    dateTo,
    type: pointType,
    destination: pointDestinationId,
    offers: pointOffersIds,
    pointDestinationName,
  } = point;

  const pointTypeOffers = offers
    .find(({ type }) => type === pointType)
    ?.offers;

  const toUpperCaseFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  const createTypeListTemplate = () => (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
          ${offers.map(({ type }, index) =>
      `<div class="event__type-item">
        <input
          id="event-type-${type}-${index}"
          class="event__type-input visually-hidden"
          type="radio"
          name="event-type"
          value="${type}"
          ${type === pointType ? 'checked' : ''}>
        <label
          class="event__type-label event__type-label--${type}"
          for="event-type-${type}-${index}">
            ${toUpperCaseFirstLetter(type)}
        </label>
          </div>`
    ).join('')}

      </fieldset >
  </div > `
  );

  const typeListTemplate = createTypeListTemplate();

  const pointDestinationPhotos = destinations
    .find(({ id }) => id === pointDestinationId)
    ?.pictures;

  const createDestinationListTemplate = () => (
    `<datalist id="destination-list-${pointDestinationId}">
      ${destinations.map(({ name }) =>
      `<option value="${name}"</option>`
    ).join('')}
     </datalist > `
  );

  const destinationListTemplate = createDestinationListTemplate();

  const hasPointDestinationPhotos = Boolean(pointDestinationPhotos.length);

  const createDestinationPhotosTemplate = () => (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${hasPointDestinationPhotos ? pointDestinationPhotos.map(({ src, description }) =>
      `<img class="event__photo" src="${src}" alt="${description}">`
    ).join('')
      : ''}
      </div>
    </div`
  );

  const destinationPhotosTemplate = createDestinationPhotosTemplate();

  const pointDestination = destinations
    .find(({ id }) => id === pointDestinationId);

  const hasDestinationDescription = Boolean(pointDestination.description);

  const pointDestinationDescription = pointDestination.description;

  const createDestinationDescriptionTemplate = () => (
    `${hasDestinationDescription || hasPointDestinationPhotos ? `
      <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${pointDestinationDescription}</p>
           ${pointDestinationPhotos ? destinationPhotosTemplate : ''}
        </section>
      </section>
    ` : ''
    } `
  );

  const destinationDescriptionTemplate = createDestinationDescriptionTemplate();

  const hasPointTypeOffers = Boolean(pointTypeOffers.length);

  const createOffersSectionTemplateTemplate = () => (
    `${hasPointTypeOffers ? `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">

      ${pointTypeOffers.map(({ id, title, price }) => {

      const offerLastWord = title.split(' ').pop().replace(/-/g, '');
      const checked = pointOffersIds.includes(id) ? 'checked' : '';

      return `
          <div class="event__offer-selector">
            <input
              class="event__offer-checkbox visually-hidden"
              id="event-offer-${offerLastWord}-${id}"
              type="checkbox"
              name="event-offer-${offerLastWord}"
              ${checked}
            >
            <label class="event__offer-label"
              for="event-offer-${offerLastWord}-${id}">
              <span class="event__offer-title">${title}</span>
              +€&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
        </div>`;
    }).join('')}
          </div>
      </section>
    ` : ''
    } `
  );

  const offersSectionTemplate = createOffersSectionTemplateTemplate();

  return (
    `<li class="trip-events__item" >
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">

            <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="Event type icon">
            </label>

            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointId}" type="checkbox">

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

            <label class="visually-hidden" for="event-start-time-${pointId}">From</label>

            <input
              class="event__input event__input--time"
              id="event-start-time-${pointId}"
              type="text"
              name="event-start-time"
              value="${humanizePointInputDateTimeType(dateFrom)}">
              —
              <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
              <input
                class="event__input event__input--time"
                id="event-end-time-${pointId}"
                type="text"
                name="event-end-time"
                value="${humanizePointInputDateTimeType(dateTo)}">
              </div>

              <div class="event__field-group event__field-group--price">
                <label class="event__label" for="event-price-${pointId}">
                  <span class="visually-hidden">Price</span>
                  €
                </label>
                <input
                  class="event__input event__input--price"
                  id="event-price-${pointId}"
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

              ${offersSectionTemplate}

              ${destinationDescriptionTemplate}

        </form>
      </>`
  );
};

export default class EventEditView extends AbstractStatefulView {

  #point = null;
  #destinations = null;
  #offers = null;

  #handleFormSubmit = null;
  #handleCloseClick = null;

  constructor(
    { point = BLANK_POINT },
    { destinations },
    { offers },
    { onFormSubmit },
    { onCloseClick }
  ) {
    super();
    this._setState(EventEditView.parsePointToState(point, destinations));
    this.#destinations = destinations;
    this.#offers = offers;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;

    this._restoreHandlers();

  }

  get template() {
    return createEventEditViewTemplate(
      this._state,
      this.#destinations,
      this.#offers,
    );
  }

  reset(point) {
    this.updateElement(
      EventEditView.parsePointToState(point),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeClickHandler);
    this.element.querySelectorAll('.event__type-input').forEach((inputElement) => {
      inputElement.addEventListener('click', (evt) => {
        this.#eventTypeInputClickHandler(evt);
      });
    });
    this.element.querySelector('.event__input')
      .addEventListener('change', this.#destinationInputChangeHandler);
    this.element.querySelectorAll('.event__offer-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', (evt) => this.#offerCheckboxChangeHandler(evt));
    });
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputChangeHandler);

  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(
      EventEditView.parseStateToPoint(this._state),
      this.#destinations,
      this.#offers,
    );
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };


  #eventTypeInputClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };


  #destinationInputChangeHandler = (evt) => {
    evt.preventDefault();
    const datalist = evt.target.nextElementSibling;

    const prevDestinationOption = this._state.pointDestinationName;
    const selectedDestinationOption = Array.from(datalist.options).find((option) => option.value === evt.target.value);

    if (!selectedDestinationOption) {
      evt.target.value = prevDestinationOption;
    }

    const targetDestinationArray = this.#destinations.filter((destination) => destination.name === evt.target.value);

    const [{ id }] = targetDestinationArray;

    if (selectedDestinationOption) {
      this.updateElement({
        destination: id,
      });
    }

  };

  #priceInputChangeHandler = (evt) => {

    evt.preventDefault();

    evt.target.value = evt.target.value.replace(/[^0-9]/g, '');

    const prevBasePrice = this._state.basePrice;
    const nextBasePrice = evt.target.value;

    if (nextBasePrice === '') {
      evt.target.value = prevBasePrice;
    }

    if (nextBasePrice < 0) {
      evt.target.value = prevBasePrice;
    }

    if (nextBasePrice !== '' && nextBasePrice >= 0) {
      this._setState({
        basePrice: nextBasePrice,
      });
    }

  };

  #offerCheckboxChangeHandler = (evt) => {
    evt.preventDefault();
    const checkboxId = evt.target.id;

    const offerId = checkboxId.split('-').slice(3).join('-');

    const toggleId = (id) => {
      const newOffers = this._state.offers.includes(id)
        ? this._state.offers.filter((offer) => offer !== id)
        : [...this._state.offers, id];
      return newOffers;
    };

    this.updateElement({
      offers: toggleId(offerId),
    });

  };

  static parsePointToState(point, destinations) {

    return {
      ...point,
      pointDestinationName: getPointDestinationName(point.destination, destinations)
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    if (!point.pointDestinationName) {
      point.pointDestinationName = null;
    }

    delete point.pointDestinationName;

    return point;
  }

}
