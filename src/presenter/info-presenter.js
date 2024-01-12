import { render, replace, remove, RenderPosition } from '../framework/render.js';
import InfoView from '../view/info-view.js';
import { filter } from '../utils/filter.js';
import { FilterType } from '../const.js';

export default class InfoPresenter {

  #infoContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #infoComponent = null;

  #filterType = FilterType.EVERYTHING;

  constructor({
    infoContainer,
    pointsModel,
    destinationsModel,
    offersModel,
    filterModel,
  }) {
    this.#infoContainer = infoContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);

  }

  get points() {
    const points = this.#pointsModel.points;
    return points;

    // this.#filterType = this.#filterModel.filter;
    // const filteredPoints = filter[this.#filterType](points);
    // return filteredPoints;

  }

  get destinations() {
    const destinations = this.#destinationsModel.destinations;
    return destinations;
  }

  get offers() {
    const offers = this.#offersModel.offers;
    return offers;
  }

  init() {
    const points = this.points;
    const destinations = this.destinations;
    const offers = this.offers;

    const prevInfoComponent = this.#infoComponent;

    this.#infoComponent = new InfoView(
      {
        points: points,
        destinations: destinations,
        offers: offers,
      }
    );

    if (prevInfoComponent === null) {
      render(this.#infoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#infoComponent, prevInfoComponent);
    remove(prevInfoComponent);

    render(this.#infoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
  }

  #handleModelEvent = () => {
    this.init();
  };

}
