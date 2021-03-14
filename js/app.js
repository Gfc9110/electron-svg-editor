var app = new Vue({
  el: "#app",
  data: {},
  methods: {
    closeApp: function (event) {
      window.electron.closeApp();
    },
    minimize: () => {
      window.electron.minimize();
    },
  },
});
