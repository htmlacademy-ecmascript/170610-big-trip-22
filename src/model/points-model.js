import Observable from '../framework/observable.js';
import { generatePoint } from '../mock/point.js';

const POINT_COUNT = 6;

export default class PointsModel extends Observable {
  #points = Array.from({ length: POINT_COUNT }, generatePoint);

  get points() {
    return this.#points;
  }
}
