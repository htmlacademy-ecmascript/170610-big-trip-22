import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';

import { render } from '../render.js';

export default class BoardPresenter {
  boardComponent = new BoardView();
  eventsListComponent = new EventsListView();

  constructor({ boardContainer, pointsModel, destinationsModel, offersModel }) {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
  }

  init() {

    this.boardPoints = [...this.pointsModel.getPoints()];
    this.boardDestinations = [...this.destinationsModel.getDestinations()];
    this.boardOffers = [...this.offersModel.getOffers()];

    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());
    render(this.eventsListComponent, this.boardComponent.getElement());

    render(new EventEditView({ point: this.boardPoints[0] }, { destinations: this.boardDestinations }, { offers: this.boardOffers }), this.eventsListComponent.getElement());

    for (let i = 1; i < this.boardPoints.length; i++) {
      render(new EventView({ point: this.boardPoints[i] }, { destinations: this.boardDestinations }, { offers: this.boardOffers }), this.eventsListComponent.getElement());
    }

  }
}
