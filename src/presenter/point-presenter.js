import { render, replace } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';


export default class PointPresenter {
  #eventListContainer = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #point = null;
  #destinations = null;
  #offers = null;

  constructor({ eventListContainer }) {
    this.#eventListContainer = eventListContainer;
  }

  init(point, destinations, offers) {

    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    this.#eventComponent = new EventView(
      { point: this.#point },
      { destinations: this.#destinations },
      { offers: this.#offers },
      { onEditClick: this.#handleEditClick },
    );

    this.#eventEditComponent = new EventEditView(
      { point: this.#point },
      { destinations: this.#destinations },
      { offers: this.#offers },
      { onFormSubmit: this.#handleFormSubmit },
      { onCloseClick: this.#handleCloseClick },
    );

    render(this.#eventComponent, this.#eventListContainer);
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

  #handleFormSubmit = () => {
    this.#replaceFormToCard();
  };

  #handleCloseClick = () => {
    this.#replaceFormToCard();
  };
}
