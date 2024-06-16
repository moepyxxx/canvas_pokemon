import { Calculate } from "./calculate";
import { CanvasUtility } from "./canvas";
import {
  COMMENTARY_END_HEIGHT,
  COMMENTARY_END_WIDTH,
  COMMENTARY_START_HEIGHT,
  COMMENTARY_START_WIDTH,
  TREE_WIDTH,
} from "./const";
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

  validPosition(x: number, y: number): PositionType {
    let minX = 0 + TREE_WIDTH + this.width / 2;
    let maxX = this.canvasUtil.canvas.width - this.width / 2 - TREE_WIDTH;
    let minY = 0 + TREE_WIDTH + this.height / 2;
    let maxY = this.canvasUtil.canvas.height - this.height / 2 - TREE_WIDTH;

    if (x > COMMENTARY_START_WIDTH && x < COMMENTARY_END_WIDTH) {
      maxY = COMMENTARY_START_HEIGHT - this.height / 2;
    }

    if (y > COMMENTARY_START_HEIGHT && y < COMMENTARY_END_HEIGHT) {
      minX = COMMENTARY_END_WIDTH + this.width / 2;
    }

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  }
}
