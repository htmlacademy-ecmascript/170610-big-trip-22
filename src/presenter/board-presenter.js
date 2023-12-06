import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';

import { render } from '../render.js';

export default class BoardPresenter {
  boardComponent = new BoardView();
  eventsListComponent = new EventsListView();

  constructor({ boardContainer }) {
    this.boardContainer = boardContainer;
  }

  init() {

    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());
    render(this.eventsListComponent, this.boardComponent.getElement());

    render(new EventEditView(), this.eventsListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventView(), this.eventsListComponent.getElement());
    }

  }
}
