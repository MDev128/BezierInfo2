var RDP = require('../../../lib/rdp.js');

module.exports = {
  setup: function(api) {
    this.api = api;
    api.setSize(600,250);
    api.setPanelCount(1);
    api.setColor('lightgrey');
    api.drawGrid(20,10);

    this.coordinates = [];
    this.reduced = [];
  },

  draw: function(api, curve) {
    if (this.reduced.length > 0) {
      api.setColor('red');
      api.drawPoints(this.reduced);
    }
    api.setColor('black');
    var last = this.coordinates.length - 1;
    if (last >= 0) {
      api.drawPoint(this.coordinates[last]);
    }
  },

  onMouseUp: function(evt, api) {
    if (this.coordinates.length < 2) return;
    this.reduced = RDP.runRDP(this.coordinates);
    api.redraw();
  },

  onMouseDrag: function(evt, api) {
    this.coordinates.push({x: api.mx, y: api.my });
    api.redraw();
  }
};
