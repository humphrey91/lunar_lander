import {  Block } from './block'
// At the top of the file, with all other imports/requires
const lander = require('../assets/game_icons/Lander.png')

class Lander extends Block {
  constructor(x: number,y: number,w: number,h: number,id: number, distances: p5.Vector[],scale: number, p5: p5) {
      super(x,y,w,h,id, distances,scale, p5)
  }

  image: p5.Image = this.preload()

  shape(): void {
    this.p5.push()
    this.p5.translate(this.position.x, this.position.y)
    this.p5.rotate(this.rotation)
    this.p5.image(this.image, 0, 0, this.width, this.height)
    this.p5.pop()
    this.p5.textSize(18 * 1/this.scale)
    this.p5.fill('white')  
    this.p5.text("Horizontal Speed:" + this.p5.round(this.velocity.x * 5), (window.innerWidth - 200) * 1/this.scale , 30 * 1/this.scale)
    this.p5.text("Vertical Speed:" + this.p5.round(this.velocity.y * 5), (window.innerWidth - 178) * 1/this.scale , 50 * 1/this.scale)
    this.p5.text("Rotation:" + this.rotation, (window.innerWidth - 130) * 1/this.scale , 70 * 1/this.scale) 
  }

  update(): void {
    super.update()
    this.shape()
  }

  preload() {
    return this.p5.loadImage(lander);
  }

}

function createLander(x: number,y: number,scale: number,id: number, p5: p5): Lander {
  let w = 26 * 1/scale
  let h = 27 * 1/scale
  let distances: p5.Vector[] = [
    p5.createVector(-w / 2,h / 2),
    p5.createVector(-w / 2,-h / 2),
    p5.createVector(w / 2,-h / 2),
    p5.createVector(w / 2,h / 2)
  ]
  return new Lander(x, y, w, h, id, distances,scale,p5)
}

function checkLanding(lander: Lander, floorPiece: Block, p: p5) {
  if (lander.rotation >= -1 && lander.rotation <= 1 && lander.velocity.x < 1 && lander.velocity.y < 1) {
    lander.velocity.x = 0
    lander.velocity.y = 0
    lander.rotation = 0
    lander.acceleration.y = 0
    lander.position.x = floorPiece.position.x
    lander.position.y = floorPiece.position.y - .5 * lander.height
    console.log("success")
    return true
  } else {
    return false
  }
}

function handleCrash(lander: Lander, p5: p5) {

}

export { Lander, createLander, checkLanding, handleCrash }
