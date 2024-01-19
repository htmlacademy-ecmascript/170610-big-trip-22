import dayjs from 'dayjs';

const isEventFuture = (date) => dayjs(date).diff(dayjs()) > 0;

const isEventPresent = (dateFrom, dateTo) => dayjs(dateFrom).diff(dayjs()) <= 0 && dayjs(dateTo).diff(dayjs()) >= 0;

const isEventPast = (date) => dayjs(date).diff(dayjs()) < 0;

export {
  isEventFuture,
  isEventPresent,
  isEventPast
};
