import { render, RenderPosition } from './framework/render.js';
import InfoView from './view/info-view.js';
import FiltersView from './view/filters-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';

const filters = [
  {
    type: 'everything',
    count: 1,
  },
  {
    type: 'future',
    count: 2,
  },
  {
    type: 'present',
    count: 3,
  },
  {
    type: 'past',
    count: 4,
  },
];

const pageBodyElement = document.querySelector('.page-body');

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();

console.log('filterModel', filterModel);

const pageHeaderElement = pageBodyElement.querySelector('.page-header');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripControlsFormElement = tripMainElement.querySelector('.trip-controls__filters');

const pageMainElement = pageBodyElement.querySelector('.page-main');
render(new InfoView(), tripMainElement, RenderPosition.AFTERBEGIN);

// const filters = generateFilter(pointsModel.points);

// render(new FiltersView({ filters }), tripControlsFormElement, RenderPosition.BEFOREEND);

render(new FiltersView({
  filters,
  currentFilterType: 'everything',
  onFilterTypeChange: () => { }
}), tripControlsFormElement, RenderPosition.BEFOREEND);

const tripEventsSectionElement = pageMainElement.querySelector('.trip-events');

const boardPresenter = new BoardPresenter({
  boardContainer: tripEventsSectionElement,
  pointsModel,
  destinationsModel,
  offersModel,
});


boardPresenter.init();

