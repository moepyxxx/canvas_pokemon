import { Calculate } from "./calculate";
import { CanvasUtility } from "./canvas";
import { Character } from "./character";
import { Commentary } from "./commentary";
import {
  COMMENTARY_END_HEIGHT,
  COMMENTARY_END_WIDTH,
  COMMENTARY_START_HEIGHT,
  COMMENTARY_START_WIDTH,
  MAX_ID_NUMBER,
  MIN_ID_NUMBER,
  POKEMON_HEIGHT,
  POKEMON_WIDTH,
  TREE_WIDTH,
} from "./const";
import { MONSTER_BALL_HEIGHT, MONSTER_BALL_WIDTH } from "./monsterBall";
import { PokeAPI } from "./pokeAPI";
import { PositionType } from "./position";

export class Pokemon extends Character {
  private pokeAPI = new PokeAPI();
  private walkStartFrame: number | null = null;
  private workArrow: "up" | "down" | "left" | "right" = "up";
  private walkSpeed = 2;

  private isIntoMonsterBall: boolean = false;
  private intoMonsterBallFrame: number = 0;

  private runningDirection: "up" | "down" | "left" | "right" | null = null;
  isRunning: boolean = false;
  isRan: boolean = false;
  private runningFrame: number = 0;

  counterID: number = 0;
  isGet: boolean = false;

  private isFinish: boolean = false;

  baseInfo: {
    name: string;
  } = {
    name: "",
  };

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
    this.baseInfo.name = pokemon.name;

    const position = this.generateRandomPosition();
    while (
      position.x > COMMENTARY_START_WIDTH &&
      position.x < COMMENTARY_END_WIDTH &&
      position.y > COMMENTARY_START_HEIGHT &&
      position.y < COMMENTARY_END_HEIGHT
    ) {
      const { x, y } = this.generateRandomPosition();
      position.x = x;
      position.y = y;
    }
    this.position.set(position);

    return position;
  }

  generateRandomPosition(): PositionType {
    return {
      x: Calculate.getRandomNumberExcludingRange(
        POKEMON_WIDTH / 2 + TREE_WIDTH,
        this.canvasUtil.canvas.width - TREE_WIDTH,
        // 初期値に画面の中心部分にいると主人公と被るため
        (this.canvasUtil.canvas.width / 10) * 4,
        (this.canvasUtil.canvas.width / 10) * 6
      ),
      y: Calculate.getRandomNumberExcludingRange(
        POKEMON_HEIGHT / 2 + TREE_WIDTH,
        this.canvasUtil.canvas.height - TREE_WIDTH,
        // 初期値に画面の中心部分にいると主人公と被るため
        (this.canvasUtil.canvas.height / 10) * 4,
        (this.canvasUtil.canvas.height / 10) * 6
      ),
    };
  }

  update(args: {
    isPokemonIntoMonsterBall: number | false;
    isCollision: number | false;
  }) {
    if (this.isGet || this.isRan) {
      return;
    }

    if (args.isCollision === this.counterID || this.isRunning) {
      if (!this.isIntoMonsterBall && !this.isGet) {
        this.run();
        return;
      }
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

  checkPokemonStatus(): "get" | "run" | "none" {
    // 既に確定ステータスを返している場合は何もしない
    if (this.isFinish) {
      return "none";
    }

    if (this.isGet) {
      this.isFinish = true;
      return "get";
    }
    if (this.isRan) {
      this.isFinish = true;
      return "run";
    }
    return "none";
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

    // 驚きのアニメーション
    if (this.runningFrame > 20 && this.runningFrame < 60) {
      // フレーム30の時に少しyが上に上がるようなイメージ
      const radians = (Math.PI * this.runningFrame) / 40;
      const y = 1 * Math.sin(radians);

      this.position.set({
        x: this.position.target.x,
        y: this.position.target.y - y,
      });
    }

    // 焦りのアニメーション
    if (this.runningFrame % 80 < 40) {
      this.canvasUtil.drawRect(
        this.position.target.x,
        this.position.target.y - this.height / 2 - 8,
        2,
        10,
        "gray"
      );
      this.canvasUtil.context.save();
      this.canvasUtil.context.translate(
        this.position.target.x,
        this.position.target.y - this.height / 2 - 8
      );
      this.canvasUtil.context.rotate((30 * Math.PI) / 180);
      this.canvasUtil.drawRect(10, 0, 2, 6, "gray");
      this.canvasUtil.context.restore();

      this.canvasUtil.context.save();
      this.canvasUtil.context.translate(
        this.position.target.x,
        this.position.target.y - this.height / 2 - 8
      );
      this.canvasUtil.context.rotate((-30 * Math.PI) / 180);
      this.canvasUtil.drawRect(-10, 0, 2, 6, "gray");
      this.canvasUtil.context.restore();
    }

    if (this.runningFrame > 80) {
      // 逃げる
      const x = this.position.target.x;
      const y = this.position.target.y;
      const runSpeed = 3.5;
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
    const { x: finalX, y: finalY } = this.validPosition(x, y);
    this.position.set({ x: finalX, y: finalY });
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
