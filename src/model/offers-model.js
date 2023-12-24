import Observable from '../framework/observable.js';
import { generatedOffers } from '../mock/point.js';

export default class OffersModel extends Observable {
  #offersApiService = null;
  #offers = generatedOffers;

  constructor({ offersApiService }) {
    super();
    this.#offersApiService = offersApiService;

    this.#offersApiService.offers.then((offers) => {
      console.log(offers);
      // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
      // а ещё на сервере используется snake_case, а у нас camelCase.
      // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
      // Есть вариант получше - паттерн "Адаптер"
    });
  }


  get offers() {
    return this.#offers;
  }
}
