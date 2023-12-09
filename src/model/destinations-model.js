import { generatedDestinations } from '../mock/point';

export default class DestinationsModel {
  destinations = generatedDestinations;

  get = () => this.destinations;

  getDestinations() {
    return this.destinations;
  }
}
