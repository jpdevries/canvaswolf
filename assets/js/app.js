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


  function Point(x, y) { // used to store coordinates
    return {
      x:x,
      y:y
    }
  }

  function Polygon(fill,points) { // data object for polygons
    return {
      fill:fill,
      points:points
    }
  }
}
