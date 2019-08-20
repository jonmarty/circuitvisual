class Board{
  constructor(config){
    this.col = config.col;
    this.w = config.w;
    this.l = config.l;
    this.h = config.h;
  }
  draw(){
    fill(this.col[0], this.col[1], this.col[2]);
    //stroke(0);
    noStroke();

    // Top face
    beginShape();
    vertex(-this.w/2, -this.l/2,  this.h/2);
    vertex(-this.w/2,  this.l/2,  this.h/2);
    vertex( this.w/2,  this.l/2,  this.h/2);
    vertex( this.w/2, -this.l/2,  this.h/2);
    endShape();

    // Side face left
    beginShape();
    vertex( this.w/2, -this.l/2,  this.h/2);
    vertex( this.w/2,  this.l/2,  this.h/2);
    vertex( this.w/2,  this.l/2, -this.h/2);
    vertex( this.w/2, -this.l/2, -this.h/2);
    endShape();

    //Side face right
    beginShape();
    vertex(-this.w/2, -this.l/2,  this.h/2);
    vertex(-this.w/2,  this.l/2,  this.h/2);
    vertex(-this.w/2,  this.l/2, -this.h/2);
    vertex(-this.w/2, -this.l/2, -this.h/2);
    endShape();

    //Side face forward
    beginShape();
    vertex(-this.w/2,  this.l/2,  this.h/2);
    vertex( this.w/2,  this.l/2,  this.h/2);
    vertex( this.w/2,  this.l/2, -this.h/2);
    vertex(-this.w/2,  this.l/2, -this.h/2);
    endShape();

    //Side face backward
    beginShape();
    vertex(-this.w/2, -this.l/2,  this.h/2);
    vertex( this.w/2, -this.l/2,  this.h/2);
    vertex( this.w/2, -this.l/2, -this.h/2);
    vertex(-this.w/2, -this.l/2, -this.h/2);
    endShape();

    // Bottom face
    beginShape();
    vertex(-this.w/2, -this.l/2, -this.h/2);
    vertex(-this.w/2,  this.l/2, -this.h/2);
    vertex( this.w/2,  this.l/2, -this.h/2);
    vertex( this.w/2, -this.l/2, -this.h/2);
    endShape();
  }
}

class TranslatedBoard extends Board {
  constructor(config){
    super(config);
    this.trans = config.trans;
  }
  draw(){
    push();
    translate(this.trans[0], this.trans[1], this.trans[2]);
    super.draw();
    pop();
  }
}

class Chip {
  constructor(config){
    let w = config.w;
    let l = config.l;
    let h = config.h;
    this.config = config;
    this.chip = new Board({
      col: this.config.chipColor,
      w: w * 3/4,
      l: l * 3/4,
      h:h
    });
    this.pins = [];
    for(let i = 0; i < 5; i++){
      //TODO: Figure out were to translate pins --> This is still a mess
      //TODO: Figure out what to do with config (such as changing pin color depending on whether they are input/output)
      this.pins.push(new TranslatedBoard({trans: [-5/16*l + i/5 * l * 25/32, -7/16*w, -h/3], col: this.config.pinColor, w: w/8, l: l/4, h: h/4}));
      this.pins.push(new TranslatedBoard({trans: [ 7/16*l, -5/16*w + i/5 * w * 25/32, -h/3], col: this.config.pinColor, w: w/4, l: l/8, h: h/4}));
      this.pins.push(new TranslatedBoard({trans: [ 5/16*l - i/5 * l * 25/32,  7/16*w, -h/3], col: this.config.pinColor, w: w/8, l: l/4, h: h/4}));
      this.pins.push(new TranslatedBoard({trans: [-7/16*l,  5/16*w - i/5 * l * 25/32, -h/3], col: this.config.pinColor, w: w/4, l: l/8, h: h/4}));
    }
  }

  draw(){

    specularMaterial(250);
    shininess(25);
    this.chip.draw();
    shininess(0);
    for(let i = 0; i < this.pins.length; i++){
      this.pins[i].draw();
    }
  }

  getShortestAvailablePath(typeTHIS, typeOTHER, chip){
    let thisPinsOfType = this.pins.filter(pin => pin.type === typeTHIS);
    let otherPinsOfType = chip.pins.filter(pin => pin.type === typeOTHER);
    let closestLength = Number.MAX_SAFE_INTEGER;
    let closestThis = null;
    let closestOther = null;
    for (let i = 0; i < thisPinsOfType.length; i++){
      for (let j = 0; j < otherPinsOfType.length; j++){
        let thisTrans = thisPinsOfType[i].trans;
        let otherTrans = otherPinsOfType[j].trans;
        let len = Math.sqrt(Math.pow(thisTrans[0] - otherTrans[0], 2) + Math.pow(thisTrans[1] - otherTrans[1], 2) + Math.pow(thisTrans[2] - otherTrans[2], 2));
        if (len < closestLength){
          closestLength = len;
          closestThis = thisPinsOfType[i];
          closestOther = otherPinsOfType[i];
        }
      }
    }
    return closestThis, closestOther;
  }
}

class TranslatedChip extends Chip {
  draw(){
    push();
    translate(this.config.trans[0], this.config.trans[1], this.config.trans[2]);
    super.draw();
    pop();
  }
}

class CircuitBoard {
  constructor(config){
    this.config = config;
    this.board = new Board(config.boardConfig)
    this.chips = [];
    for (let i = 0; i < config.chipConfig.length; i++){
      this.chips.push(new TranslatedChip(config.chipConfig[i]));
    }
    //this.wires = new WireSystem(config.connections, this.chips);
  }
  draw(){
    this.board.draw();
    translate(0,0,this.config.boardConfig.h);
    for (let i = 0; i < this.chips.length; i++){
      this.chips[i].draw();
    }
    //this.wires.draw();
  }
}

class Wire {
  constructor(i, j, chips){
    this.input, this.output = chips[i].getClosestShortestAvailablePath("INPUT", "OUTPUT", chips[j]);
    this.path = this.SuperComplexAlgorithm();
    this.mesh = Mesh.fromPath(path);
  }
  draw(){
    this.mesh.draw();
  }
}

class Mesh {
  constructor(mesh){
    this.mesh = mesh;
  }
  draw(){
    for (let i = 0; i < mesh.length - 1; i++){
      beginShape(TRIANGLE_STRIP);
      for (let j = 0; j < mesh[i].length; j++){
        vertex(this.mesh[i][j][0], this.mesh[i][j][1], this.mesh[i][j][2]);
        vertex(this.mesh[i+1][j][0], this.mesh[i+1][j][1], this.mesh[i+1][j][2]);
      }
      endShape();
    }
  }
  fromPath(path){
    mesh = [];
    pointsPerRow = 10;
    for (let i = 0; i < path.length-1; i++){
      mesh[i] = [];
      for (let j = 0; j < pointsPerRow; j++){
        mesh[i][j] = this.rotAroundPath(path[i], path[i+1], j * (2*PI/pointsPerRow));
      }
    }
    return new Mesh(mesh);
  }
}

class WireSystem {
  constructor(conns, chips){
    this.conns = conns;
    this.chips = chips;
    this.wires = [];
    for(let i = 0; i < conns.length; i++){
      for(let j = 0; j < conns[0].length; j++){
        if(conns[i][j] == 1){
          this.wires.push(new Wire(i, j, chips));
        }
      }
    }
  }
  draw(){
    for(let i = 0; i < this.wires.length; i++){
      this.wires[i].draw();
    }
  }
}
