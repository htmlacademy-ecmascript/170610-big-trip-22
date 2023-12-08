import { getRandomPoint } from '../mock/point';

const POINT_COUNT = 5;

export default class PointsModel {
  points = Array.from({ length: POINT_COUNT }, getRandomPoint);

  getTasks() {
    return this.points;
  }
}
