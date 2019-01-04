import { Component, OnInit, Renderer2 } from '@angular/core';

import * as p5 from "p5";
import "p5/lib/addons/p5.sound";
import "p5/lib/addons/p5.dom";
import { createBlock } from "../block"
import { createTriangle } from "../triangle"
import { GameCollection } from '../game-collection'

@Component({
  selector: 'app-engine-canvas',
  templateUrl: './engine-canvas.component.html',
  styleUrls: ['./engine-canvas.component.scss']
})

export class EngineCanvasComponent implements OnInit {
  p5sketch: p5;
  gameCollection: GameCollection
  idCounter: number
  rotation: number
  constructor(private renderer: Renderer2) { 
    this.gameCollection = new GameCollection();
    this.idCounter = 0;
    this.rotation = 0  
  }

  ngOnInit() {
    let moon = document.getElementById('moonLander')
    this.p5sketch = new p5(this.sketch.bind(this), moon, true)
  }

  private sketch(p: p5) {
    p.setup = () => {
      p.rectMode(p.CENTER)
      p.angleMode(p.DEGREES)  
      p.createCanvas(window.innerWidth, window.innerHeight);

      let piece: any = createBlock(100,100,50,50,++this.idCounter,p)
      this.gameCollection.push(piece)
      piece = createTriangle(100,100,100,200,300,100,++this.idCounter,p)
      this.gameCollection.push(piece)
    };

     // draw 
    p.draw = () => {
      // let scale: number = .1
      // p.scale(scale)
      this.rotation += 1
      p.background(200);
      this.gameCollection.update()
      this.gameCollection.checkCollision()
      this.gameCollection[0].position.x = p.mouseX
      this.gameCollection[0].position.y = p.mouseY
      this.gameCollection.forEach(piece => {
        piece.rotation = this.rotation
        piece.vertices.forEach(vertex => {
          p.fill('red')
          p.ellipse(vertex.x,vertex.y,10)
        })
      })
      
    }
  }
}
