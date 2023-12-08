import InfoView from './view/info-view.js';
import FiltersView from './view/filters-view.js';
import { render, RenderPosition } from './render.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';

const pageBodyElement = document.querySelector('.page-body');

const pointsModel = new PointsModel();

const pageHeaderElement = pageBodyElement.querySelector('.page-header');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripControlsFormElement = tripMainElement.querySelector('.trip-controls__filters');

const pageMainElement = pageBodyElement.querySelector('.page-main');
render(new InfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new FiltersView(), tripControlsFormElement, RenderPosition.AFTERBEGIN);


const tripEventsSectionElement = pageMainElement.querySelector('.trip-events');

const boardPresenter = new BoardPresenter({
  boardContainer: tripEventsSectionElement,
  pointsModel,
});


boardPresenter.init();

