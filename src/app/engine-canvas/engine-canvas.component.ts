import { Component, OnInit } from '@angular/core';

import * as p5 from "p5";
import "p5/lib/addons/p5.sound";
import "p5/lib/addons/p5.dom";
import { createBlock, Block } from "../block"
import { createTriangle, Triangle } from "../triangle"
import { GameCollection } from '../game-collection'

var gameCollection: GameCollection = new GameCollection();
var idCounter: number = 0;
var rotation: number = 0

@Component({
  selector: 'app-engine-canvas',
  templateUrl: './engine-canvas.component.html',
  styleUrls: ['./engine-canvas.component.scss']
})

export class EngineCanvasComponent implements OnInit {
  private p5sketch: p5;
  constructor() {     
  }

  ngOnInit() {
    this.p5sketch = new p5(this.sketch)
  }

  private sketch(p: p5) {
    p.setup = function() {
      p.rectMode(p.CENTER)
      p.angleMode(p.DEGREES)  
      p.createCanvas(window.innerWidth, window.innerHeight);

      let piece: any = createBlock(100,100,50,50,++idCounter,p)
      gameCollection.push(piece)
      piece = createTriangle(100,100,100,200,300,100,++idCounter,p)
      gameCollection.push(piece)
    };

     // draw 
     p.draw = function() {
      rotation += 1
      p.background(200);
      gameCollection.update()
      gameCollection.checkCollision()
      gameCollection[0].position.x = p.mouseX
      gameCollection[0].position.y = p.mouseY
      gameCollection.forEach(piece => {
        piece.rotation = rotation
        piece.vertices.forEach(vertex => {
          p.fill('red')
          p.ellipse(vertex.x,vertex.y,10)
        })
      })
    }
  }
}
