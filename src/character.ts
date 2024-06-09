import { Calculate } from "./calculate";
import { Position, PositionType } from "./position";

export class Character {
  context2d: CanvasRenderingContext2D;
  position: Position;
  vector: Position;
  width: number;
  height: number;
  ready: boolean = false;
  image: HTMLImageElement | null = null;
  frame: number = Calculate.getRandomNumberFromRange(1, 5);

  constructor(
    context: CanvasRenderingContext2D,
    position: PositionType,
    vector: PositionType,
    width: number,
    height: number
  ) {
    this.context2d = context;
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
    this.context2d.drawImage(
      this.image,
      this.position.target.x - offsetX,
      this.position.target.y - offsetY,
      this.width,
      this.height
    );
    this.frame++;
  }
}
