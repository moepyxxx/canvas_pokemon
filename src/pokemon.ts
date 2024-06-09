import { Calculate } from "./calculate";
import { CanvasUtility } from "./canvas";
import { Character } from "./character";
import { PokeAPI } from "./pokeAPI";
import { PositionType } from "./position";

const MIN_ID_NUMBER = 1;
const MAX_ID_NUMBER = 386;
const POKEMON_WIDTH = 64;
const POKEMON_HEIGHT = 64;

export class Pokemon extends Character {
  private pokeAPI = new PokeAPI();
  private walkStartFrame: number | null = null;
  private workArrow: "up" | "down" | "left" | "right" = "up";
  private walkSpeed = 1;
  private counterID: number = 0;

  constructor(context: CanvasUtility, vector: PositionType, counterID: number) {
    super(context, { x: 0, y: 0 }, vector, POKEMON_WIDTH, POKEMON_HEIGHT);
    this.counterID = counterID;
  }

  async setNewPokemon(): Promise<PositionType> {
    const pokemon = await this.pokeAPI.fetchPokemon(
      Calculate.getRandomNumberFromRange(MIN_ID_NUMBER, MAX_ID_NUMBER)
    );
    this.setImage(pokemon.sprites.front_default);
    const position = {
      x: Calculate.getRandomNumberFromRange(
        POKEMON_WIDTH / 2,
        this.canvasUtil.canvas.width
      ),
      y: Calculate.getRandomNumberFromRange(
        POKEMON_HEIGHT / 2,
        this.canvasUtil.canvas.height
      ),
    };
    this.position.set(position);

    return position;
  }

  update() {
    this.walk();
    this.draw();
  }

  walk() {
    let x = this.position.target.x;
    let y = this.position.target.y;
    if (this.walkStartFrame === null) {
      switch (this.frame % Calculate.getRandomNumberFromRange(0, 120)) {
        case 111:
          x += this.walkSpeed;
          this.walkStartFrame = this.frame;
          this.workArrow = "right";
          break;
        case 112:
          x -= this.walkSpeed;
          this.walkStartFrame = this.frame;
          this.workArrow = "left";
          break;
        case 113:
          y += this.walkSpeed;
          this.walkStartFrame = this.frame;
          this.workArrow = "down";
          break;
        case 114:
          y -= this.walkSpeed;
          this.walkStartFrame = this.frame;
          this.workArrow = "up";
          break;
        default:
          break;
      }
    } else {
      // 歩き始めてすでに指定フレーム分経過していたら歩きをやめる
      if (this.frame - this.walkStartFrame > 20) {
        this.walkStartFrame = null;
      } else {
        switch (this.workArrow) {
          case "right":
            x += this.walkSpeed;
            break;
          case "left":
            x -= this.walkSpeed;
            break;
          case "down":
            y += this.walkSpeed;
            break;
          case "up":
            y -= this.walkSpeed;
            break;
        }
      }
    }
    this.position.set({
      x: Math.min(
        Math.max(x, 0),
        this.canvasUtil.canvas.width - POKEMON_WIDTH / 2
      ),
      y: Math.min(
        Math.max(y, 0),
        this.canvasUtil.canvas.height - POKEMON_HEIGHT / 2
      ),
    });
  }
}
