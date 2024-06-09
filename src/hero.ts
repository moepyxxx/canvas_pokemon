import { Character } from "./character";
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
    super(context, position, vector, width, height, imagePath);
  }

  update() {
    this.position.set({
      x: this.position.target.x,
      y: this.position.target.y,
    });
    this.draw();
  }
}
