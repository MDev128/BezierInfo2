var RDP = require('../../../lib/rdp.js');
var fit = require('../../../lib/curve-fitter.js');

var colors = [
  '#999',
  '#499',
  '#949',
  '#994',
  '#449',
  '#944',
  '#444'
];

function getPseudoRandomColor(i) {
  i = i % colors.length;
  return colors[i];
}

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
    // is there a reduced set to draw?
    if (this.reduced.length > 0) {
      api.setColor('red');
      api.drawPoints(this.reduced);

      // make curves
      var curves = [], fc, points;
      for(var i=0, e=this.reduced.length; i<e; i+=3) {
        fc = fit(this.reduced.slice(i,i+4));
        // for now, don't build if we can't build a cubic.
        if (fc.C.x.length < 4) break;
        points = fc.C.x.map((x,i) => {
          return {
            x: x[0],
            y: fc.C.y[i][0]
          };
        });
        curves.push(new api.Bezier(points));
      }
      curves.forEach( (c,i) => {
        api.setColor(getPseudoRandomColor(i));
        api.drawCurve(c);
      });

      // make catmull-rom curves

      // ...code goes here...
    }

    // draw the user supplied path points
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
