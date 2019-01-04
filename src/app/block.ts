import { GameObject } from './game-object'

class Block extends GameObject {
  /**
   * @w
   * @h
   * Defines width and height of Block
   */
  width: number
  height: number
  sides: number
  
  constructor(x: number,y: number,w: number,h: number,id: number, distances: Array<p5.Vector>, p5: p5) {
      super(x,y,id, distances, p5)
      this.width = w
      this.height = h
      this.sides = 4
  }

  shape(): void {
      this.p5.noStroke()
      this.p5.fill(this.color)    
      this.p5.push()
      this.p5.translate(this.position.x, this.position.y)
      this.p5.rotate(this.rotation)
      this.p5.rect(0, 0, this.width, this.height)
      this.p5.pop()
  }

  update(): void {
      super.update()
      this.shape()
  }
}

function createBlock(x,y,w,h,id,p5) {
  let distances: Array<p5.Vector> = [
    p5.createVector(-w / 2,h / 2),
    p5.createVector(-w / 2,-h / 2),
    p5.createVector(w / 2,-h / 2),
    p5.createVector(w / 2,h / 2)
  ]
  return new Block(x, y, w, h, id, distances,p5)
}

export { Block, createBlock }