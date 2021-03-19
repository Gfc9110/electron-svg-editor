class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  distanceSq(point = new Point(0, 0)) {
    return (this.x - point.x) ** 2 + (this.y - point.y) ** 2;
  }
  distance(point = new Point(0, 0)) {
    return Math.sqrt(this.distanceSq(point));
  }
}

class Path {
  constructor(startX, startY) {
    this.type = "path";
    this.points = [new Point(startX, startY)];
  }
  addPoint(x, y) {
    this.points.push(new Point(x, y));
  }
}

class Circle {
  constructor(center = Point(0, 0), options) {
    this.center = center;
    this.radius = 0;
    this.type = "circle";
    this.options = options;
  }
  setRadius(radius = 0) {
    this.radius = radius;
  }
}

class Line {
  constructor(startX, startY) {
    this.type = "line";
    this.a = new Point(startX, startY);
    this.b = new Point(startX, startY);
  }
  setB(x, y) {
    this.b = new Point(x, y);
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
      (this.path = new Path(event.offsetX, event.offsetY))
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

class LineTool {
  constructor(vue) {
    this.vue = vue;
    this.line = null;
    this.icon = "open_in_full";
  }
  mousedown(event) {
    this.vue.drawing.nodes.push(
      (this.line = new Line(event.offsetX, event.offsetY))
    );
  }
  mousemove(event) {
    if (this.line) {
      this.line.setB(event.offsetX, event.offsetY);
    }
  }
  mouseup() {
    this.line = null;
  }
}

class CircleTool {
  constructor(vue) {
    this.vue = vue;
    this.center = null;
    this.radius = 0;
    this.icon = "panorama_fish_eye";
    this.drawing = false;
    this.options = { strokeWidth_number: 1, stroke_text: "black" };
  }
  mousedown(event) {
    this.vue.drawing.nodes.push(
      (this.circle = new Circle(new Point(event.offsetX, event.offsetY), {
        ...this.options,
      }))
    );
    this.drawing = true;
  }
  mousemove(event) {
    if (this.drawing)
      this.circle.setRadius(
        this.circle.center.distance(new Point(event.offsetX, event.offsetY))
      );
  }
  mouseup() {
    this.drawing = false;
  }
}
