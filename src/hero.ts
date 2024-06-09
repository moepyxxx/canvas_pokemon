import { Character } from "./character";
import { Keys } from "./keyboardInput";
import { PositionType } from "./position";

const HERO_WIDTH = 32;
const HERO_HEIGHT = 32;
export class Hero extends Character {
  constructor(
    context: CanvasRenderingContext2D,
    position: PositionType,
    vector: PositionType,
    imagePath: string
  ) {
    super(context, position, vector, HERO_WIDTH, HERO_HEIGHT);
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
      x: Math.min(Math.max(x, 0), this.context2d.canvas.width - HERO_WIDTH / 2),
      y: Math.min(
        Math.max(y, 0),
        this.context2d.canvas.height - HERO_HEIGHT / 2
      ),
    });
    this.draw();
  }
}
