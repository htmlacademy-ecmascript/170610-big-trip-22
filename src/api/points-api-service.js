import ApiService from '../framework/api-service.js';
import { METHOD, URL } from '../const.js';


export default class PointsApiService extends ApiService {
  get points() {
    return this._load({ url: `${URL.POINTS}` })
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: `${URL.DESTINATIONS}` })
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: `${URL.OFFERS}` })
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `${URL.POINTS}/${point.id}`,
      method: METHOD.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: `${URL.POINTS}`,
      method: METHOD.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `${URL.POINTS}/${point.id}`,
      method: METHOD.DELETE,
    });

    return response;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite,

    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }

}
