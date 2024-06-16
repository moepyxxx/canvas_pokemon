import { TREE_WIDTH } from ".";
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

  private isIntoMonsterBall: boolean = false;
  private intoMonsterBallFrame: number = 0;

  private runningDirection: "up" | "down" | "left" | "right" | null = null;
  isRunning: boolean = false;
  isRan: boolean = false;
  private runningFrame: number = 0;

  counterID: number = 0;
  isGet: boolean = false;

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
      x: Calculate.getRandomNumberExcludingRange(
        POKEMON_WIDTH / 2 + TREE_WIDTH,
        this.canvasUtil.canvas.width - TREE_WIDTH,
        // 初期値に画面の中心部分にいると主人公と被るため
        (this.canvasUtil.canvas.width / 10) * 4.5,
        (this.canvasUtil.canvas.width / 10) * 5.5
      ),
      y: Calculate.getRandomNumberExcludingRange(
        POKEMON_HEIGHT / 2 + TREE_WIDTH,
        this.canvasUtil.canvas.height - TREE_WIDTH,
        // 初期値に画面の中心部分にいると主人公と被るため
        (this.canvasUtil.canvas.height / 10) * 4.5,
        (this.canvasUtil.canvas.height / 10) * 5.5
      ),
    };
    this.position.set(position);

    return position;
  }

  update(args: {
    isPokemonIntoMonsterBall: number | false;
    isCollision: number | false;
  }) {
    if (this.isGet || this.isRan) {
      return;
    }

    if (args.isCollision === this.counterID || this.isRunning) {
      this.run();
      return;
    }

    if (
      args.isPokemonIntoMonsterBall === this.counterID ||
      this.isIntoMonsterBall
    ) {
      this.intoMonsterBall();
      return;
    }

    this.walk();
    this.draw(this.images["pokemon"] as HTMLImageElement);
    this.intoMonsterBallFrame = 0;
  }

  run() {
    this.isRunning = true;

    // 最初はランダムに逃げる方向を決める
    if (this.runningDirection === null) {
      const x = this.position.target.x;
      const y = this.position.target.y;
      const isRunningY = Calculate.percentage(0.5);
      if (isRunningY) {
        if (y > this.canvasUtil.canvas.height / 2) {
          this.runningDirection = "up";
        } else {
          this.runningDirection = "down";
        }
      } else {
        if (x > this.canvasUtil.canvas.width / 2) {
          this.runningDirection = "left";
        } else {
          this.runningDirection = "right";
        }
      }
    }

    // すでに終点まで走っていたら終了
    if (
      this.position.target.x < 0 ||
      this.position.target.x > this.canvasUtil.canvas.width ||
      this.position.target.y < 0 ||
      this.position.target.y > this.canvasUtil.canvas.height
    ) {
      this.isRunning = false;
      this.runningDirection = null;
      this.isRan = true;
      this.runningFrame = 0;
      return;
    }

    const x = this.position.target.x;
    const y = this.position.target.y;
    const runSpeed = 5;
    switch (this.runningDirection) {
      case "up":
        this.position.set({ x, y: y - runSpeed });
        break;
      case "down":
        this.position.set({ x, y: y + runSpeed });
        break;
      case "left":
        this.position.set({ x: x - runSpeed, y });
        break;
      case "right":
        this.position.set({ x: x + runSpeed, y });
        break;
    }
    this.runningFrame++;
    this.draw(this.images["pokemon"] as HTMLImageElement);
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
        Math.max(x, 0 + TREE_WIDTH + POKEMON_WIDTH / 2),
        this.canvasUtil.canvas.width - POKEMON_WIDTH / 2 - TREE_WIDTH
      ),
      y: Math.min(
        Math.max(y, 0 + TREE_WIDTH + POKEMON_HEIGHT / 2),
        this.canvasUtil.canvas.height - POKEMON_HEIGHT / 2 - TREE_WIDTH
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

    if (this.intoMonsterBallFrame === 399) {
      // ゲットできない時もある
      const isGet = Calculate.percentage(0.5);
      if (!isGet) {
        this.isIntoMonsterBall = false;
        this.intoMonsterBallFrame = 0;
        return;
      }
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
