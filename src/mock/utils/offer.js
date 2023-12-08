import { nanoid } from 'nanoid';
import { getRandomInteger } from './common.js';

const generateOffer = (index, type) => ({
  id: nanoid(),
  title: `Offer ${index + 1} for ${type}`,
  price: getRandomInteger(10, 50),
});


export { generateOffer };
