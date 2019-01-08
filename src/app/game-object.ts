import 'p5'
import { Move } from './move'

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
    distances: p5.Vector[]
    p5: p5
    checkCollide: boolean
    _scale: number
    constructor(x: number, y: number, id: number, distances: p5.Vector[],scale, p5: p5){
        this.position = p5.createVector(x, y)
        this.velocity = p5.createVector(0,0)
        this.color = 'red'
        this.id = id
        this.rotation = 0
        this.gravity = false
        this.distances = distances
        this.p5 = p5
        this.checkCollide = false
        this._scale = scale
        this.acceleration = p5.createVector(0,0.003 * 1/this.scale)
    }

    set scale(value) {
        this._scale = value
        this.acceleration = this.p5.createVector(0,0.003 * 1/this.scale)
    }

    get scale() {
        return this._scale
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

    movement(): void {
        Move(this)
    }

    get vertices(): p5.Vector[] {
        if (this.distances.length  == 0) {
            return []
        }
        // [cos𝜃 −sin𝜃][𝑥]=[𝑥 cos𝜃 − 𝑦 sin𝜃]
        // [sin𝜃  cos𝜃][𝑦]=[𝑥 sin𝜃 + 𝑦 cos𝜃]
        let r: number = this.rotation
        let vertices: p5.Vector[] = []
        this.distances.forEach(distance => {
            vertices.push(this.p5.createVector(distance.x * this.p5.cos(r) - distance.y * this.p5.sin(r) + this.position.x,
                                                distance.x * this.p5.sin(r) + distance.y * this.p5.cos(r) + this.position.y))
        })
        return vertices
    }

    checkCollision(objects: GameObject[]): number[] {
        let hits: number[] = []

        let range = window.innerWidth * 1/this.scale
        let closeObjects = objects.filter(piece => {
            return piece.p5.abs(this.position.x - piece.position.x) < range
        })

      // projects sides against all axis of 2 objects and determines if all of the sides are overlapping
      // see Separating Axis Theorem (SAT) https://en.wikipedia.org/wiki/Hyperplane_separation_theorems
      closeObjects.forEach(element => {
            let hit: boolean = true
            let axes1: p5.Vector[] = this.normalAxes()
            let axes2: p5.Vector[] = element.normalAxes()
            for (let i = 0; i < axes1.length; i++) {
                let axis: p5.Vector = axes1[i].copy()
            
                let p1: number[] = this.projection(axis);
                let p2: number[] = element.projection(axis);
                
                if (!this.overlap(p1,p2)) {  
                    hit = false
                }
            }
            for (let i = 0; i < axes2.length; i++) {
                let axis2: p5.Vector = axes2[i].copy()
                
                let p1: number[] = this.projection(axis2);
                let p2: number[] = element.projection(axis2);
                
                if (!this.overlap(p1,p2)) {  
                    hit = false
                }
            }
            if (hit) { hits.push(element.id) }
        });
      
        return hits   
    }

    normalAxes(): p5.Vector[] {
        // gets an axis so we can project the side against it
        const vertices: p5.Vector[] = this.vertices
        let normalAxis: p5.Vector[] = []
        for (let i = 0; i < vertices.length; i++) {
            let n1: p5.Vector = vertices[i].copy()
            let n2: p5.Vector = vertices[i+1 == vertices.length ? 0 : i+1].copy()
        
            let edge: p5.Vector = n1.sub(n2)
            
            let normal: p5.Vector = this.p5.createVector(-edge.y,edge.x)
            
            normalAxis.push(normal)
        }
        return normalAxis
  }

    projection(axis: p5.Vector): number[] {
      // projects side against axis
        const vertices: p5.Vector[] = this.vertices
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

    overlap(element1: number[],element2: number[]): boolean {
        if (Math.max(element1[0], element2[0]) < Math.min(element1[1], element2[1])) { return true }
    }

    near(objects: GameObject[]): boolean {
        let obs: GameObject[] = objects.filter(object => {
            return this.p5.dist(this.position.x,this.position.y,object.position.x,object.position.y) < 800
        })
        
        if (obs.length > 0) {
            return true
        } else {
            return false
        }
    }
}
