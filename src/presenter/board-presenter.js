import { render } from '../framework/render.js';
import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';

export default class BoardPresenter {

  #boardContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #boardComponent = new BoardView();
  #eventsListComponent = new EventsListView();

  #boardPoints = [];
  #boardDestinations = [];
  #boardOffers = [];

  constructor({ boardContainer, pointsModel, destinationsModel, offersModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {

    this.#boardPoints = [...this.#pointsModel.points];
    this.#boardDestinations = [...this.#destinationsModel.destinations];
    this.#boardOffers = [...this.#offersModel.offers];

    render(this.#boardComponent, this.#boardContainer);
    render(new SortView(), this.#boardComponent.element);
    render(this.#eventsListComponent, this.#boardComponent.element);

    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderPoint(this.#boardPoints[i], this.#boardDestinations, this.#boardOffers);
    }
  }

  #renderPoint(point, destinations, offers) {
    const pointComponent = new EventView({ point }, { destinations }, { offers });

    render(pointComponent, this.#eventsListComponent.element);
  }

}
