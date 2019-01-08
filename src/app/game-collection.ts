import { GameObject } from './game-object';

export class GameCollection extends Array {
  hero: any
  constructor() {
      super()
  }

  update = (): void => {
      let range = window.innerWidth * 1/this.hero.scale
      let objects = this.filter(piece => {
          return piece.p5.abs(this.hero.position.x - piece.position.x) < range
      })
    //   console.log(objects)
      for (let i = 0; i < objects.length; i++) {  
        objects[i].update()
      }
      this.checkHero()
  }

  checkCollision = (): void => {
      for (let i = 0; i < this.length; i++) {
        if (this[i].checkCollide) {
          this[i].checkCollision(this)
        }
      }
  }

  checkHero() {
      if (this.hero) {
        this.hero.movement()
      }
  }
}
