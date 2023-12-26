const OFFERS_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortType = {
  DEFAULT: 'default',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const BLANK_POINT = {
  'basePrice': 0,
  'dateFrom': '',
  'dateTo': '',
  'destination': '',
  'isFavorite': false,
  'offers': [],
  'type': 'flight'
};

const METHOD = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const URL = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};

export {
  OFFERS_TYPES,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  BLANK_POINT,
  METHOD,
  URL,
};
