import { render, remove } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NoEventView from '../view/no-event-view.js';
import LoadingView from '../view/loading-view.js';
import ErrorLoadingView from '../view/error-loading-view.js';
import PointPresenter from './point-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
import { sortByDuration, sortByBasePrice } from '../utils/point.js';
import { filter } from '../utils/filter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {

  #boardContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #boardComponent = new BoardView();
  #eventsListComponent = new EventsListView();
  #loadingComponent = new LoadingView();
  #errorLoadingComponent = new ErrorLoadingView();
  #sortComponent = null;
  #noEventComponent = null;

  #eventPresenters = new Map();
  #newEventPresenter = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;

  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({
    boardContainer,
    pointsModel,
    destinationsModel,
    offersModel,
    filterModel,
    onNewEventDestroy
  }) {
    this.#boardContainer = boardContainer;

    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#newEventPresenter = new NewEventPresenter({
      eventListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewEventDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#offersModel.init();
    this.#destinationsModel.init();

  }

  get points() {
    this.#filterType = this.#filterModel.filter;

    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByDuration);
      case SortType.PRICE:
        return filteredPoints.sort(sortByBasePrice);
    }

    return filteredPoints;

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
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
  }

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {

    this.#uiBlocker.block();

    switch (actionType) {

      case UserAction.UPDATE_POINT:
        this.#eventPresenters.get(update.id).setSaving();

        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#eventPresenters.get(update.id).setAborting();
        }

        break;

      case UserAction.ADD_POINT:
        this.#newEventPresenter.setSaving();

        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newEventPresenter.setAborting();
        }

        break;

      case UserAction.DELETE_POINT:
        this.#eventPresenters.get(update.id).setDeleting();

        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#eventPresenters.get(update.id).setAborting();
        }

        break;
    }

    this.#uiBlocker.unblock();

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

  // #renderErrorLoading() {
  //   render(this.#errorLoadingComponent, this.#boardComponent.element);
  // }

  #clearBoard({ resetSortType = false } = {}) {

    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#errorLoadingComponent);

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
    const destinations = this.destinations;
    const offers = this.offers;

    const pointCount = points.length;
    // const destinationsCount = destinations.length;
    // const offersCount = offers.length;

    if (pointCount === 0) {
      this.#renderNoEvents();
      return;
    }

    // if (destinationsCount === 0 || offersCount === 0) {
    //   this.#renderErrorLoading();
    //   return;
    // }

    this.#renderSort();
    render(this.#eventsListComponent, this.#boardComponent.element);

    this.#renderPoints(
      points,
      destinations,
      offers
    );

  }

}
