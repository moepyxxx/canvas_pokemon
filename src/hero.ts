import { CanvasUtility } from "./canvas";
import { Character } from "./character";
import {
  COMMENTARY_END_HEIGHT,
  COMMENTARY_END_WIDTH,
  COMMENTARY_START_HEIGHT,
  COMMENTARY_START_WIDTH,
  HERO_HEIGHT,
  HERO_WIDTH,
  POKEMON_WIDTH,
  TREE_WIDTH,
} from "./const";
import { Keys } from "./keyboardInput";
import { PositionType } from "./position";

export class Hero extends Character {
  heroDirection: "above" | "below" | "left" | "right" = "below";

  constructor(
    canvasUtil: CanvasUtility,
    position: PositionType,
    vector: PositionType,
    imageKeyPaths: Record<string, string>
  ) {
    super(canvasUtil, position, vector, HERO_WIDTH, HERO_HEIGHT, imageKeyPaths);
  }

  update(
    keys: Keys,
    pokemonPositions: Record<number, PositionType>
  ): number | false {
    const isCollision = this.isCollision(pokemonPositions);
    if (isCollision !== false) {
      // nop
    } else {
      this.walk(keys);
    }

    this.draw(this.images[`hero_${this.heroDirection}`] as HTMLImageElement);

    return isCollision;
  }

  walk(keys: Keys) {
    // 現在の主人公の位置を取得
    let x = this.position.target.x;
    let y = this.position.target.y;

    // キーボードの状況に応じて主人公の位置を更新
    const speed = 3;
    if (keys.ArrowUp) {
      this.heroDirection = "above";
      y -= speed;
    }
    if (keys.ArrowDown) {
      this.heroDirection = "below";
      y += speed;
    }
    if (keys.ArrowLeft) {
      this.heroDirection = "left";
      x -= speed;
    }
    if (keys.ArrowRight) {
      this.heroDirection = "right";
      x += speed;
    }

    // 位置を更新
    const { x: finalX, y: finalY } = this.validPosition(x, y);
    this.position.set({ x: finalX, y: finalY });
  }

  isCollision(pokemonPositions: Record<number, PositionType>): number | false {
    const pokemonID = Object.keys(pokemonPositions).find((key) => {
      const distance = this.position.distance(pokemonPositions[Number(key)]);
      if (distance < this.width + POKEMON_WIDTH / 8) {
        return true;
      }
      return false;
    });
    return Number(pokemonID) || false;
  }
}
