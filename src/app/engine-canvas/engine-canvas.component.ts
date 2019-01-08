import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as p5 from "p5";
import "p5/lib/addons/p5.sound";
import "p5/lib/addons/p5.dom";
import { createLander, Lander, checkLanding, handleCrash } from "../lander"
import { GameCollection } from '../game-collection'
import { MoonFloor } from '../moon-floor'

@Component({
  selector: 'app-engine-canvas',
  templateUrl: './engine-canvas.component.html',
  styleUrls: ['./engine-canvas.component.scss']
})

export class EngineCanvasComponent implements OnInit {
  _scale: number
  constructor() { 
    this._scale = (500 / (window.innerHeight + window.innerWidth))
  }

  p5sketch: p5;
  _isStarted: boolean 
  
  idCounter = 0
  gameCollection: any = new GameCollection()
  
  isZoomed: boolean = false
  zoomX: number
  zoomY: number
  floor: GameCollection
  stars: GameCollection

  ngOnInit() {
    let moon = document.getElementById('moonLander')
    this.p5sketch = new p5(this.sketch.bind(this), moon, true)
  }

  @Output() reset = new EventEmitter<boolean>()

  @Input() set isStarted(value: boolean) {
    this._isStarted = value
    if (value) {
      this.gameCollection.hero.position.x = 300 * 1/this.scale
      this.gameCollection.hero.position.y = 50 * 1/this.scale
      this.gameCollection.hero.velocity.x = 3 * this.scale
      this.gameCollection.hero.velocity.y = 3 * this.scale
      this.gameCollection.hero = this.gameCollection.hero
    }
  }

  get isStarted() {
    return this._isStarted
  }

  private sketch(p: p5) {
    p.setup = () => {
      p.rectMode(p.CENTER)
      p.angleMode(p.DEGREES) 
      p.imageMode(p.CENTER)
      p.createCanvas(window.innerWidth, window.innerHeight);
      this.createGamePieces(p) 
    };

     // draw 
    p.draw = () => {     
      p.background(0);
      this.checkScroll(p)
      if(this.isZoomed) {
        p.translate(-this.zoomX,-this.zoomY)
      }
      p.scale(this.scale)
      if (!this.isStarted) {
        this.landerIntro(this.gameCollection.hero, p)
      } else {
        this.checkScale(p)
        this.gameCollection.hero.test()
      }
      this.gameCollection.update()
      let hits = this.gameCollection.hero.checkCollision(this.floor)
      if(hits.length > 0) {
        this.handleHits(hits, p)
      }
    }
  }

  set scale(value) {
    this._scale = value
    this.gameCollection.forEach(piece => {
      piece.scale = this._scale
    })
    this.isZoomed = !this.isZoomed
  }

  get scale() {
    return this._scale
  }

  createGamePieces(p: p5): void {
    let ship = this.initLander(p)
    let landscape = MoonFloor(this.idCounter, this.scale,p)
    this.floor = landscape[0]
    this.stars = landscape[1]
    this.gameCollection.unshift(ship)
    this.gameCollection = this.gameCollection.concat(this.floor)
    this.gameCollection.unshift(...this.stars)
    this.gameCollection.hero = ship
    
  }

  landerIntro(piece: Lander, p: p5) {
    piece.velocity.x = 3
    if (piece.position.x > window.innerWidth * 1/this.scale) {
      piece.position.x = 0
    }
  }

  initLander(p: p5): Lander {
    let piece: any = createLander(300*1/this.scale,100*1/this.scale,this.scale,++this.idCounter,p)
    piece.checkCollide = true
    piece.color = 'grey'
    piece.rotation = 25
    piece.gravity = true
    return piece
  }

  resetGame(p: p5): void {
    this.isStarted = false
    if (this.isZoomed) {
      this.scale = this.scale / 2
      this.zoomX = 0
      this.zoomY = 0
    }
    this.gameCollection = new GameCollection
    this.createGamePieces(p) 
    this.reset.emit(true)
  }

  handleHits(hits: number[], p:p5): void {
    hits.forEach(hit => {
      this.floor.find(piece => {
        if (piece.id == hit) {
          if (piece.rotation == 0) {
            if (!checkLanding(this.gameCollection.hero, piece, p)) {
              this.crash(p)
              return piece
            } else {
              
            }
          } else {
            this.crash(p)
            return piece
          }
        }
      })      
    })
  }

  crash(p: p5) {
    handleCrash(this.gameCollection.hero, p)    
    this.resetGame(p)
  }

  checkScale(p: p5) {
    if (this.gameCollection.hero.near(this.floor)) {
      if (!this.isZoomed) {
        this.scale = 2 * this.scale
        this.zoomX = this.gameCollection.hero.position.x * this.scale - (.2 * window.innerWidth)
        this.zoomY = this.gameCollection.hero.position.y * this.scale - (.3 * window.innerHeight)
      }
    } else {
      if (this.isZoomed) {
        this.scale = this.scale / 2
        this.zoomX = 0
        this.zoomY = 0
      }
    }
  }

  checkScroll(p: p5): void {
    if (this.gameCollection.hero.position.x < (1/5 * window.innerWidth * 1/this.scale)) {
      p.translate((-this.gameCollection.hero.position.x * this.scale)+(1/5 * window.innerWidth), 0)
    } else if(this.gameCollection.hero.position.x > (4/5 * window.innerWidth * 1/this.scale)) {
      p.translate((4/5 * window.innerWidth) - this.gameCollection.hero.position.x * this.scale, 0)
    } 
  }
}
