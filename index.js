var w;
var h;
var canvas;
var board;
var easycam;

function setup(){
  w = windowWidth;
  h = windowHeight;
  canvas = createCanvas(w,h,WEBGL);
  setAttributes('antialias', true);

  Dw.EasyCam.prototype.apply = function(n) {
      var o = this.cam;
      n = n || o.renderer,
      n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
  };
  easycam = createEasyCam();

  board = new Board({
    col: [0,255,0],
    w: 100,
    l: 100,
    h: 50
  });
  chip = new Chip({
    w: 100,
    l: 100,
    h: 50,
    chipColor: [196 * 0.5, 202 * 0.5, 206 * 0.5],
    pinColor: [241 * 0.75, 126 * 0.75, 1 * 0.75],
  });
  circuit = new CircuitBoard({
    boardConfig: {
      col: [0, 100, 0],
      w: 500,
      l: 500,
      h: 20
    },
    chipConfig: [
      {
        w: 100,
        l: 100,
        h: 20,
        chipColor: [196 * 0.5, 202 * 0.5, 206 * 0.5],
        pinColor: [241 * 0.75, 126 * 0.75, 1 * 0.75],
        trans: [100, 100, 0]
      },
      {
        w: 50,
        l: 50,
        h: 10,
        chipColor: [196 * 0.5, 202 * 0.5, 206 * 0.5],
        pinColor: [241 * 0.75, 126 * 0.75, 1 * 0.75],
        trans: [-100, -100, 0]
      }
    ]
  });
}

function draw(){
  background(0);
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;
  console.log(locX, locY)
  ambientLight(60, 60, 60);
  pointLight(255, 255, 255, locX, locY, 100);
  push();
  translate(locX, locY, 100);
  sphere(10);
  pop();
  //board.draw();
  //chip.draw();
  circuit.draw();
}
