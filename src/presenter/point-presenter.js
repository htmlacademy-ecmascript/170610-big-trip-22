import { render, replace, remove } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';


export default class PointPresenter {
  #eventListContainer = null;
  #handleDataChange = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #point = null;
  #destinations = null;
  #offers = null;

  constructor({ eventListContainer, onDataChange }) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
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

    if (this.#eventListContainer.contains(prevEventComponent.element)) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#eventListContainer.contains(prevEventEditComponent.element)) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);

  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  #replaceCardToForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      { ...this.#point, isFavorite: !this.#point.isFavorite },
      this.#destinations,
      this.#offers,
    );
  };

  #handleFormSubmit = (point, destinations, offers) => {

    this.#handleDataChange(
      point,
      destinations,
      offers,
    );
    this.#replaceFormToCard();
  };

  #handleCloseClick = () => {
    this.#replaceFormToCard();
  };
}
