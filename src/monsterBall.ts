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
      this.supportText("ボールを投げろ", 150);
    }

    this.draw();
  }
}
