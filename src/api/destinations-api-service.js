import ApiService from '../framework/api-service.js';
import { METHOD, URL } from '../const.js';


export default class DestinationsApiService extends ApiService {
  get destinations() {
    return this._load({ url: `${URL.DESTINATIONS}` })
      .then(ApiService.parseResponse);
  }

  async updateDestination(destination) {
    const response = await this._load({
      url: `${URL.DESTINATIONS}/${destination.id}`,
      method: METHOD.PUT,
      body: JSON.stringify(destination),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }
}
