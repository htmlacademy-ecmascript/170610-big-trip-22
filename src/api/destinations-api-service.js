import ApiService from '../framework/api-service.js';
import { URL } from '../const.js';


export default class DestinationsApiService extends ApiService {
  get destinations() {
    return this._load({ url: `${URL.DESTINATIONS}` })
      .then(ApiService.parseResponse);
  }
}
