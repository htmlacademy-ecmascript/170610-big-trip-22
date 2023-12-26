import ApiService from '../framework/api-service.js';
import { METHOD, URL } from '../const.js';


export default class OffersApiService extends ApiService {
  get offers() {
    return this._load({ url: `${URL.OFFERS}` })
      .then(ApiService.parseResponse);
  }

  async updateDestination(offer) {
    const response = await this._load({
      url: `${URL.OFFERS}/${offer.id}`,
      method: METHOD.PUT,
      body: JSON.stringify(offer),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }
}
