import { render, replace } from '../framework/render.js';
import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';
import NoEventView from '../view/no-event-view.js';

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

  #renderSort() {
    render(this.#sortComponent, this.#boardComponent.element);
  }

  #renderPoint(point, destinations, offers) {

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const eventComponent = new EventView(
      { point },
      { destinations },
      { offers },
      {
        onEditClick: () => {
          replaceCardToForm();
          document.addEventListener('keydown', escKeyDownHandler);
        }
      }
    );

    const eventEditComponent = new EventEditView(
      { point },
      { destinations },
      { offers },
      {
        onFormSubmit: () => {
          replaceFormToCard();
          document.removeEventListener('keydown', escKeyDownHandler);
        }
      },
      {
        onCloseClick: () => {
          replaceFormToCard();
          document.removeEventListener('keydown', escKeyDownHandler);
        }
      }
    );

    function replaceCardToForm() {
      replace(eventEditComponent, eventComponent);
    }

    function replaceFormToCard() {
      replace(eventComponent, eventEditComponent);
    }

    render(eventComponent, this.#eventsListComponent.element);
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
