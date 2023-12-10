import { FilterType } from '../const.js';
import {
  compareDates,
  isEventFuture,
  isEventPresent,
  isEventPast
} from './point.js';


const filter = {
  [FilterType.EVERYTHING]: (points) => points.sort((a, b) => compareDates(a.dateFrom, b.dateFrom)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isEventFuture(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isEventPresent(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isEventPast(point.dateFrom)),
};

export { filter };
