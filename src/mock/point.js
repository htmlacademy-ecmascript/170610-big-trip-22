import { getRandomInteger, getRandomArrayElement } from './utils/common.js';
import { getRandomDateFrom, getRandomDateTo } from './utils/point.js';
import { DESTINATIONS, TYPES } from './const.js';
import { generateDestination } from './destination.js';
import { generateOffer } from './utils/offer.js';
import { nanoid } from 'nanoid';


const generatedDestinations = DESTINATIONS
  .map((destination) => ({
    ...generateDestination(destination)
  }));


const generatedOffers = TYPES
  .map((type) => {
    const offersCount = getRandomInteger(0, 5);
    return {
      type,
      offers: Array.from({ length: offersCount }, (el, index) => ({
        id: nanoid(),
        ...generateOffer(index, type)
      }))
    };
  });


const generatePoint = () => {

  const pointType = getRandomArrayElement(TYPES);

  const matchingOffers = generatedOffers
    .find((offer) => offer.type === pointType);

  const offers = matchingOffers
    ? matchingOffers.offers.slice(0, getRandomInteger(0, matchingOffers.offers.length))
      .map((offer) => offer.id)
    : [];

  return {
    id: nanoid(),
    basePrice: getRandomInteger(400, 1100),
    dateFrom: getRandomDateFrom(),
    dateTo: getRandomDateTo(),
    destination: getRandomInteger(1, DESTINATIONS.length),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    type: pointType,
    offers: offers,
  };
};


export { generatePoint, generatedDestinations, generatedOffers };
