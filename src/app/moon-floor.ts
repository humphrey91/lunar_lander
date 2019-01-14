import { createBlock, Block } from './block'
import { ScoreMarker } from './score-marker'
import { GameCollection } from './game-collection'
export function MoonFloor(idCounter,scale,p5): GameCollection[] {
  let x: number = -100000
  let width: number = 100 
  let height: number = window.innerHeight * 1/scale - (1/10 * window.innerHeight * 1/scale)
  let rotation: number = 0
  let oldRotation: number = 0
  let floorCount: number = 0
  let floor = new GameCollection()
  let stars = new GameCollection()
  let scorePads = new GameCollection()
  let score: ScoreMarker
  while (x < window.innerWidth * 1/scale + 100000) {    
    let piece: Block = createBlock(x, height, width,4,++idCounter,scale,p5)
    let star: Block = createBlock(x, p5.random(height-100*1/scale,0), 2*1/scale,2*1/scale,++idCounter,scale,p5)

    star.color = 'white'
    piece.color = '6C6C6C'

    // set rotation
    p5.push()
    p5.translate(piece.position.x,piece.position.y)
    piece.rotation = rotation
    p5.pop()
    
    // set rotation
    if (floorCount % 10 === 0) {
      rotation = 0
    } else {
      if (window.innerHeight * 1/scale - height < (1/10 * window.innerHeight * 1/scale)) {
        rotation = p5.random(-75,0)
      } else if (window.innerHeight * 1/scale - height > (4/10 * window.innerHeight * 1/scale)) {
        rotation = p5.random(0,75)
      } else {
        rotation = p5.random(-75,75)
      }
    }
      
    // color for testing
    if (oldRotation == 0) {
      let multiplier: number = getMultiplier(width, scale)
      
      score = new ScoreMarker(x - 0.25*width, height - 10 * 1/scale,multiplier, ++idCounter,scale,p5)
      score.color = 'white'
    }

    // set new x value and height/width
    width = p5.random(30 * 1/scale,60 * 1/scale)
    x += (.5 * piece.width * p5.cos(oldRotation) + .5 * width * p5.cos(rotation))
    height = p5.sin(rotation) * .5 * width + piece.vertices[2].y + 2
    oldRotation = rotation   

    // add pieces to various collections
    if (piece.rotation == 0) {
      scorePads.push(piece)
      scorePads.push(score)
    } else {
      floor.push(piece)
    }
    stars.push(star)
    floorCount += 1
  }
  return [floor,stars,scorePads]
}

function getMultiplier(width, scale): number {
  let multiplier: number
  let range: number = 60 * 1/scale - 30 * 1/scale
  let smallest = .25 * range + 30 * 1/scale
  let largest = .75 * range + 30 * 1/scale
  if (width <= smallest) {
    multiplier = 5
  } else if (width > smallest && width < largest) {
    multiplier = 3
  } else if (width >= largest) {
    multiplier = 2
  }
  return multiplier
}