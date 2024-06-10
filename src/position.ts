export type PositionType = {
  x: number;
  y: number;
};

export class Position {
  target: PositionType;

  /**
   * 2点間の距離を求める
   * @param target
   */
  static calcLength(target: PositionType): number {
    return Math.sqrt(target.x * target.x + target.y * target.y);
  }

  /**
   * 単位ベクトルを求める
   * @param target
   */
  static calcNormal(target: PositionType) {
    const len = Position.calcLength(target);
    return new Position({
      x: target.x / len,
      y: target.y / len,
    });
  }

  constructor(target: PositionType) {
    this.target = {
      x: target.x,
      y: target.y,
    };
  }

  set(target: PositionType) {
    this.target.x = target.x;
    this.target.y = target.y;
  }

  distance(target: PositionType) {
    const x = this.target.x - target.x;
    const y = this.target.y - target.y;
    return Math.sqrt(x * x + y * y);
  }
}
