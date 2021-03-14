class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Line {
  constructor(startX, startY) {
    this.type = "line";
    this.points = [new Point(startX, startY)];
  }
  addPoint(x, y) {
    this.points.push(new Point(x, y));
  }
}
