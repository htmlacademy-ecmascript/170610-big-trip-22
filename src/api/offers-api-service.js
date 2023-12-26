import ApiService from '../framework/api-service.js';
import { URL } from '../const.js';


export default class OffersApiService extends ApiService {
  get offers() {
    return this._load({ url: `${URL.OFFERS}` })
      .then(ApiService.parseResponse);
  }
}
