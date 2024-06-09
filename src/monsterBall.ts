import { CanvasUtility } from "./canvas";
import { Character } from "./character";
import { Keys } from "./keyboardInput";
import { PositionType } from "./position";

const MONSTER_BALL_WIDTH = 32;
const MONSTER_BALL_HEIGHT = 32;
export class MonsterBall extends Character {
  private isThrowing: boolean = false;

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
      this.displaySupportText("ボールを投げろ", 150);
      this.displayTarget();
    }

    this.draw();
  }

  displaySupportText(text: string, width: number) {
    const { x, y } = this.position.target;
    this.canvasUtil.context.font = "16px 'Arial'";
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

    // TODO: 100の部分をいじるとターゲットの位置が変わる
    this.canvasUtil.drawCircle(x - 100, y, 3, "red");
    this.canvasUtil.drawRect(x - 100 - 12 - 5, y, 10, 2, "red");
    this.canvasUtil.drawRect(x - 100 + 12 - 5, y, 10, 2, "red");
    this.canvasUtil.drawRect(x - 100, y - 12 - 5, 2, 10, "red");
    this.canvasUtil.drawRect(x - 100, y + 12 - 5, 2, 10, "red");
  }
}
