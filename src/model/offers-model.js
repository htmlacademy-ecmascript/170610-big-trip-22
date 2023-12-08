import { generatedOffers } from '../mock/point.js';

export default class OffersModel {
  offers = generatedOffers;

  getOffers() {
    return this.offers;
  }
}
