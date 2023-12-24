import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #offersApiService = null;
  #offers = [];

  constructor({ offersApiService }) {
    super();
    this.#offersApiService = offersApiService;

    this.#offersApiService.offers.then((offers) => {
      console.log(offers);
    });
  }


  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const offers = await this.#offersApiService.offers;
      this.#offers = offers;
    } catch (err) {
      this.#offers = [];
    }
  }
}
