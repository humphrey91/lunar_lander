import { GameObject } from './game-object';

export class GameCollection extends Array {
  hero: GameObject
  constructor() {
      super()
      this.hero = null
  }

  update = (): void => {
      for (let i = 0; i < this.length; i++) {
          this[i].update()
      }
  }

  checkCollision = (): void => {
      for (let i = 0; i < this.length; i++) {
          this[i].checkCollision(this)
      }
  }
}
