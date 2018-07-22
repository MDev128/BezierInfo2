var tau = Math.PI*2;

function sqr(v) {
  return v * v;
}

function dist2(a, b) {
  return sqr(a.x - b.x) + sqr(a.y - b.y);
}

function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 === 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);
  return dist2(p, {
    x: v.x + t * (w.x - v.x),
    y: v.y + t * (w.y - v.y)
  });
}

function distToSegment(p, v, w) {
  return Math.sqrt(distToSegmentSquared(p, v, w));
}

// Ramer–Douglas–Peucker simplification
class RDP {

  constructor(threshold) {
    this.threshold = threshold || 2.5;
  }

  runRDP(coords) {
    coords = coords.slice();
    var len = coords.length;

    coords[0].start = true;
    coords[len-1].end = true;

    if(coords.length === 2) {
      coords[0].keep = true;
      coords[1].keep = true;
      return coords;
    }

    return this.reducePoints(coords);
  }

  reducePoints(coords) {
    var e = coords.length-1,
        v = coords[0],
        w = coords[e],
        md = 0,
        mdi = 0,
        t = this.threshold,
        p,i,d;

    for(i=1; i<e-1; i++) {
      p = coords[i];
      d = distToSegment(p, v, w);
      if(d>md) { md=d; mdi=i; }
    }

    // if a transition is detected, process each set separately
    if(md > t) {
      this.runRDP(coords.slice(0, mdi+1))
      this.runRDP(coords.slice(mdi));
    } else {
      v.keep = true;
      w.keep = true;
    }

    // filter out all unmarked coordinates
    return coords.filter(p => p.keep);
  }
}

var rdp = new RDP();

if(typeof module !== "undefined") {
  module.exports = rdp;
}
