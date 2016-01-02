window.onload = function() {

  var followMouse = false, // whether or not to "follow the mouse"
  polygonData = [], // array of data objects, one for each point
  lastMousePos = new Point(window.innerWidth * .5, window.innerHeight * .5), // where the mouse was last, assume the mouse starts at the center

  canvas = document.getElementById("canvas"), // our <canvas> tag in the index.html DOM
  ctx = canvas.getContext("2d"),
  // query the DOM once for these elements by using pointer variables
  osscillate = document.querySelector('input[name="osscillate"]'),
  fillPolygons = document.querySelector('input[name="fill_polygons"]'),
  oscillationRange = document.querySelector('input[name="osc_range"]'),
  oscillationFrequency = document.querySelector('input[name="osc_freq"]'),
  drawNonPoly = document.querySelector('input[name="draw_non_poly"]'),
  compmode = document.getElementById('compmode'),
  followMouseCheckbox = document.querySelector('input[name="follow_mouse"]');

  function Point(x, y) { // used to store coordinates 
    this.x = x;
    this.y = y;
  }

  function Polygon(fill,points,tick) { // data object for polygons
    tick = typeof tick !== 'undefined' ?  tick : 0; // a number incremented each step. the Math.sin() of this value will be used to create our oscillation effect http://codepen.io/jpdevries/pen/BjLOeY
    return {
      points:points,
      fill:fill,
      tick:tick,
      step:function() { // each step increment the tick by the current frequency
        this.tick += parseFloat(oscillationFrequency.value);
      }
    }
  }

  document.body.onmousemove = function(e) { // whenever the mouse is moved
    lastMousePos = new Point(e.pageX, e.pageY); // store the current mouse position
  };

  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.onresize = function() {
    handleResize(); // keep the canvas full screen
  };

  handleResize();

  (function(){ // for each <polygon> in the source SVG extract points, fill and then remove
    var polygons = document.querySelectorAll('#wolf polygon');

    for(var i = 0; i < polygons.length; i++) {
      var polygon = polygons[i],
      points = polygon.getAttribute('points').trim(),
      fill = polygon.getAttribute('fill');

      polygon.remove(); // remove the shape from the SVG

      polygonData.push(new Polygon(fill,points)); // create a new Polygon and store it. We'll loop through all these to draw them on each step()
    }
  })();

  var source = createImageOfNonPolygonalShapes(); // create an image of the remaining non-polygonal shapes

  function step(timestamp) { // for each step through the animation
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
    ctx.globalCompositeOperation = compmode.value; // update the "blend mode"

    for(var i = 0; i < polygonData.length; i++) { // for each polygon
      var polygon = polygonData[i];

      drawShape(ctx,polygon); // draw the shape onto the <canvas>

      polygon.step();
    }

    if(drawNonPoly.checked) ctx.drawImage(source, (window.innerWidth / 2 )- (522/2), (window.innerHeight / 2 )- (620/2)); // draw non-polygonal shapes and center them on <canvas>

    window.requestAnimationFrame(step); // keep the animation running
  }

  window.requestAnimationFrame(step); // start the animation

  function drawShape(ctx,polygon) { // draw the polygon data to a <canvas> context
    var points = polygon.points.split(' '),
    strokeStyle = polygon.fill,
    fillStyle = polygon.fill;

    if(followMouseCheckbox.checked) { // "follow the mouse" if we should
      points[0] = (lastMousePos.x) + ',' + (lastMousePos.y);
    }

    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;

    ctx.beginPath();

    for(var i = 0; i < points.length; i++) { // for each point in the polygon
      var point = points[i],
      x = parseFloat(point.split(',')[0]),
      y = parseFloat(point.split(',')[1]);

      if(osscillate.checked) { // apply oscillation effect using a sin wave
        if(i == 1) {
          x += Math.sin(polygon.tick) * oscillationRange.value; // second point in polygon moves horizontally
        } else if(i == 2) {
          y += Math.sin(polygon.tick) * oscillationRange.value; // third point in polygol moves vertically
        }
      }

      if(i !== 0 || !followMouseCheckbox.checked) { // adjust coordinates for stage size
        x += (window.innerWidth - 522) / 2;
        y += (window.innerHeight - 620) / 2;
      }

      if(i<1) {
        ctx.moveTo(x,y); // move to the position of the first point
      } else {
        ctx.lineTo(x,y); // draw lines to the rest
      }
    }

    ctx.closePath(); // close the path and set the fill style

    if(fillPolygons.checked) ctx.fill(); // fill the path or
    else ctx.stroke(); // stroke the path
  }

  function createImageOfNonPolygonalShapes() { // takes the remaining <svg> data from our #wolf element and prepare it for being drawn to the canvas
    var source = new Image();
    var DOMURL = window.URL || window.webkitURL || window;

    var data = document.querySelector("#wolf").outerHTML;

    var svgData = new XMLSerializer().serializeToString(document.querySelector("#wolf"));
    var blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });

    var domURL = self.URL || self.webkitURL || self;
    var url = domURL.createObjectURL(blob);

    // Load up our image.

    source.width = '522';
    source.height = '620';

    source.addEventListener('load', function () {
      ctx.drawImage(source, (window.innerWidth / 2 )- (522/2), (window.innerHeight / 2 )- (620/2));
      domURL.revokeObjectURL(url);
    });

    source.src = url;

    return source;
  }
}
