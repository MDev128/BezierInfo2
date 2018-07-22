# Drawing Bezier paths

- draw with a mouse, stylus, or finger
- [Ramer–Douglas–Peucker](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm) to reduce the number of points along the path
- abstract curve through points:
  - high order bezier, split and reduced
  - fit compound bezier
  - catmull-rom

<Graphic title="Drawing a Bézier curve" setup={this.setup} draw={this.draw} onMouseUp={this.onMouseUp} onMouseDrag={this.onMouseDrag} />

