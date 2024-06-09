import { Character } from "./character";
import { Keys } from "./keyboardInput";
import { PositionType } from "./position";

const MONSTER_BALL_WIDTH = 32;
const MONSTER_BALL_HEIGHT = 32;
export class MonsterBall extends Character {
  constructor(
    context: CanvasRenderingContext2D,
    position: PositionType,
    vector: PositionType
  ) {
    super(context, position, vector, MONSTER_BALL_WIDTH, MONSTER_BALL_HEIGHT);
  }

  update(downKeys: Keys, upKeys: Keys) {}
}
