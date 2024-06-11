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
  images: Record<string, HTMLImageElement> = {};
  frame: number = Calculate.getRandomNumberFromRange(1, 5);

  constructor(
    canvasUtil: CanvasUtility,
    position: PositionType,
    vector: PositionType,
    width: number,
    height: number,
    imageKeyPaths?: Record<string, string>
  ) {
    this.canvasUtil = canvasUtil;
    this.position = new Position(position);
    this.vector = new Position(vector);
    this.width = width;
    this.height = height;
    if (imageKeyPaths) {
      Object.keys(imageKeyPaths).forEach((key) => {
        this.setImage(imageKeyPaths[key], key);
      });
    }
    if (Object.keys(this.images).length === 0) {
      this.ready = false;
    }
  }

  setImage(path: string, key: string) {
    this.images[key] = new Image();
    this.images[key].addEventListener(
      "load",
      () => {
        this.ready = true;
      },
      false
    );
    this.images[key].src = path;
  }

  draw(image: HTMLImageElement, width?: number, height?: number) {
    if (!image) {
      throw new Error("image not loaded");
    }
    const offsetX = this.width / 2;
    const offsetY = this.height / 2;
    this.canvasUtil.context.drawImage(
      image,
      this.position.target.x - offsetX,
      this.position.target.y - offsetY,
      width ?? this.width,
      height ?? this.height
    );
    this.frame++;
  }
}
