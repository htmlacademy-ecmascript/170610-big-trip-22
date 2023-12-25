import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class OffersModel extends Observable {
  #offersApiService = null;
  #offers = [];

  constructor({ offersApiService }) {
    super();
    this.#offersApiService = offersApiService;
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
    this._notify(UpdateType.INIT);
  }
}
