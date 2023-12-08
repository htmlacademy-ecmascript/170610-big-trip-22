import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';

import { render } from '../render.js';

export default class BoardPresenter {
  boardComponent = new BoardView();
  eventsListComponent = new EventsListView();

  constructor({ boardContainer, pointsModel }) {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
  }

  init() {

    this.boardPoints = [...this.pointsModel.getPoints()];

    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());
    render(this.eventsListComponent, this.boardComponent.getElement());

    render(new EventEditView(), this.eventsListComponent.getElement());

    for (let i = 0; i < this.boardPoints.length; i++) {
      render(new EventView({ task: this.boardPoints[i] }), this.eventsListComponent.getElement());
    }

  }
}
