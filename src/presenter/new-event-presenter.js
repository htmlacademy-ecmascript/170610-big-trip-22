import { remove, render, RenderPosition } from '../framework/render.js';
import NewEventView from '../view/new-event-view.js';
import { UserAction, UpdateType } from '../const.js';


export default class NewEventPresenter {
  #eventListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #newEventComponent = null;

  #point = null;
  #destinations = null;
  #offers = null;

  constructor({ eventListContainer, onDataChange, onDestroy }) {

    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;

  }

  init(point, destinations, offers) {

    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    if (this.#newEventComponent !== null) {
      return;
    }

    this.#newEventComponent = new NewEventView(
      { point: this.#point },
      { destinations: this.#destinations },
      { offers: this.#offers },
      { onFormSubmit: this.#handleFormSubmit },
      { onDeleteClick: this.#handleDeleteClick },
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

  setSaving() {
    this.#newEventComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
