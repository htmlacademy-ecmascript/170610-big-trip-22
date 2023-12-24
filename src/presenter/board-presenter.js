import { render, remove } from '../framework/render.js';
import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NoEventView from '../view/no-event-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
import { sortByDuration, sortByBasePrice } from '../utils/point.js';
import { filter } from '../utils/filter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';

export default class BoardPresenter {

  #boardContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #boardComponent = new BoardView();
  #eventsListComponent = new EventsListView();
  #loadingComponent = new LoadingView();

  #sortComponent = null;
  #noEventComponent = null;

  #eventPresenters = new Map();
  #newEventPresenter = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor({ boardContainer, pointsModel, destinationsModel, offersModel, filterModel, onNewEventDestroy }) {
    this.#boardContainer = boardContainer;

    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#newEventPresenter = new NewEventPresenter({
      destinations: this.#destinationsModel,
      offers: this.#offersModel,
      eventListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewEventDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

  }

  get points() {

    this.#filterType = this.#filterModel.filter;

    const points = this.#pointsModel.points;
    console.log('points', points);

    const filteredPoints = filter[this.#filterType](points);
    console.log('filteredPoints', filteredPoints);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByDuration);
      case SortType.PRICE:
        return filteredPoints.sort(sortByBasePrice);
    }

    return filteredPoints;

  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offers() {
    return this.#offersModel.offers;
  }


  init() {
    this.#renderBoard();
  }

  createEvent() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
  }

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    // console.log(updateType, data);

    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#eventPresenters.get(data.id).init(
          data,
          this.destinations,
          this.offers,
        );
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();

  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
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

  #renderPoints(points, destinations, offers) {
    points
      .forEach((point) => this.#renderPoint(
        point,
        destinations,
        offers,
      ));
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardComponent.element);
  }

  #renderNoEvents() {
    this.#noEventComponent = new NoEventView({
      filterType: this.#filterType
    });

    render(this.#noEventComponent, this.#boardComponent.element);
  }


  #clearBoard({ resetSortType = false } = {}) {

    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
    }


    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;

    console.log('points', points);

    const destinations = this.destinations;
    const offers = this.offers;

    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    render(this.#eventsListComponent, this.#boardComponent.element);

    this.#renderPoints(
      points,
      destinations,
      offers
    );

  }

}
