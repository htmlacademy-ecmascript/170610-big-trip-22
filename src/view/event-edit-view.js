import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {
  humanizePointInputDateTimeType,
  getDestinationName,
  getTypeOffers,
  getDestinationPhotos,
  getDestinationObject,
  createTypeListTemplate,
  createDestinationListTemplate,
  createDestinationPhotosTemplate,
  createDestinationDescriptionTemplate,
  createOffersSectionTemplateTemplate,
} from '../utils/point.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createEventEditViewTemplate = (point, destinations, offers) => {

  const {
    id: pointId,
    basePrice,
    dateFrom,
    dateTo,
    type: pointType,
    destination: destinationId,
    offers: pointOffersIds,
    hasPointType,
    destinationName,
    typeOffers,
    hasTypeOffers,
    destinationDescription,
    hasDestinationDescription,
    destinationPhotos,
    hasDestinationPhotos,
  } = point;


  const typeListTemplate = createTypeListTemplate(offers, pointType);

  const destinationListTemplate = createDestinationListTemplate(hasPointType, destinations, destinationId);

  const destinationPhotosTemplate = createDestinationPhotosTemplate(hasDestinationPhotos, destinationPhotos);

  const destinationDescriptionTemplate = createDestinationDescriptionTemplate(
    hasDestinationDescription,
    hasDestinationPhotos,
    destinationDescription,
    destinationPhotos,
    destinationPhotosTemplate
  );

  const offersSectionTemplate = createOffersSectionTemplateTemplate(
    hasTypeOffers,
    typeOffers,
    pointOffersIds,
  );

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

            <label class="event__label  event__type-output" for="event-destination-${destinationId}">
              ${pointType}
            </label>

            <input
              class="event__input  event__input--destination"
              id="event-destination-${destinationId}"
              type="text"
              name="event-destination"
              value="${destinationName}"
              list="destination-list-${destinationId}">

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

  #destinations = null;
  #offers = null;

  #handleFormSubmit = null;
  #handleCloseClick = null;
  #handleDeleteClick = null;

  #datepicker = null;

  constructor(
    { point },
    { destinations },
    { offers },
    { onFormSubmit },
    { onCloseClick },
    { onDeleteClick },
  ) {
    super();

    this.#destinations = destinations;
    this.#offers = offers;

    this._setState(EventEditView.parsePointToState(
      point,
      destinations,
      offers,
    ));

    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();

  }

  get template() {
    return createEventEditViewTemplate(
      this._state,
      this.#destinations,
      this.#offers,
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset(point) {
    this.updateElement(
      EventEditView.parsePointToState(
        point,
        this.#destinations,
        this.#offers,
      ),
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
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    this.#setDateFromDatepicker();
    this.#setDateToDatepicker();

  }

  #formSubmitHandler = (evt) => {
    console.log('formSubmitHandler');
    evt.preventDefault();

    const destinationValue = this._state.destination?.trim();
    const dateFromValue = this._state.dateFrom?.trim();
    const dateToValue = this._state.dateTo?.trim();
    const basePriceValue = typeof this._state.basePrice === 'string' ? this._state.basePrice.trim() : this._state.basePrice;

    if (!destinationValue) {
      console.error('Поле "destination" не может быть пустым.');
      return;
    }

    if (!dateFromValue) {
      console.error('Поле "dateFrom" не может быть пустым.');
      return;
    }

    if (!dateToValue) {
      console.error('Поле "dateTo" не может быть пустым.');
      return;
    }

    if (!basePriceValue) {
      console.error('Поле "basePrice" не может быть пустым.');
      return;
    }

    this.#handleFormSubmit(
      EventEditView.parseStateToPoint(
        this._state,
        this.#destinations,
        this.#offers,
      ),
    );
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(
      EventEditView.parseStateToPoint(
        this._state,
      ));
  };

  #eventTypeInputClickHandler = (evt) => {
    evt.preventDefault();
    const type = evt.target.value;
    const typeOffers = getTypeOffers(type, this.#offers);
    const hasTypeOffers = Boolean(typeOffers.length);

    this.updateElement({
      type,
      offers: [],
      typeOffers,
      hasTypeOffers,
    });
  };

  #destinationInputChangeHandler = (evt) => {
    evt.preventDefault();

    let previousValue = this._state.destinationName;
    let inputValue = evt.target.value;

    // Преобразуем введенное значение в нижний регистр для регистронезависимой проверки
    const inputCityName = inputValue.toLowerCase();

    // Проверяем, входит ли введенное имя в список городов
    const isValidCity = this.#destinations.some((city) => city.name.toLowerCase() === inputCityName);

    if (!isValidCity) {
      // Если введенное значение не допустимо, возвращаем предыдущее значение
      inputValue = previousValue;
    } else {
      // Если введенное значение допустимо, обновляем предыдущее значение
      previousValue = inputValue;
    }

    // Устанавливаем значение инпута
    evt.target.value = inputValue;

    const foundCity = this.#destinations.find((city) => city.name === inputValue);

    const destinationObject = getDestinationObject(foundCity.id, this.#destinations);
    const destinationDescription = destinationObject.description;
    const hasDestinationDescription = Boolean(destinationObject.description);

    const destinationPhotos = getDestinationPhotos(foundCity.id, this.#destinations);
    const hasDestinationPhotos = Boolean(destinationPhotos.length);


    this.updateElement({
      destination: foundCity.id,
      destinationName: foundCity.name,
      destinationObject,
      destinationDescription,
      hasDestinationDescription,
      destinationPhotos,
      hasDestinationPhotos,
    });

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

  #setDateFromDatepicker() {
    if (this._state.dateFrom) {
      this.#datepicker = flatpickr(
        this.element.querySelector('input[name="event-start-time"]'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          // eslint-disable-next-line camelcase
          time_24hr: true,
          defaultDate: this._state.dateFrom,
          maxDate: this._state.dateTo,
          onChange: this.#dateFromChangeHandler,
        },
      );
    }
  }

  #dateFromChangeHandler = ([userDate]) => {
    if (!userDate) {
      console.error('Неверный формат даты.');
      return;
    }

    const formattedDate = userDate.toISOString();

    if (formattedDate.trim() === '') {
      console.error('Дата не может быть пустой.');
      return;
    }

    this.updateElement({
      dateFrom: formattedDate,
    });
  };

  #setDateToDatepicker() {
    if (this._state.dateTo) {
      this.#datepicker = flatpickr(
        this.element.querySelector('input[name="event-end-time"]'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          // eslint-disable-next-line camelcase
          time_24hr: true,
          defaultDate: this._state.dateTo,
          minDate: this._state.dateFrom,
          onChange: this.#dateToChangeHandler,
        },
      );
    }
  }

  #dateToChangeHandler = ([userDate]) => {
    if (!userDate) {
      console.error('Неверный формат даты.');
      return;
    }

    const formattedDate = userDate.toISOString();

    if (formattedDate.trim() === '') {
      console.error('Дата не может быть пустой.');
      return;
    }

    this.updateElement({
      dateTo: formattedDate,
    });
  };

  static parsePointToState(point, destinations, offers) {
    const hasPointType = Boolean(point.type);

    const typeOffers = getTypeOffers(point.type, offers);
    const hasTypeOffers = Boolean(typeOffers.length);

    const destinationObject = getDestinationObject(point.destination, destinations);
    const destinationDescription = destinationObject.description;
    const hasDestinationDescription = Boolean(destinationObject.description);

    const destinationPhotos = getDestinationPhotos(point.destination, destinations);
    const hasDestinationPhotos = Boolean(destinationPhotos.length);

    return {
      ...point,
      hasPointType,
      destinationName: getDestinationName(point.destination, destinations),
      typeOffers,
      hasTypeOffers,
      destinationObject,
      destinationDescription,
      hasDestinationDescription,
      destinationPhotos,
      hasDestinationPhotos,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    if (!point.hasPointType) {
      point.hasPointType = null;
    }

    if (!point.destinationName) {
      point.destinationName = null;
    }

    if (!point.typeOffers) {
      point.typeOffers = null;
    }

    if (!point.destinationObject) {
      point.destinationObject = null;
    }

    if (!point.destinationDescription) {
      point.destinationDescription = null;
    }

    if (!point.hasDestinationDescription) {
      point.hasDestinationDescription = null;
    }

    if (!point.destinationPhotos) {
      point.destinationPhotos = null;
    }

    if (!point.hasDestinationPhotos) {
      point.hasDestinationPhotos = null;
    }

    delete point.hasPointType;
    delete point.destinationName;
    delete point.typeOffers;
    delete point.destinationObject;
    delete point.destinationDescription;
    delete point.hasDestinationDescription;
    delete point.destinationPhotos;
    delete point.hasDestinationPhotos;

    return point;
  }

}
