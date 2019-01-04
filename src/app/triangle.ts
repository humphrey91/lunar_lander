import { GameObject } from './game-object'

class Triangle extends GameObject {
sides: number
  constructor(position: p5.Vector,id: number, distances: Array<p5.Vector>, p5: p5) {
    super(position.x,position.y,id, distances, p5)
    this.sides = 3
  }

  shape(): void {
    this.p5.noStroke()
    this.p5.fill(this.color)
    this.p5.push()
    this.p5.translate(this.position.x, this.position.y)
    this.p5.rotate(this.rotation)
    this.p5.triangle(this.distances[0].x,this.distances[0].y,this.distances[1].x,this.distances[1].y,this.distances[2].x,this.distances[2].y)
    this.p5.pop()
  }

  update(): void {
    super.update()
    this.shape()
  }
}

function createTriangle(x1,y1,x2,y2,x3,y3,id,p5) {
  let coordinates: Array<number> = [x1,y1,x2,y2,x3,y3]
  // Calc the center point of the triangle for its position coordinates
    // (x,y) = (x1 + 2/3(1/2(x2+x3) - x1), y1 + 2/3(1/2(y2+y3) - y1))
  let position: p5.Vector = p5.createVector((x1 + (2/3 * (.5 * (x2 + x3) - x1))),(y1 + (2/3 * (.5 * (y2 + y3) - y1))))
  let distances: Array<p5.Vector> = []
  for (let i = 0; i < coordinates.length; i+=2) {
    distances.push(p5.createVector(coordinates[i] - position.x, coordinates[i+1] - position.y))
  }
  return new Triangle(position, id, distances,p5)
}

export { Triangle, createTriangle }