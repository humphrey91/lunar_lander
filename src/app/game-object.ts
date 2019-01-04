import 'p5'
export class GameObject {
  /**
 * @position
 * A Vector that defines the center pont of a GameObject
 * 
 * @velocity
 * A velocity vector
 * 
 * @acceleration
 * An acceleration vector
 * 
 * @color
 * The color of the object
 * 
 * @id
 * A unique identifier
 * 
 * @rotation
 * Angle in degrees of object rotation
 * 
 * @gravity
 * If object should have gravity applied
 * 
 */
  position: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;
  color: string;
  readonly id: number;
  rotation: number;
  gravity: boolean;
  distances: Array<p5.Vector>
  p5: p5

  constructor(x: number, y: number, id: number, distances: Array<p5.Vector>, p5: p5){
      this.position = p5.createVector(x, y)
      this.velocity = p5.createVector(0,0)
      this.acceleration = p5.createVector(0,0.163)
      this.color = 'black'
      this.id = id
      this.rotation = 0
      this.gravity = false
      this.distances = distances
      this.p5 = p5
  }

  applyGravity(): void {
      if (this.gravity) {
          this.velocity.add(this.acceleration)
      }
  }

  move(): void {
      this.position.add(this.velocity)
  }

  update(): void {
      this.applyGravity()
      this.move()
  }

  get vertices(): Array<p5.Vector> {
      // [cos𝜃 −sin𝜃][𝑥]=[𝑥 cos𝜃 − 𝑦 sin𝜃]
      // [sin𝜃  cos𝜃][𝑦]=[𝑥 sin𝜃 + 𝑦 cos𝜃]
      let r: number = this.rotation
      let vertices: Array<p5.Vector> = []
      this.distances.forEach(distance => {
          vertices.push(this.p5.createVector(distance.x * this.p5.cos(r) - distance.y * this.p5.sin(r) + this.position.x, distance.x * this.p5.sin(r) + distance.y * this.p5.cos(r) + this.position.y))
      })
      return vertices
  }

  checkCollision(objects: Array<GameObject>): void {
      let hits: Array<number> = []

      let otherPieces: Array<GameObject> = objects.filter((obj) => {
          return obj != this 
      })

      // projects sides against all axis of 2 objects and determines if all of the sides are overlapping
      // see Separating Axis Theorem (SAT) https://en.wikipedia.org/wiki/Hyperplane_separation_theorems
      otherPieces.forEach(element => {
          let hit: boolean = true
          let axes1: Array<p5.Vector> = this.normalAxes()
          let axes2: Array<p5.Vector> = element.normalAxes()
          for (let i = 0; i < axes1.length; i++) {
              let axis: p5.Vector = axes1[i].copy()
          
              let p1: Array<number> = this.projection(axis);
              let p2: Array<number> = element.projection(axis);
              
              if (!this.overlap(p1,p2)) {  
                  hit = false
              }
          }
          for (let i = 0; i < axes2.length; i++) {
              let axis2: p5.Vector = axes2[i].copy()
              
              let p1: Array<number> = this.projection(axis2);
              let p2: Array<number> = element.projection(axis2);
              
              if (!this.overlap(p1,p2)) {  
                  hit = false
              }
          }
          if (hit) { hits.push(element.id) }
      });
      
      this.handleCollision(hits, objects)      
  }

  normalAxes(): Array<p5.Vector> {
      // gets an axis so we can project the side against it
      const vertices: Array<p5.Vector> = this.vertices
      let normalAxis: Array<p5.Vector> = []
      for (let i = 0; i < vertices.length; i++) {
          let n1: p5.Vector = vertices[i].copy()
          let n2: p5.Vector = vertices[i+1 == vertices.length ? 0 : i+1].copy()
      
          let edge: p5.Vector = n1.sub(n2)
          
          let normal: p5.Vector = this.p5.createVector(-edge.y,edge.x)
          
          normalAxis.push(normal)
      }
      return normalAxis
  }

  projection(axis: p5.Vector): Array<number> {
      // projects side against axis
      const vertices: Array<p5.Vector> = this.vertices
      let min: number = axis.dot(vertices[0])
      let max: number = min
      for (let i = 1; i < vertices.length; i++) {
          let p: number = axis.dot(vertices[i])
          if (p < min) {
              min = p
          } else if (p > max) {
              max = p
          }
      }
      return [min , max]
  }

  overlap(element1: Array<number>,element2: Array<number>): boolean {
      if (Math.max(element1[0], element2[0]) < Math.min(element1[1], element2[1])) { return true }
  }

  handleCollision(hits: Array<number>, gamePieces: Array<GameObject>): void {
      if (hits.length > 0) {
          this.color = 'red'
      } else {
          this.color = 'black'
      }
      hits.forEach(hit => {
          let hitPiece: GameObject = gamePieces.find(piece => {
              return piece.id === hit
          })
          hitPiece.velocity.x = -hitPiece.velocity.x 
          hitPiece.velocity.y = -hitPiece.velocity.y 
      })
  }
}
