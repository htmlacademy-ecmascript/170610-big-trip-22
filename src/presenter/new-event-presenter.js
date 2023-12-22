import { remove, render, RenderPosition } from '../framework/render.js';
import NewEventView from '../view/new-event-view.js';
import { nanoid } from 'nanoid';
import { UserAction, UpdateType } from '../const.js';


const BLANK_POINT = {
  'id': '',
  'base_price': 0,
  'date_from': '',
  'date_to': '',
  'destination': '',
  'is_favorite': false,
  'offers': [],
  'type': ''
};

export default class NewEventPresenter {
  #eventListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #newEventComponent = null;

  #destinations = null;
  #offers = null;

  constructor({ destinations, offers, eventListContainer, onDataChange, onDestroy }) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {

    if (this.#newEventComponent !== null) {
      return;
    }

    this.#newEventComponent = new NewEventView(
      { point: BLANK_POINT },
      { destinations: this.#destinations },
      { offers: this.#offers },
      { onFormSubmit: this.#handleFormSubmit },
      { onDeleteClick: this.#handleDeleteClick }
    );

    render(this.#newEventComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#newEventComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#newEventComponent);
    this.#newEventComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    console.log('handleFormSubmit', point);
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      // Пока у нас нет сервера, который бы после сохранения
      // выдывал честный id задачи, нам нужно позаботиться об этом самим
      { id: nanoid(), ...point },
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    console.log('destroy');
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
