import { generatedOffers } from '../mock/point.js';

export default class OffersModel {
  #offers = generatedOffers;

  get offers() {
    return this.#offers;
  }
}
