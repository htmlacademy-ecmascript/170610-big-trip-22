import { generatePoint } from '../mock/point.js';

const POINT_COUNT = 6;

export default class PointsModel {
  #points = Array.from({ length: POINT_COUNT }, generatePoint);

  get points() {
    return this.#points;
  }
}
