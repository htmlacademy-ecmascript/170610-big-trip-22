import { getRandomInteger, getRandomArrayElement } from './utils/common.js';
import { TEXT } from './const.js';
import { nanoid } from 'nanoid';

const descriptions = Array.from(TEXT.split('.').filter(Boolean).map((el) => el.trim()));
const generateDescriptionText = () => Array.from({ length: getRandomInteger(1, 3) }, () => getRandomArrayElement(descriptions)).join('. ').concat('.');

const generatePicture = () => ({
  src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 100)}`,
  description: generateDescriptionText(),
});

const generatePictures = () => Array.from({ length: getRandomInteger(1, 5) }, () => generatePicture());

const generateDescription = (el) => ({
  description: `${el} - ${generateDescriptionText()}`,
  pictures: generatePictures()
});

const generateDestination = (destination) => {
  const isDescription = getRandomInteger(0, 1);

  return {
    id: nanoid(),
    name: destination,
    ...isDescription ? generateDescription(destination) : {}
  };
};

export { generateDestination };