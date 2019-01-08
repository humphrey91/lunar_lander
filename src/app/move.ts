export function Move(object: any) {
  if (object.p5.keyIsDown(object.p5.UP_ARROW)) {
    object.velocity.y -= .01 * object.p5.cos(object.rotation) * 1/object.scale
    object.velocity.x += .01 * object.p5.sin(object.rotation) * 1/object.scale
  }
  if (object.p5.keyIsDown(object.p5.LEFT_ARROW)) {
    object.rotation = object.p5.constrain(object.rotation -= .5,-90,90)
  } 
  if (object.p5.keyIsDown(object.p5.RIGHT_ARROW)) {
    object.rotation = object.p5.constrain(object.rotation += .5,-90,90)
  }
}
