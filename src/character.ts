import { Calculate } from "./calculate";
import { CanvasUtility } from "./canvas";
import { Position, PositionType } from "./position";

export class Character {
  canvasUtil: CanvasUtility;
  position: Position;
  vector: Position;
  width: number;
  height: number;
  ready: boolean = false;
  image: HTMLImageElement | null = null;
  frame: number = Calculate.getRandomNumberFromRange(1, 5);

  constructor(
    canvasUtil: CanvasUtility,
    position: PositionType,
    vector: PositionType,
    width: number,
    height: number
  ) {
    this.canvasUtil = canvasUtil;
    this.position = new Position(position);
    this.vector = new Position(vector);
    this.width = width;
    this.height = height;
  }

  setImage(path: string) {
    this.image = new Image();
    this.image.addEventListener(
      "load",
      () => {
        this.ready = true;
      },
      false
    );
    this.image.src = path;
  }

  draw() {
    if (!this.image) {
      throw new Error("image not loaded");
    }
    const offsetX = this.width / 2;
    const offsetY = this.height / 2;
    this.canvasUtil.context.drawImage(
      this.image,
      this.position.target.x - offsetX,
      this.position.target.y - offsetY,
      this.width,
      this.height
    );
    this.frame++;
  }
}
