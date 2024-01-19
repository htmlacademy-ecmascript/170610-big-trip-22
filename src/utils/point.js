import dayjs from 'dayjs';
import { DESTINATIONS_ITEMS_COUNT } from '../const';
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

const sortByDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortByDuration = (pointA, pointB) => {
  const pointADuration = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const pointBDuration = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return dayjs(pointBDuration).diff(dayjs(pointADuration));
};

const sortByBasePrice = (pointA, pointB) =>
  pointB.basePrice - pointA.basePrice;

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const toUpperCaseFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const getDestinationName = (destinationId, destinations) => {
  if (!destinationId) {
    return '';
  }

  const foundDestination = destinations.find(({ id: pointDestinationId }) => pointDestinationId === destinationId);

  return foundDestination?.name || ''; // Если foundDestination равно undefined, вернем пустую строку
};

const getTypeOffers = (pointType, offers) => offers
  .find(({ type }) => type === pointType)
  ?.offers;

const getDestinationPhotos = (destinationId, pointDestinations) => {
  if (!destinationId) {
    return '';
  }

  const foundDestination = pointDestinations.find(({ id }) => id === destinationId);

  return foundDestination?.pictures || null;
};

const getFullDestination = (destinationId, pointDestinations) => {
  if (!destinationId) {
    return '';
  }

  return pointDestinations.find(({ id }) => id === destinationId) || null;
};

const getSelectedOffers = (typeOffers, pointOffersIds) => typeOffers?.filter((offer) => pointOffersIds?.includes(offer?.id)) || [];

const getCheckedOffers = (offers, type) => offers.find((offer) => type === offer.type)?.offers;
const getOffersPrice = (offerIDs = [], offers = []) => offerIDs.reduce((offerCost, id) => offerCost + (offers.find((offer) => offer.id === id)?.price ?? 0), 0);
const getTotalPrice = (points = [], offers = []) => points.reduce((total, point) => total + point.basePrice + getOffersPrice(point.offers, getCheckedOffers(offers, point.type)), 0);

const getRoute = (points = [], destinations = []) => {
  const destinationNames = points.map((point) => destinations.find((destination) => destination.id === point.destination)?.name);

  if (destinationNames.length <= DESTINATIONS_ITEMS_COUNT) {
    return destinationNames.join('&nbsp;&mdash;&nbsp;');
  } else {
    const truncatedNames = `${destinationNames[0]}&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;${destinationNames.slice(-1)}`;
    return truncatedNames;
  }
};

const getRouteDuration = (points = []) => points.length ? `${dayjs(points.at(0).dateFrom).format('DD MMM')}&nbsp;&mdash;&nbsp;${dayjs(points.at(-1).dateTo).format('DD MMM')}` : '';

const changeToDashesLowercase = (text) => text.toLowerCase().split(' ').pop().replace(/-/g, '');

const getDestinationById = (id, destinations) => {
  if (id) {
    return destinations.find((destination) => destination.id === id);
  }
  return '';
};

export {
  humanizePointDateTime,
  humanizePointDateDate,
  humanizePointDateTimeType,
  humanizePointTimeDate,
  getFormattedDiffDuration,
  humanizePointInputDateTimeType,
  compareDates,
  sortByDay,
  sortByDuration,
  sortByBasePrice,
  getDestinationName,
  isDatesEqual,
  getTypeOffers,
  getDestinationPhotos,
  getFullDestination,
  getSelectedOffers,
  toUpperCaseFirstLetter,
  getOffersPrice,
  getTotalPrice,
  getRoute,
  getRouteDuration,
  changeToDashesLowercase,
  getDestinationById
};
