import { TREE_WIDTH } from ".";
import { CanvasUtility } from "./canvas";
import { Character } from "./character";
import { Keys } from "./keyboardInput";
import { POKEMON_WIDTH } from "./pokemon";
import { PositionType } from "./position";

const HERO_WIDTH = 32;
const HERO_HEIGHT = 32;
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
      console.log("collision!");
    } else {
      let x = this.position.target.x;
      let y = this.position.target.y;
      if (keys.ArrowUp) {
        this.heroDirection = "above";
        y -= 2;
      }
      if (keys.ArrowDown) {
        this.heroDirection = "below";
        y += 2;
      }
      if (keys.ArrowLeft) {
        this.heroDirection = "left";
        x -= 2;
      }
      if (keys.ArrowRight) {
        this.heroDirection = "right";
        x += 2;
      }

      this.position.set({
        x: Math.min(
          Math.max(x, 0 + TREE_WIDTH + HERO_WIDTH / 2),
          this.canvasUtil.canvas.width - HERO_WIDTH / 2 - TREE_WIDTH
        ),
        y: Math.min(
          Math.max(y, 0 + TREE_WIDTH + HERO_HEIGHT / 2),
          this.canvasUtil.canvas.height - HERO_HEIGHT / 2 - TREE_WIDTH
        ),
      });
    }

    this.draw(this.images[`hero_${this.heroDirection}`] as HTMLImageElement);

    return isCollision;
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
