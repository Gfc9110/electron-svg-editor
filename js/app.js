let actualDrawing = null;

var app = new Vue({
  el: "#app",
  data() {
    return {
      drawing: {
        nodes: [],
      },
      modals: { isOpen: false, createDocument: { isOpen: false } },
    };
  },
  methods: {
    closeApp: function (event) {
      window.electron.closeApp();
    },
    minimize: () => {
      window.electron.minimize();
    },
    svgMouseDown(event) {
      this.drawing.nodes.push(
        (actualDrawing = new Line(event.offsetX, event.offsetY))
      );
    },
    svgMouseMove(event) {
      if (actualDrawing) {
        actualDrawing.addPoint(event.offsetX, event.offsetY);
      }
    },
    svgMouseUp(event) {
      actualDrawing = null;
    },
    createDocument() {
      this.modals.isOpen = true;
      this.modals.createDocument.isOpen = true;
    },
  },
});
