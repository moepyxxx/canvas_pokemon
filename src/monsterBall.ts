import { CanvasUtility } from "./canvas";
import { Character } from "./character";
import { Keys } from "./keyboardInput";
import { PositionType } from "./position";

const MONSTER_BALL_WIDTH = 32;
const MONSTER_BALL_HEIGHT = 32;
export class MonsterBall extends Character {
  private isThrowing: boolean = false;
  private targetingFrame: number = 0;

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
    this.setImage("images/monster_ball.png");
  }

  update(downKeys: Keys, upKeys: Keys, heroPosition: PositionType) {
    let x = heroPosition.x + 16;
    let y = heroPosition.y - 16;
    this.position.set({ x, y });

    if (downKeys.a === true) {
      this.displaySupportText("ボールを投げろ", 100);
      this.displayTarget();
    }

    this.draw();
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
}
