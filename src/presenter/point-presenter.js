import { render, replace, remove } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #eventListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #point = null;
  #destinations = null;
  #offers = null;

  #mode = Mode.DEFAULT;

  constructor({ eventListContainer, onDataChange, onModeChange }) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point, destinations, offers) {

    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView(
      { point: this.#point },
      { destinations: this.#destinations },
      { offers: this.#offers },
      { onEditClick: this.#handleEditClick },
      { onFavoriteClick: this.#handleFavoriteClick },
    );

    this.#eventEditComponent = new EventEditView(
      { point: this.#point },
      { destinations: this.#destinations },
      { offers: this.#offers },
      { onFormSubmit: this.#handleFormSubmit },
      { onCloseClick: this.#handleCloseClick },
    );

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);

  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#eventEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFavoriteClick = () => {

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,

      { ...this.#point, isFavorite: !this.#point.isFavorite },

    );

  };

  #handleFormSubmit = (point) => {

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );

    this.#replaceFormToCard();
  };

  #handleCloseClick = () => {
    this.#replaceFormToCard();
  };
}
