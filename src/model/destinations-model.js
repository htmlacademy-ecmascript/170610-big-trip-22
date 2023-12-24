import Observable from '../framework/observable.js';
import { generatedDestinations } from '../mock/point';

export default class DestinationsModel extends Observable {
  #destinationsApiService = null;
  #destinations = generatedDestinations;

  constructor({ destinationsApiService }) {
    super();
    this.#destinationsApiService = destinationsApiService;

    this.#destinationsApiService.destinations.then((destinations) => {
      console.log(destinations);
      // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
      // а ещё на сервере используется snake_case, а у нас camelCase.
      // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
      // Есть вариант получше - паттерн "Адаптер"
    });
  }

  get destinations() {
    return this.#destinations;
  }
}
