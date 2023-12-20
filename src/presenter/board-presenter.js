import { render } from '../framework/render.js';
import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NoEventView from '../view/no-event-view.js';
import PointPresenter from './point-presenter.js';
import { sortByDuration, sortByBasePrice } from '../utils/point.js';
import { SortType } from '../const.js';

export default class BoardPresenter {

  #boardContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #boardComponent = new BoardView();
  #eventsListComponent = new EventsListView();
  #noEventComponent = new NoEventView();
  #sortComponent = null;

  #boardDestinations = [];
  #boardOffers = [];

  #eventPresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor({ boardContainer, pointsModel, destinationsModel, offersModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {

    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortByDuration);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortByBasePrice);
    }

    return this.#pointsModel.points;

  }

  init() {

    this.#boardDestinations = [...this.#destinationsModel.destinations];
    this.#boardOffers = [...this.#offersModel.offers];

    this.#renderBoard();

  }

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint, destinations, offers) => {
    // Здесь будем вызывать обновление модели

    this.#eventPresenters.get(updatedPoint.id).init(updatedPoint, destinations, offers);
  };

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearEventsList();
    this.#renderEventsList();

  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardComponent.element);
  }

  #renderPoint(point, destinations, offers) {

    const pointPresenter = new PointPresenter({
      eventListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
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

  #renderNoEvents() {
    render(this.#noEventComponent, this.#boardComponent.element);
  }

  #clearEventsList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #renderEventsList() {
    const points = this.points;

    render(this.#eventsListComponent, this.#boardComponent.element);

    this.#renderPoints(points);
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);

    if (this.points.length) {
      this.#renderSort();
      this.#renderEventsList();
    } else {
      this.#renderNoEvents();
    }

  }

}
