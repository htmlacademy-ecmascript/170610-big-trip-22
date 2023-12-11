import { render } from '../framework/render.js';
import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NoEventView from '../view/no-event-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';

export default class BoardPresenter {

  #boardContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #boardComponent = new BoardView();
  #eventsListComponent = new EventsListView();
  #sortComponent = new SortView();
  #noEventComponent = new NoEventView();

  #boardPoints = [];
  #boardDestinations = [];
  #boardOffers = [];

  #eventPresenters = new Map();

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

    this.#renderBoard();

  }

  #handlePointChange = (updatedPoint, destinations, offers) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#eventPresenters.get(updatedPoint.id).init(updatedPoint, destinations, offers);
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderSort() {
    render(this.#sortComponent, this.#boardComponent.element);
  }

  #renderPoint(point, destinations, offers) {

    const pointPresenter = new PointPresenter({
      eventListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point, destinations, offers);

    this.#eventPresenters.set(point.id, pointPresenter);

  }

  #renderPoints(points) {
    points
      .forEach((point) => this.#renderPoint(
        point,
        this.#boardDestinations,
        this.#boardOffers,
      ));
  }

  #renderNoEvent() {
    render(this.#noEventComponent, this.#boardComponent.element);
  }

  #clearTaskList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #renderEventsList() {
    render(this.#eventsListComponent, this.#boardComponent.element);

    this.#renderPoints(
      this.#boardPoints
    );
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);

    if (this.#boardPoints.length) {
      this.#renderSort();
      this.#renderEventsList();
    } else {
      this.#renderNoEvent();
    }

  }

}
