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
    // Check if the exclusion range is valid within the min-max range
    if (excludeMin > excludeMax || excludeMin < min || excludeMax > max) {
      throw new Error("Invalid exclusion range");
    }

    let randomNum;
    do {
      randomNum = this.getRandomNumberFromRange(min, max);
    } while (randomNum >= excludeMin && randomNum <= excludeMax);

    return randomNum;
  }
}
