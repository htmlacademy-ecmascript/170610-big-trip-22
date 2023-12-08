import { getRandomArrayElement } from '../utils.js';
import { OFFERS_TYPES } from '../const.js';
import { nanoid } from 'nanoid';

const mockPoints = [
  {
    'id': nanoid(),
    'basePrice': 1100,
    'dateFrom': '2019-07-10T22:55:56.845Z',
    'dateTo': '2019-07-11T11:22:13.375Z',
    'destination': nanoid(),
    'isFavorite': false,
    'offers': [
      'b4c3e4e6-9053-42ce-b747-e281314baa31'
    ],
    'type': getRandomArrayElement(OFFERS_TYPES)
  },
  {
    'id': nanoid(),
    'basePrice': 1200,
    'dateFrom': '2019-07-10T22:55:56.845Z',
    'dateTo': '2019-07-11T11:22:13.375Z',
    'destination': nanoid(),
    'isFavorite': true,
    'offers': [
      nanoid(),
    ],
    'type': getRandomArrayElement(OFFERS_TYPES)
  },
  {
    'id': nanoid(),
    'basePrice': 1300,
    'dateFrom': '2019-07-10T22:55:56.845Z',
    'dateTo': '2019-07-11T11:22:13.375Z',
    'destination': nanoid(),
    'isFavorite': false,
    'offers': [
      nanoid(),
    ],
    'type': getRandomArrayElement(OFFERS_TYPES)
  },
  {
    'id': nanoid(),
    'basePrice': 1400,
    'dateFrom': '2019-07-10T22:55:56.845Z',
    'dateTo': '2019-07-11T11:22:13.375Z',
    'destination': nanoid(),
    'isFavorite': true,
    'offers': [
      nanoid(),
    ],
    'type': getRandomArrayElement(OFFERS_TYPES)
  },
];


const getRandomPoint = () => getRandomArrayElement(mockPoints);

export { getRandomPoint };
