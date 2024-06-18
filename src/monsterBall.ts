import { CanvasUtility } from "./canvas";
import { Character } from "./character";
import { POKEMON_WIDTH } from "./const";
import { Keys } from "./keyboardInput";
import { Position, PositionType } from "./position";

export const MONSTER_BALL_WIDTH = 32;
export const MONSTER_BALL_HEIGHT = 32;
export class MonsterBall extends Character {
  private isThrowing: boolean = false;
  private targetingFrame: number = 0;
  private throwingFrame: number = 0;

  throwBallCount: number = 0;

  constructor(
    canvasUtil: CanvasUtility,
    position: PositionType,
    vector: PositionType
  ) {
    super(
      canvasUtil,
      position,
      vector,
      MONSTER_BALL_WIDTH,
      MONSTER_BALL_HEIGHT
    );
    this.setImage("images/monster_ball.png", "ball");
  }

  update(
    remainMonsterBalls: number,
    downKeys: Keys,
    upKeys: Keys,
    heroPosition: PositionType,
    pokemonPositions: Record<number, PositionType>
  ): number | false {
    if (remainMonsterBalls <= 0) {
      // ボールがない場合は何もしない
      return false;
    }

    let pokemonID: number | false = false;
    if (this.isThrowing === false) {
      let x = heroPosition.x + 16;
      let y = heroPosition.y - 16;
      this.position.set({ x, y });
    }

    if (downKeys.a === true && this.isThrowing === false) {
      this.displaySupportText("ボールを投げろ", 100);
      this.displayTarget();
    }

    if (upKeys.a === true) {
      this.isThrowing = true;
      this.throwBallCount++;
      this.throwBall();
    }

    if (this.isThrowing) {
      const x = this.position.target.x - this.vector.target.x * 5;
      const y = this.position.target.y - this.vector.target.y * 5;
      this.position.set({ x, y });
      this.throwingFrame++;

      pokemonID = this.isGetPokemon(pokemonPositions);
      if (pokemonID !== false) {
        this.isThrowing = false;
        this.throwingFrame = 0;
      }

      if (
        this.position.target.x > this.canvasUtil.canvas.width ||
        this.position.target.x < 0 ||
        this.position.target.y > this.canvasUtil.canvas.height ||
        this.position.target.y < 0
      ) {
        this.isThrowing = false;
        this.throwingFrame = 0;
      }
    }

    this.draw(this.images["ball"] as HTMLImageElement);

    return pokemonID;
  }

  isGetPokemon(pokemonPositions: Record<number, PositionType>): number | false {
    const pokemonID = Object.keys(pokemonPositions).find((key) => {
      const distance = this.position.distance(pokemonPositions[Number(key)]);
      if (distance < this.width + POKEMON_WIDTH / 8) {
        return true;
      }
      return false;
    });
    return Number(pokemonID) || false;
  }

  displaySupportText(text: string, width: number) {
    const { x, y } = this.position.target;
    this.canvasUtil.context.font = "12px 'Arial'";
    this.canvasUtil.context.fillStyle = "black";
    this.canvasUtil.context.fillText(
      text,
      x - width / 2,
      y - this.height,
      width
    );
  }

  displayTarget() {
    const { x, y } = this.position.target;

    // ななめの距離
    const r = 50;
    // 角度からラジアンに変換
    // TODO: 360度にしたい
    const theta = ((this.targetingFrame % 180) * Math.PI) / 180;
    // targetとの距離
    const dx = x - r * Math.cos(theta);
    const dy = y - r * Math.sin(theta);

    this.canvasUtil.drawCircle(dx, dy, 3, "red");
    this.canvasUtil.drawRect(dx - 12 - 5, dy, 10, 2, "red");
    this.canvasUtil.drawRect(dx + 12 - 5, dy, 10, 2, "red");
    this.canvasUtil.drawRect(dx, dy - 12 - 5, 2, 10, "red");
    this.canvasUtil.drawRect(dx, dy + 12 - 5, 2, 10, "red");
    this.targetingFrame++;
  }

  throwBall() {
    const { x, y } = this.position.target;
    const theta = ((this.targetingFrame % 180) * Math.PI) / 180;
    const dx = x * Math.cos(theta);
    const dy = y * Math.sin(theta);
    const normalized = Position.calcNormal({ x: dx, y: dy });

    this.vector.set({ x: normalized.target.x, y: normalized.target.y });
  }
}
