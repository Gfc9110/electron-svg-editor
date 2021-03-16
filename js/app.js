let actualDrawing = null;

var app = new Vue({
  el: "#app",
  data() {
    return {
      drawing: {
        width: 500,
        height: 500,
        nodes: [],
      },
      view: { x: 0, y: 0, scale: 1 },
      modals: {
        isOpen: false,
        createDocument: { isOpen: false, data: { width: 512, height: 512 } },
      },
      tools: [new PencilTool(this), new LineTool(this)],
      currentToolIndex: -1,
    };
  },
  methods: {
    closeApp: function (event) {
      window.electron.closeApp();
    },
    minimize: () => {
      window.electron.minimize();
    },
    maximize() {
      window.electron.maximize();
    },
    svgMouseDown(event) {
      this.tools[this.currentToolIndex]?.mousedown(event);
    },
    svgMouseMove(event) {
      this.tools[this.currentToolIndex]?.mousemove(event);
    },
    svgMouseUp(event) {
      this.tools[this.currentToolIndex]?.mouseup(event);
    },
    showCreateDocument() {
      this.modals.isOpen = true;
      this.modals.createDocument.isOpen = true;
    },
    hideCreateDocument() {
      console.log("closing");
      this.modals.isOpen = false;
      this.modals.createDocument.isOpen = false;
    },
    editorMouseWheel(event) {
      if (event.deltaY < 0) {
        this.view.scale *= 1.1;
      } else if (event.deltaY > 0) {
        this.view.scale /= 1.1;
      }
      this.view.scale = Math.min(9, Math.max(0.1, this.view.scale));
    },
    resetZoom() {
      this.view.scale = 1;
    },
    editorMouseDown(event) {
      this.movingSVG = event.button == 1;
    },
    editorMouseMove(event) {
      if (this.movingSVG) {
        this.view.x += event.movementX;
        this.view.y += event.movementY;
      }
    },
    editorMouseUp() {
      this.movingSVG = false;
    },
    createDocument() {
      this.drawing = {
        width: this.modals.createDocument.data.width,
        height: this.modals.createDocument.data.height,
        nodes: [],
      };
      this.modals.isOpen = false;
      this.modals.createDocument.isOpen = false;
    },
    saveSVG() {
      window.electron.saveSVG(
        document.querySelector("#svgContainer").innerHTML
      );
    },
  },
});
