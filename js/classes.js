//Nodes

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
  set(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Path {
  constructor(start = new Point(0, 0), options) {
    this.type = "path";
    this.points = [new Point(start.x, start.y)];
    this.options = options;
  }
  addPoint(point = new Point(0, 0)) {
    this.points.push(new Point(point.x, point.y));
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
  constructor(start = new Point(0, 0), options) {
    this.type = "line";
    this.a = new Point(start.x, start.y);
    this.b = new Point(start.x, start.y);
    this.options = options;
  }
  setB(point = new Point(0, 0)) {
    this.b.set(point.x, point.y);
  }
}

//Tools
class PencilTool {
  constructor(vue) {
    this.vue = vue;
    this.path = null;
    this.icon = "edit";
    this.options = {};
  }
  mousedown(event) {
    this.vue.drawing.nodes.push(
      (this.path = new Path(
        new Point(event.offsetX, event.offsetY),
        prepareOptions(this.vue, this.options)
      ))
    );
  }
  mousemove(event) {
    if (this.path) {
      this.path.addPoint(new Point(event.offsetX, event.offsetY));
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
    this.options = {};
  }
  mousedown(event) {
    this.vue.drawing.nodes.push(
      (this.line = new Line(
        new Point(event.offsetX, event.offsetY),
        prepareOptions(this.vue, this.options)
      ))
    );
  }
  mousemove(event) {
    if (this.line) {
      this.line.setB(new Point(event.offsetX, event.offsetY));
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
    this.options = {};
  }
  mousedown(event) {
    this.vue.drawing.nodes.push(
      (this.circle = new Circle(
        new Point(event.offsetX, event.offsetY),
        prepareOptions(this.vue)
      ))
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

function prepareOptions(vue, toolOptions = {}) {
  let options = {};
  Object.keys({ ...vue.globalOptions, ...toolOptions }).forEach((k) => {
    options[k] = vue.globalOptions[k].value;
  });
  return options;
}

//Options Types

class NumberOption {
  constructor(defaultValue = 1, min = 0, max = 1000, step = 1) {
    this.defaultValue = this.value = defaultValue;
    this.min = min;
    this.max = max;
    this.step = step;
    this.type = "number";
  }
}

class ColorOption {
  constructor(defaultValue = "#000000") {
    this.defaultValue = this.value = defaultValue;
    this.type = "color";
  }
}
