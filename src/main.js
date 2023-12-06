import InfoSectionView from './view/info-section-view.js';
import FiltersFormView from './view/filters-form-view.js';
import SortFormView from './view/sort-form-view.js';
import EventsListView from './view/events-list-view.js';
import EventView from './view/event-view.js';
import EventEditView from './view/event-edit-view.js';
import { render, RenderPosition } from './render.js';

const pageBodyElement = document.querySelector('.page-body');

const pageHeaderElement = pageBodyElement.querySelector('.page-header');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripControlsFormElement = tripMainElement.querySelector('.trip-controls__filters');

const pageMainElement = pageBodyElement.querySelector('.page-main');
const tripEventsSectionElement = pageMainElement.querySelector('.trip-events');

render(new InfoSectionView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new FiltersFormView(), tripControlsFormElement, RenderPosition.AFTERBEGIN);

render(new SortFormView(), tripEventsSectionElement);
render(new EventsListView(), tripEventsSectionElement);

const tripEventsListElement = pageMainElement.querySelector('.trip-events__list');

render(new EventEditView(), tripEventsListElement);
render(new EventView(), tripEventsListElement);
render(new EventView(), tripEventsListElement);
render(new EventView(), tripEventsListElement);

