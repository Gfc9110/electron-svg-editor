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

class PencilTool {
  constructor(vue) {
    this.vue = vue;
    this.path = null;
    this.icon = "edit";
  }
  mousedown(event) {
    this.vue.drawing.nodes.push(
      (this.path = new Line(event.offsetX, event.offsetY))
    );
  }
  mousemove(event) {
    if (this.path) {
      this.path.addPoint(event.offsetX, event.offsetY);
    }
  }
  mouseup() {
    this.path = null;
  }
}
