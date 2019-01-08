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
  
  constructor(x: number,y: number,w: number,h: number,id: number, distances: p5.Vector[],scale, p5: p5) {
      super(x,y,id, distances,scale, p5)
      this.width = w
      this.height = h
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

  test() {
    this.vertices.forEach(vert => {
      this.p5.fill('red')
      this.p5.ellipse(vert.x,vert.y,10)
    })
  }
}

function createBlock(x,y,w,h,id,scale,p5) {
  let dw = w 
  let dh = h 
  let distances: p5.Vector[] = [
    p5.createVector(-dw / 2,dh / 2),
    p5.createVector(-dw / 2,-dh / 2),
    p5.createVector(dw / 2,-dh / 2),
    p5.createVector(dw / 2,dh / 2)
  ]
  return new Block(x, y, w, h, id, distances,scale,p5)
}

export { Block, createBlock }