window.onload = function() {
  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  function Polygon(fill,points,tick, freq,range) {
    tick = typeof tick !== 'undefined' ?  b : 0;
    freq = typeof freq !== 'undefined' ?  freq : 0.01;
    range = typeof range !== 'undefined' ? range : 8;
    return {
      points:points,
      fill:fill,
      tick:tick,
      freq:freq,
      range:range,
      step:function() {
        this.tick += this.freq;
      }
    }
  }

  var distortShapes = false;
  var lastMousePos = new Point(window.innerWidth * .5, window.innerHeight * .5); // assume the mouse starts at the center
  var canvas = document.getElementById("canvas");
  var canvas_bg = document.getElementById("canvas_bg");
  var draw_bg = document.querySelector('input[name="draw_bg"]');
  var ctx = canvas.getContext("2d");
  var osscillate =document.querySelector('input[name="osscillate"]');
  var polygonData = [];

  document.body.onmousemove = function(e) {
    lastMousePos = new Point(e.pageX, e.pageY); // current mouse position
  };

  function handleResize() {
    canvas.width = canvas_bg.width = window.innerWidth;
    canvas.height = canvas_bg.height = window.innerHeight;
  }

  window.onresize = function() {
    handleResize();
  };

  handleResize();

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
    draw_bg.disabled = !distortCheckbox.checked;

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
    if(!distortCheckbox.checked) ctx.drawImage(source, (window.innerWidth / 2 )- (522/2), (window.innerHeight / 2 )- (620/2));
  }

  window.requestAnimationFrame(step);

  function drawShape(ctx,polygon,points) {
    ctx.beginPath();
    var strokeStyle = polygon.fill;
    var fillStyle = polygon.fill;
    ctx.strokeStyle = strokeStyle;

    for(var i = 0; i < points.length; i++) {
      var point = points[i];
      var x = parseFloat(point.split(',')[0]);
      var y = parseFloat(point.split(',')[1]);

      var closestDist;
      var p = new Point(x,y);
      var d = distanceBetweenTwoPoints(lastMousePos,p);
      if(closestDist === undefined || d < closestDist) {
        closestDist = d;
      }

      function distanceBetweenTwoPoints(_a,_b) {
        return Math.sqrt(Math.pow(Math.abs(_a.y - _b.y),2) + Math.pow(Math.abs(_a.x - _b.x),2))
      }
    }

    if(draw_bg.checked) canvas_bg.classList.remove('hidden');
    else canvas_bg.classList.add('hidden');

    if(distortCheckbox.checked) {
      points[0] = (lastMousePos.x) + ',' + (lastMousePos.y);
      canvas_bg.classList.remove('hidden');
    } else {
      var destCtx = canvas_bg.getContext('2d');
      if(draw_bg.checked) destCtx.drawImage(canvas,0,0);
      canvas_bg.classList.add('hidden');
    }



    for(var i = 0; i < points.length; i++) {
      var point = points[i];
      var x = parseFloat(point.split(',')[0]);
      var y = parseFloat(point.split(',')[1]);

      if(osscillate.checked) {
        if(i == 1) {
          x += Math.sin(polygon.tick) * polygon.range;
        } else if(i == 2) {
          y += Math.sin(polygon.tick) * polygon.range;
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
    ctx.stroke();
    ctx.fill();
  }
}
