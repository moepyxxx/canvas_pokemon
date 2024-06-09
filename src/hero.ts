import { CanvasUtility } from "./canvas";
import { Character } from "./character";
import { Keys } from "./keyboardInput";
import { PositionType } from "./position";

const HERO_WIDTH = 32;
const HERO_HEIGHT = 32;
export class Hero extends Character {
  constructor(
    canvasUtil: CanvasUtility,
    position: PositionType,
    vector: PositionType,
    imagePath: string
  ) {
    super(canvasUtil, position, vector, HERO_WIDTH, HERO_HEIGHT);
    this.setImage(imagePath);
  }

  update(keys: Keys) {
    let x = this.position.target.x;
    let y = this.position.target.y;
    if (keys.ArrowUp) {
      y -= 2;
    }
    if (keys.ArrowDown) {
      y += 2;
    }
    if (keys.ArrowLeft) {
      x -= 2;
    }
    if (keys.ArrowRight) {
      x += 2;
    }
    this.position.set({
      x: Math.min(
        Math.max(x, 0),
        this.canvasUtil.canvas.width - HERO_WIDTH / 2
      ),
      y: Math.min(
        Math.max(y, 0),
        this.canvasUtil.canvas.height - HERO_HEIGHT / 2
      ),
    });
    this.draw();
  }
}
