window.onload = function() {

  var distortShapes = false;
  var polygonData = [];
  var lastMousePos = new Point(window.innerWidth * .5, window.innerHeight * .5); // assume the mouse starts at the center

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var osscillate = document.querySelector('input[name="osscillate"]');
  var fillPolygons = document.querySelector('input[name="fill_polygons"]');
  var oscillationRange = document.querySelector('input[name="osc_range"]');
  var oscillationFrequency = document.querySelector('input[name="osc_freq"]');
  var drawNonPoly = document.querySelector('input[name="draw_non_poly"]');
  var compmode = document.getElementById('compmode');
  var distortCheckbox = document.querySelector('input[name="distort_shapes"]');

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  function Polygon(fill,points,tick) {
    tick = typeof tick !== 'undefined' ?  b : 0;
    return {
      points:points,
      fill:fill,
      tick:tick,
      step:function() {
        this.tick += parseFloat(oscillationFrequency.value);
      }
    }
  }

  document.body.onmousemove = function(e) {
    lastMousePos = new Point(e.pageX, e.pageY); // current mouse position
  };

  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.onresize = function() {
    handleResize();
  };

  handleResize();

  (function(){ // for each <polygon> in the source SVG extract points,fill and remove
    var polygons = document.querySelectorAll('#wolf polygon');

    for(var i = 0; i < polygons.length; i++) {
      var polygon = polygons[i];
      var points = polygon.getAttribute('points');
      var fill = polygon.getAttribute('fill');

      // remove the shape from the SVG
      polygon.remove();

      polygonData.push(new Polygon(fill,points));
    }
  })();

  var source = new Image();
  (function(source){ // create an image of the remaining non-polygonal shapes
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
  })(source);

  function step(timestamp) { // for each step through the animation
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = compmode.value;
    for(var i = 0; i < polygonData.length; i++) {
      var polygon = polygonData[i];

      // draw the shape onto the <canvas>
      drawShape(ctx,polygon,(function(){
        var a = polygon.points.split(' ');
        a.pop();
        return a;
      })());
      polygon.step();
    }

    window.requestAnimationFrame(step);
    if(drawNonPoly.checked) ctx.drawImage(source, (window.innerWidth / 2 )- (522/2), (window.innerHeight / 2 )- (620/2));
  }

  window.requestAnimationFrame(step);

  function drawShape(ctx,polygon,points) {
    ctx.beginPath();
    var strokeStyle = polygon.fill;
    var fillStyle = polygon.fill;
    ctx.strokeStyle = strokeStyle;

    if(distortCheckbox.checked) {
      points[0] = (lastMousePos.x) + ',' + (lastMousePos.y);
    } else {

    }

    for(var i = 0; i < points.length; i++) {
      var point = points[i];
      var x = parseFloat(point.split(',')[0]);
      var y = parseFloat(point.split(',')[1]);

      if(osscillate.checked) {
        if(i == 1) {
          x += Math.sin(polygon.tick) * oscillationRange.value;
        } else if(i == 2) {
          y += Math.sin(polygon.tick) * oscillationRange.value;
        }
      }

      if(i !== 0 || !distortCheckbox.checked) {
        x += (window.innerWidth - 522) / 2;
        y += (window.innerHeight - 620) / 2;
      }

      if(i<1) {
        ctx.moveTo(x,y);
      } else {
        ctx.lineTo(x,y);
      }
    }

    ctx.closePath();
    ctx.fillStyle = fillStyle;

    if(fillPolygons.checked) {
      ctx.fill();
    } else {
      ctx.stroke();
    }

    function distanceBetweenTwoPoints(_a,_b) {
      return Math.sqrt(Math.pow(Math.abs(_a.y - _b.y),2) + Math.pow(Math.abs(_a.x - _b.x),2))
    }
  }
}
