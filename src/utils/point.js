import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';

dayjs.extend(isSameOrAfter);

const POINT_DATE_TIME_FORMAT = 'YYYY-MM-DD';
const POINT_DATE_DATE_FORMAT = 'MMM DD';
const POINT_TIME_FORMAT = 'HH:mm';
const POINT_DATE_TIME_TYPE_FORMAT = 'YYYY-MM-DDTHH:mm';

const POINT_INPUT_DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';

const humanizePointDateTime = (pointDate) => pointDate ? dayjs(pointDate).format(POINT_DATE_TIME_FORMAT) : '';
const humanizePointDateDate = (pointDate) => pointDate ? dayjs(pointDate).format(POINT_DATE_DATE_FORMAT) : '';
const humanizePointTimeDate = (pointDate) => pointDate ? dayjs(pointDate).format(POINT_TIME_FORMAT) : '';
const humanizePointDateTimeType = (pointDate) => pointDate ? dayjs(pointDate).format(POINT_DATE_TIME_TYPE_FORMAT) : '';

const humanizePointInputDateTimeType = (pointDate) => pointDate ? dayjs(pointDate).format(POINT_INPUT_DATE_TIME_FORMAT) : '';

const getFormattedDiffDuration = (dateTo, dateFrom) => {

  const durationInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  const minutes = durationInMinutes % 60;
  const hours = Math.floor(durationInMinutes / 60) % 24;
  const days = Math.floor(durationInMinutes / (60 * 24));

  const formatValue = (value) => (value < 10 ? `0${value}` : value);

  if (durationInMinutes < 60) {
    return `${formatValue(minutes)}M`;
  } else if (durationInMinutes < 60 * 24) {
    return `${formatValue(hours)}H ${formatValue(minutes)}M`;
  } else {
    return `${formatValue(days)}D ${formatValue(hours)}H ${formatValue(minutes)}M`;
  }

};

const compareDates = (dateA, dateB) => dayjs(dateA).isBefore(dayjs(dateB)) ? -1 : 1;
const isEventFuture = (date) => dayjs(date).isAfter(dayjs());
const isEventPresent = (date) => dayjs(date).isSameOrAfter(dayjs(), 'day');
const isEventPast = (date) => dayjs(date).isBefore(dayjs(), 'day');

const calculateDurationInSeconds = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  return end.diff(start, 'second');
};

const sortByDuration = (pointA, pointB) => {
  const durationA = calculateDurationInSeconds(pointA.dateFrom, pointA.dateTo);
  const durationB = calculateDurationInSeconds(pointB.dateFrom, pointB.dateTo);

  return durationB - durationA;
};

const sortByBasePrice = (pointA, pointB) =>
  pointB.basePrice - pointA.basePrice;

const getDestinationName = (destinationId, destinations) => destinations
  .find(({ id: pointDestinationId }) => pointDestinationId === destinationId)
  ?.name;

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const toUpperCaseFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const getTypeOffers = (pointType, offers) => offers
  .find(({ type }) => type === pointType)
  ?.offers;

const getDestinationPhotos = (destinationId, pointDestinations) => pointDestinations
  .find(({ id }) => id === destinationId)
  ?.pictures;

const getDestinationObject = (destinationId, pointDestinations) => pointDestinations
  .find(({ id }) => id === destinationId);

const createTypeListTemplate = (offers, pointType) => (
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

const createDestinationListTemplate = (destinations, destinationId) => (
  `<datalist id="destination-list-${destinationId}">
    ${destinations.map(({ name }) =>
    `<option value="${name}"</option>`
  ).join('')}
   </datalist > `
);

const createDestinationPhotosTemplate = (hasDestinationPhotos, destinationPhotos) => (
  `${hasDestinationPhotos ?
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${destinationPhotos.map(({ src, description }) => `<img class="event__photo" src="${src}" alt="${description}">`).join('')}
      </div>
    </div>`
    : ''}`
);

const createDestinationDescriptionTemplate = (
  hasDestinationDescription,
  hasDestinationPhotos,
  destinationDescription,
  destinationPhotos,
  destinationPhotosTemplate
) => (
  `${hasDestinationDescription || hasDestinationPhotos ? `
    <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destinationDescription}</p>
         ${destinationPhotos ? destinationPhotosTemplate : ''}
      </section>
    </section>
  ` : ''
  } `
);


export {
  humanizePointDateTime,
  humanizePointDateDate,
  humanizePointDateTimeType,
  humanizePointTimeDate,
  getFormattedDiffDuration,
  humanizePointInputDateTimeType,
  compareDates,
  isEventFuture,
  isEventPresent,
  isEventPast,
  sortByDuration,
  sortByBasePrice,
  getDestinationName,
  isDatesEqual,
  getTypeOffers,
  getDestinationPhotos,
  getDestinationObject,
  createTypeListTemplate,
  createDestinationListTemplate,
  createDestinationPhotosTemplate,
  createDestinationDescriptionTemplate,
};
