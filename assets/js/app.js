window.onload = function() {
  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  function Polygon(fill,points) {
    return {
      points:points,
      fill:fill
    }
  }

  var distortShapes = false;
  var lastMousePos = new Point(window.innerWidth * .5, window.innerHeight * .5); // assume the mouse starts at the center
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var polygonData = [];

  document.body.onmousemove = function(e) {
    lastMousePos = new Point(e.pageX, e.pageY); // current mouse position
  };


  (function(){
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
  (function(){ // load the remaining SVG image onto the canvas as an unmanipulatable Image
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
  })();

  var compmode = document.getElementById('compmode');
  var distortCheckbox = document.querySelector('input[name="distort_shapes"]');
  function step(timestamp) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = compmode.value;
    for(var i = 0; i < polygonData.length; i++) {
      var polygon = polygonData[i];

      // draw the shape onto the <canvas>
      drawShape(ctx,polygon.fill,polygon.fill,polygon.points.split(' '));
    }
    window.requestAnimationFrame(step);
    if(!distortCheckbox.checked) ctx.drawImage(source, (window.innerWidth / 2 )- (522/2), (window.innerHeight / 2 )- (620/2));
  }

  window.requestAnimationFrame(step);

  function drawShape(ctx,strokeStyle,fillStyle,points) {
    ctx.beginPath();
    ctx.strokeStyle = strokeStyle;

    if(distortCheckbox.checked) {
      points[0] = (lastMousePos.x) + ',' + (lastMousePos.y);
    }

    for(var i = 0; i < points.length; i++) {
      var point = points[i];
      var x = parseFloat(point.split(',')[0]);
      var y = parseFloat(point.split(',')[1]);

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
    ctx.stroke();
    ctx.fill();
  }
}
