window.onload = function() {
  var polygonData = [], // array to hold data objects, one for each point
  canvas = document.getElementById("canvas"), // our <canvas> tag in the index.html DOM
  oscillationRange = 8,
  oscillationFrequency = .01,
  ctx = canvas.getContext("2d");

  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.onresize = function() {
    handleResize(); // keep the canvas full screen
  };
  handleResize();

  (function(){ // for each <polygon> in the source SVG extract points, fill and then remove
    var polygons = document.querySelectorAll('#art polygon');

    for(var i = 0; i < polygons.length; i++) {
      var polygon = polygons[i],
      points = polygon.getAttribute('points').trim(),
      fill = polygon.getAttribute('fill');

      polygon.remove(); // remove the shape from the SVG

      polygonData.push(Polygon(fill,points)); // create a Polygon and store it. We'll loop through all these to draw them on each step()
    }
  })();

  function step(timestamp) { // for each step through the animation
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
    ctx.globalCompositeOperation = 'multiply';

    for(var i = 0; i < polygonData.length; i++) { // for each polygon
      var polygon = polygonData[i];

      drawShape(ctx,polygon); // draw the shape onto the <canvas>

      polygon.step();
    }

    window.requestAnimationFrame(step); // keep the animation running
  }

  window.requestAnimationFrame(step); // start the animation

  function drawShape(ctx,polygon) { // draw the polygon data to a <canvas> context
    var points = polygon.points.split(' '),
    strokeStyle = polygon.fill,
    fillStyle = polygon.fill;

    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;

    ctx.beginPath();

    for(var i = 0; i < points.length; i++) { // for each point in the polygon
      var point = points[i],
      x = parseFloat(point.split(',')[0]),
      y = parseFloat(point.split(',')[1]);

      if(i == 1) {
        x += Math.sin(polygon.tick) * oscillationRange; // second point in polygon moves horizontally
      } else if(i == 2) {
        y += Math.sin(polygon.tick) * oscillationRange; // third point in polygol moves vertically
      }

      // adjust coordinates for stage size
      x += (window.innerWidth - 522) / 2;
      y += (window.innerHeight - 620) / 2;

      if(i<1) {
        ctx.moveTo(x,y); // move to the position of the first point
      } else {
        ctx.lineTo(x,y); // draw lines to the rest
      }
    }

    ctx.closePath(); // close the path and set the fill style

    ctx.fill(); // fill the path or
  }


  function Point(x, y) { // used to store coordinates
    return {
      x:x,
      y:y
    }
  }

  function Polygon(fill,points,tick) { // data object for polygons
    tick = typeof tick !== 'undefined' ?  tick : 0; // a number incremented each step. the Math.sin() of this value will be used to create our oscillation effect http://codepen.io/jpdevries/pen/BjLOeY
    return {
      points:points,
      fill:fill,
      tick:tick,
      step:function() { // each step increment the tick by the current frequency
        this.tick += parseFloat(oscillationFrequency);
      }
    }
  }
}
