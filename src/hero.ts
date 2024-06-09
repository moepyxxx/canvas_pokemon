import { Character } from "./character";
import { Keys } from "./keyboardInput";
import { PositionType } from "./position";
export class Hero extends Character {
  constructor(
    context: CanvasRenderingContext2D,
    position: PositionType,
    vector: PositionType,
    width: number,
    height: number,
    imagePath: string
  ) {
    super(context, position, vector, width, height);
    this.setImage(imagePath);
  }

  update(keys: Keys) {
    let x = this.position.target.x;
    let y = this.position.target.y;
    if (keys.ArrowUp) {
      y -= 1;
    }
    if (keys.ArrowDown) {
      y += 1;
    }
    if (keys.ArrowLeft) {
      x -= 1;
    }
    if (keys.ArrowRight) {
      x += 1;
    }
    this.position.set({
      x,
      y,
    });
    this.draw();
  }
}
