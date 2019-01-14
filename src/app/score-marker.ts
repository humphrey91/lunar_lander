import { GameObject } from './game-object';

export class ScoreMarker extends GameObject {
    score: number
    constructor(x: number, y: number, score: number, id: number,scale: number, p5: p5) {
        super(x, y, id, [], scale, p5)
        this.score = score
    }

    checkCollide = false

    shape(): void {
        this.p5.fill(this.color)
        this.p5.textSize(16 * 1/this.scale)
        this.p5.text(this.score + "X", this.position.x,this.position.y)        
    }
    
    update(): void {
        super.update()
        this.shape()
    }

}
