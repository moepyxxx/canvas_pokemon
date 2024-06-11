import { Calculate } from "./calculate";
import { CanvasUtility } from "./canvas";
import { Character } from "./character";
import { MONSTER_BALL_HEIGHT, MONSTER_BALL_WIDTH } from "./monsterBall";
import { PokeAPI } from "./pokeAPI";
import { PositionType } from "./position";

const MIN_ID_NUMBER = 1;
const MAX_ID_NUMBER = 386;
export const POKEMON_WIDTH = 64;
const POKEMON_HEIGHT = 64;

export class Pokemon extends Character {
  private pokeAPI = new PokeAPI();
  private walkStartFrame: number | null = null;
  private workArrow: "up" | "down" | "left" | "right" = "up";
  private walkSpeed = 1;
  counterID: number = 0;
  private isIntoMonsterBall: boolean = false;
  private intoMonsterBallFrame: number = 0;
  private isGet: boolean = false;

  constructor(context: CanvasUtility, vector: PositionType, counterID: number) {
    super(context, { x: 0, y: 0 }, vector, POKEMON_WIDTH, POKEMON_HEIGHT);
    this.counterID = counterID;
  }

  async setNewPokemon(): Promise<PositionType> {
    const pokemon = await this.pokeAPI.fetchPokemon(
      Calculate.getRandomNumberFromRange(MIN_ID_NUMBER, MAX_ID_NUMBER)
    );
    this.setImage(pokemon.sprites.front_default, "pokemon");
    this.setImage("images/monster_ball.png", "ball");
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

  update(getPokemonID?: number) {
    if (this.isGet) {
      return;
    }

    if (getPokemonID === this.counterID || this.isIntoMonsterBall) {
      this.intoMonsterBall();
      return;
    }

    this.walk();
    this.draw(this.images["pokemon"] as HTMLImageElement);
    this.intoMonsterBallFrame = 0;
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

  intoMonsterBall() {
    this.isIntoMonsterBall = true;

    // ボールが弾む
    if (this.intoMonsterBallFrame < 250) {
      const order = this.intoMonsterBallFrame / 100;
      const amplitude = 0.5;
      const period = 100 / order;
      const phaseShift = -Math.PI / 2;
      const y =
        amplitude *
        Math.sin(
          ((2 * Math.PI) / period) * this.intoMonsterBallFrame + phaseShift
        );
      this.position.set({
        x: this.position.target.x,
        y: y + this.position.target.y,
      });
    }

    // ボールが揺れる
    if (this.intoMonsterBallFrame > 270 && this.intoMonsterBallFrame < 370) {
      this.canvasUtil.context.save();

      this.canvasUtil.context.translate(
        this.position.target.x - MONSTER_BALL_WIDTH / 2,
        this.position.target.y - MONSTER_BALL_HEIGHT / 2
      );

      // 0 - n - 0 を行き交うような数字の作り方
      // 今回は基準値 n = 45 としている
      const amplitude = 45 / 2;
      const period = 100;
      const degree =
        amplitude *
        Math.sin(((2 * Math.PI) / period) * this.intoMonsterBallFrame);

      this.canvasUtil.context.rotate((degree * Math.PI) / 180);

      this.canvasUtil.context.drawImage(
        this.images["ball"] as HTMLImageElement,
        -MONSTER_BALL_WIDTH / 2,
        -MONSTER_BALL_HEIGHT / 2,
        MONSTER_BALL_WIDTH,
        MONSTER_BALL_HEIGHT
      );
      this.canvasUtil.context.restore();
      this.intoMonsterBallFrame++;
      return;
    }

    // キラキラが出る
    if (this.intoMonsterBallFrame > 400 && this.intoMonsterBallFrame < 500) {
      this.canvasUtil.drawText(
        this.position.target.x + 10 - MONSTER_BALL_WIDTH / 2,
        this.position.target.y - 10 - MONSTER_BALL_HEIGHT / 2,
        "✨",
        "gold"
      );
    }

    if (this.intoMonsterBallFrame > 500) {
      this.isIntoMonsterBall = false;
      this.intoMonsterBallFrame = 0;
      this.isGet = true;
      return;
    }

    this.draw(
      this.images["ball"] as HTMLImageElement,
      MONSTER_BALL_WIDTH,
      MONSTER_BALL_HEIGHT
    );
    this.intoMonsterBallFrame++;
  }
}
