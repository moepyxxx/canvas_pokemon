export class Calculate {
  static getRandomNumberFromRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  static getRandomNumberExcludingRange(
    min: number,
    max: number,
    excludeMin: number,
    excludeMax: number
  ): number {
    if (excludeMin > excludeMax || excludeMin < min || excludeMax > max) {
      throw new Error("Invalid exclusion range");
    }

    let randomNum;
    do {
      randomNum = this.getRandomNumberFromRange(min, max);
    } while (randomNum >= excludeMin && randomNum <= excludeMax);

    return randomNum;
  }

  // 0~1の範囲で指定した確率でtrueを返す
  static percentage(num: number) {
    return Math.random() < num;
  }
}
