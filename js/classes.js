const svgSelector = $("#selector");

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
  get attributes() {
    let attributes = {};
    Object.keys(this.options).forEach((k) => {
      attributes[k] = this.options[k].value;
    });
    return attributes;
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
  get attributes() {
    let attributes = {};
    Object.keys(this.options).forEach((k) => {
      attributes[k] = this.options[k].value;
    });
    return attributes;
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
  get attributes() {
    let attributes = {};
    Object.keys(this.options).forEach((k) => {
      attributes[k] = this.options[k].value;
    });
    return attributes;
  }
}

class Rectangle {
  constructor(start = new Point(0, 0), options) {
    this.type = "rectangle";
    this.a = new Point(start.x, start.y);
    this.b = new Point(start.x, start.y);
    this.width = 0;
    this.height = 0;
    this.options = options;
  }
  get firstPoint() {
    return new Point(
      Math.min(this.a.x, this.b.x),
      Math.min(this.a.y, this.b.y)
    );
  }
  setB(point = newPoint(0, 0)) {
    this.b.x = point.x;
    this.b.y = point.y;
    this.width = Math.abs(this.b.x - this.a.x);
    this.height = Math.abs(this.b.y - this.a.y);
  }
  get attributes() {
    let attributes = {};
    Object.keys(this.options).forEach((k) => {
      attributes[k] = this.options[k].value;
    });
    return attributes;
  }
}

//Tools

class SelectTool {
  constructor(vue) {
    this.vue = vue;
    this.icon = "location_searching";
  }
  mousedown(event) {
    if (event.target.dataset.index) {
      this.vue.selectedNodeIndex = parseInt(event.target.dataset.index);
    } else {
      this.vue.selectedNodeIndex = -1;
    }
  }
  mousemove(event) {
    if (event.target.dataset.index) {
      const bounds = event.target.getBoundingClientRect();
      $("#hoverSelector")
        .css({
          top: bounds.top - 10,
          left: bounds.left - 10,
          width: bounds.width + 20,
          height: bounds.height + 20,
        })
        .addClass("show");
    } else {
      $("#hoverSelector").removeClass("show");
    }
  }
  mouseup() {}
  deselected() {
    $("#hoverSelector").removeClass("show");
    this.vue.selectedNodeIndex = -1;
  }
}
class PencilTool {
  constructor(vue) {
    this.vue = vue;
    this.path = null;
    this.icon = "edit";
    this.options = {};
  }
  mousedown(event) {
    this.vue.selectedNodeIndex =
      this.vue.drawing.nodes.push(
        (this.path = new Path(
          new Point(event.offsetX, event.offsetY),
          cloneOptions({
            ...this.vue.globalOptions,
            ...this.options,
          })
        ))
      ) - 1;
  }
  mousemove(event) {
    if (this.path) {
      this.path.addPoint(new Point(event.offsetX, event.offsetY));
    }
  }
  mouseup() {
    this.path = null;
  }
  deselected() {}
}

class LineTool {
  constructor(vue) {
    this.vue = vue;
    this.line = null;
    this.icon = "open_in_full";
    this.options = {};
  }
  mousedown(event) {
    this.vue.selectedNodeIndex =
      this.vue.drawing.nodes.push(
        (this.line = new Line(
          new Point(event.offsetX, event.offsetY),
          cloneOptions({
            ...this.vue.globalOptions,
            ...this.options,
          })
        ))
      ) - 1;
  }
  mousemove(event) {
    if (this.line) {
      this.line.setB(new Point(event.offsetX, event.offsetY));
    }
  }
  mouseup() {
    this.line = null;
  }
  deselected() {}
}

class CircleTool {
  constructor(vue) {
    this.vue = vue;
    this.icon = "panorama_fish_eye";
    this.drawing = false;
    this.options = {};
  }
  mousedown(event) {
    this.vue.selectedNodeIndex =
      this.vue.drawing.nodes.push(
        (this.circle = new Circle(
          new Point(event.offsetX, event.offsetY),
          cloneOptions({
            ...this.vue.globalOptions,
            ...this.options,
          })
        ))
      ) - 1;
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
  deselected() {}
}

class RectangleTool {
  constructor(vue) {
    this.vue = vue;
    this.icon = "crop_landscape";
    this.drawing = false;
    this.options = {};
  }
  mousedown(event) {
    this.vue.selectedNodeIndex =
      this.vue.drawing.nodes.push(
        (this.rectangle = new Rectangle(
          new Point(event.offsetX, event.offsetY),
          cloneOptions({
            ...this.vue.globalOptions,
            ...this.options,
          })
        ))
      ) - 1;
    this.drawing = true;
  }
  mousemove(event) {
    if (this.drawing)
      this.rectangle.setB(new Point(event.offsetX, event.offsetY));
  }
  mouseup() {
    this.drawing = false;
  }
  deselected() {}
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
  clone() {
    return new NumberOption(this.value, this.min, this.max, this.step);
  }
}

class ColorOption {
  constructor(defaultValue = "#000000") {
    this.defaultValue = this.value = defaultValue;
    this.type = "color";
  }
  clone() {
    return new ColorOption(this.value);
  }
}

//Functions

function cloneOptions(options) {
  let clonedOptions = {};
  Object.keys(options).forEach((key) => {
    clonedOptions[key] = options[key].clone();
  });
  return clonedOptions;
}
