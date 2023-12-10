import { generatedDestinations } from '../mock/point';

export default class DestinationsModel {
  #destinations = generatedDestinations;

  get destinations() {
    return this.#destinations;
  }
}
