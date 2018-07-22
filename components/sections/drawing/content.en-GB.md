# Drawing Bezier paths

- draw with a mouse, stylus, or finger
- [Ramer–Douglas–Peucker](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm) to reduce the number of points along the path
- abstract curve through points:
  - fit compound quadratic/cubic bezier
    - naive
    - corrected for C1/C2
  - also fit using catmull-rom approach
  	- simpler, "easier" control, but can look very different/wrong.

<Graphic title="Drawing a Bézier curve" setup={this.setup} draw={this.draw} onMouseUp={this.onMouseUp} onMouseDrag={this.onMouseDrag} />

