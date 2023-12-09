import dayjs from 'dayjs';

const createRandomDateTimeGenerator = () => {
  let previousDateTime = dayjs();

  const getRandomDateTimeFrom = (isPast = Math.random() < 0.5) => {
    const randomDays = Math.floor(Math.random() * 30);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    const minutesDifference = randomDays * 24 * 60 + randomHours * 60 + randomMinutes;
    const multiplier = isPast ? -1 : 1;
    const newDateTime = previousDateTime.add(multiplier * minutesDifference, 'minute');
    previousDateTime = newDateTime;
    return newDateTime.toISOString();
  };

  const getRandomDateTimeTo = () => {
    const randomDays = Math.floor(Math.random() * 3);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    const minutesDifference = randomDays * 24 * 60 + randomHours * 60 + randomMinutes;
    const newDateTimeTo = previousDateTime.add(minutesDifference, 'minute');
    return newDateTimeTo.toISOString();
  };

  return { getRandomDateFrom: getRandomDateTimeFrom, getRandomDateTo: getRandomDateTimeTo };
};

const { getRandomDateFrom, getRandomDateTo } = createRandomDateTimeGenerator();

export { getRandomDateFrom, getRandomDateTo };
