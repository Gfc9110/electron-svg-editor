class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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
