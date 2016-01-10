var React = require("react");
var Graphic = require("../../Graphic.jsx");
var SectionHeader = require("../../SectionHeader.jsx");

var PolyBezier = React.createClass({
  getDefaultProps: function() {
    return {
      title: "Forming poly-Bézier curves"
    };
  },

  setupQuadratic: function(api) {
    var w = api.getPanelWidth(),
        h = api.getPanelHeight(),
        cx = w/2, cy = h/2, pad = 40,
        pts = [
          // first curve:
          {x:cx,y:pad}, {x:w-pad,y:pad}, {x:w-pad,y:cy},
          // subsequent curve
          {x:w-pad,y:h-pad}, {x:cx,y:h-pad},
          // subsequent curve
          {x:pad,y:h-pad}, {x:pad,y:cy},
          // final curve control point
          {x:pad,y:pad},
        ];
    api.lpts = pts;
  },

  setupCubic: function(api) {
  },

  draw: function(api, curves) {
    api.reset();
    var pts = api.lpts;

    var c1 = new api.Bezier(pts[0],pts[1],pts[2]);
    api.drawSkeleton(c1);
    api.drawCurve(c1);

    var c2 = new api.Bezier(pts[2],pts[3],pts[4]);
    api.drawSkeleton(c2);
    api.drawCurve(c2);

    var c3 = new api.Bezier(pts[4],pts[5],pts[6]);
    api.drawSkeleton(c3);
    api.drawCurve(c3);

    var c4 = new api.Bezier(pts[6],pts[7],pts[0]);
    api.drawSkeleton(c4);
    api.drawCurve(c4);
  },

  render: function() {
    return (
      <section>
        <SectionHeader {...this.props} />

        <p>Much like lines can be chained together to form polygons, Bézier curves can be chained together
        to form poly-Béziers, and the only trick required is to make sure that: A) the end point of each
        section is the starting point of the following section, and B) the derivatives across that
        dual point line up. Unless, of course, you want discontinuities; then you don't even need (B).</p>

        <p>We'll cover three forms of poly-Bézier curves in this section. First, we'll look at the kind
        that enforces "the outgoing derivative is the same as the incoming derivative" across sections:</p>

        <p>\[
          B'(1)_n = B'(0)_{n+1}
        \]</p>

        <p>We can actually guarantee this really easily, because we know that the vector from a curve's
        last control point to its last on-curve point is equal to the derivative vector. If we want to
        ensure that the first control point of the next curve matches that, all we have to do is mirror
        that last control point through the last on-curve point. And mirroring any point A through any
        point B is really simple:</p>

        <p>\[
          Mirrored = \left [
            \begin{matrix} B_x + (B_x - A_x) \\  B_y + (B_y - A_y) \end{matrix}
          \right ] = \left [
            \begin{matrix} 2B_x - A_x \\  2B_y - A_y \end{matrix}
          \right ]
        \]</p>

        <p>So let's implement that and see what it gets us. The following two graphics show a quadratic
        and a cubic poly-Bézier curve; both consist of multiple sub-curves, but because of our constraint,
        not all points on the curves can be moved around freely. Some points, when moved, will move other
        points by virtue of changing the curve across sections.</p>

        <Graphic preset="poly" title="Forming a quadratic poly-Bézier" setup={this.setupQuadratic} draw={this.draw}/>

        <textarea className="sketch-code" data-sketch-preset="poly" data-sketch-title="Forming a cubic poly-Bézier">
        void setupCurve() {
          setupDefaultCubicPoly();
        }

        void movePoint(PolyBezierCurve p, int pt, int mx, int my) {
            p.movePointConstrained(pt, mx, my);
        }</textarea>

        <p>As you can see, quadratic curves are particularly ill-suited for poly-Bézier curves, as all
        the control points are effectively linked. Move one of them, and you move all of them. This means
        that we cannot use quadratic poly-Béziers for anything other than really, really simple shapes.
        And even then, they're probably the wrong choice. Cubic curves are pretty decent, but the fact
        that the derivatives are linked means we can't manipulate curves as well as we might if we
        relaxed the constraints a little.</p>

        <p>So: let's relax them!</p>

        <p>We can change the constraint so that we still preserve the angle of the derivatives across
        sections (so transitions from one section to the next will still look natural), but give up
        the requirement that they should also have the same vector length. Doing so will give us
        a much more a useful kind of poly-Bézier curve:</p>

        <textarea className="sketch-code" data-sketch-preset="poly" data-sketch-title="A half-constrained quadratic poly-Bézier">
        void setupCurve() {
          setupDefaultQuadraticPoly();
        }

        void movePoint(PolyBezierCurve p, int pt, int mx, int my) {
            p.movePointHalfConstrained(pt, mx, my);
        }</textarea>

        <textarea className="sketch-code" data-sketch-preset="poly" data-sketch-title="A half-constrained cubic poly-Bézier">
        void setupCurve() {
          setupDefaultCubicPoly();
        }

        void movePoint(PolyBezierCurve p, int pt, int mx, int my) {
            p.movePointHalfConstrained(pt, mx, my);
        }</textarea>

        <p>Quadratic curves are still silly, but cubic curves are now much more controllable.</p>

        <p>If we want even more control, we could just abandon the derivative constraints entirely,
        and simply assure that the end point of one section is the same as the start point of the next section,
        and then keep it at that. This gives us the greatest degree of freedom when it comes to modelling
        shapes, but also means that our poly-Bézier constructs are no longer continuous curves. Sometimes
        this is exactly what you want (because it lets you add corners to a shape, while still only using
        Bézier curves).</p>

        <textarea className="sketch-code" data-sketch-preset="poly" data-sketch-title="An unconstrained quadratic poly-Bézier">
        void setupCurve() {
          setupDefaultQuadraticPoly();
        }

        void movePoint(PolyBezierCurve p, int pt, int mx, int my) {
          p.movePoint(pvt, mx, my);
        }</textarea>

        <textarea className="sketch-code" data-sketch-preset="poly" data-sketch-title="An unconstrained cubic poly-Bézier">
        void setupCurve() {
          setupDefaultCubicPoly();
        }

        void movePoint(PolyBezierCurve p, int pt, int mx, int my) {
          p.movePoint(pvt, mx, my);
        }</textarea>

        <p>When doing any kind of modelling, you generally don't want a poly-Bézier that will only let you
        pick one of the three forms for all your points; most graphics applications that deal with Bézier
        curves will actually let you pick, per on-curve point, how to deal with the control points around it:
        fully constrained, loosely constrained, or completely unconstrained. The best shape modelling comes
        from having a curve that will let you pick what you need, when you need it, without having to start
        a new poly-Bézier curve.</p>


      </section>
    );
  }
});

module.exports = PolyBezier;
