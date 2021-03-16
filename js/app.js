let actualDrawing = null;

const svgContainer = document.querySelector("#svgContainer");

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
      lastMouse: { x: 0, y: 0 },
      lastSvgMouse: { x: 0, y: 0 },
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
      if (event.button == 0)
        this.tools[this.currentToolIndex]?.mousedown(event);
    },
    svgMouseMove(event) {
      this.lastSvgMouse.x = event.offsetX;
      this.lastSvgMouse.y = event.offsetY;
      if (event.button == 0)
        this.tools[this.currentToolIndex]?.mousemove(event);
    },
    svgMouseUp(event) {},
    showCreateDocument() {
      this.modals.isOpen = true;
      this.modals.createDocument.isOpen = true;
    },
    hideCreateDocument() {
      this.modals.isOpen = false;
      this.modals.createDocument.isOpen = false;
    },
    editorMouseWheel(event) {
      let newScale = this.view.scale;
      if (event.deltaY < 0) {
        newScale *= 1.1;
      } else if (event.deltaY > 0) {
        newScale /= 1.1;
      }

      newScale = Math.max(0.1, Math.min(9, newScale));

      if (newScale != this.view.scale && newScale <= 9 && newScale >= 0.1) {
        let factor = newScale / this.view.scale;
        this.view.scale = newScale;
        let mouseOffsetX =
          this.lastMouse.x - window.innerWidth / 2 - this.view.x;
        let mouseOffsetY =
          this.lastMouse.y - 36 - (window.innerHeight - 36) / 2 - this.view.y;
        this.view.x -= mouseOffsetX * (factor - 1);
        this.view.y -= mouseOffsetY * (factor - 1);
      }
    },
    resetZoom() {
      this.view.scale = 1;
      this.view.x = 0;
      this.view.y = 0;
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
    editorMouseUp() {},
    windowMouseMove(event) {
      this.lastMouse.x = event.clientX;
      this.lastMouse.y = event.clientY;
    },
    windowMouseUp() {
      this.movingSVG = false;
      if (event.button == 0) this.tools[this.currentToolIndex]?.mouseup(event);
    },
    createDocument() {
      this.drawing = {
        width: this.modals.createDocument.data.width,
        height: this.modals.createDocument.data.height,
        nodes: [],
      };
      this.modals.isOpen = false;
      this.modals.createDocument.isOpen = false;
      this.view.scale = 1;
      this.view.x = 0;
      this.view.y = 0;
    },
    saveSVG() {
      window.electron.saveSVG(svgContainer.innerHTML);
    },
  },
  created() {
    window.addEventListener("mouseup", this.windowMouseUp);
    window.addEventListener("mousemove", this.windowMouseMove);
  },
});
