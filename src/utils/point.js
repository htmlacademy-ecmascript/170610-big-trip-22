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
};
