export class CanvasUtility {
  private canvasElement: HTMLCanvasElement;
  private context2d: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvasElement = canvas;
    const context2d = canvas.getContext("2d");
    if (context2d == null) {
      throw new Error("cannot get 2D context");
    }
    this.context2d = context2d;
  }

  get canvas(): HTMLCanvasElement {
    return this.canvasElement;
  }

  get context(): CanvasRenderingContext2D {
    return this.context2d;
  }

  imageLoader(path: string, callback: (target: HTMLImageElement) => void) {
    let target = new Image();
    target.addEventListener(
      "load",
      () => {
        callback(target);
      },
      false
    );
    target.src = path;
  }

  /**
   * 矩形を描画する
   * @param x x座標
   * @param y y座標
   * @param width 横幅
   * @param height 高さ
   * @param color 色
   */
  drawRect(x: number, y: number, width: number, height: number, color: string) {
    if (color != null) {
      this.context2d.fillStyle = color;
    }
    this.context2d.fillRect(x, y, width, height);
  }

  /**
   * 矩形（線）を描画する
   * @param x x座標
   * @param y y座標
   * @param width 横幅
   * @param height 高さ
   * @param color 色
   */
  strokeRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    if (color != null) {
      this.context2d.strokeStyle = color;
    }
    this.context2d.strokeRect(x, y, width, height);
  }

  /**
   * 画像を描画する
   * @param x x座標
   * @param y y座標
   * @param target 画像URL
   */
  drawImage(x: number, y: number, target: HTMLImageElement) {
    this.context2d.drawImage(target, x, y);
  }

  /**
   * テキストを描画する
   * @param x x座標
   * @param y y座標
   * @param text テキスト
   * @param color 色
   */
  drawText(x: number, y: number, text: string, color: string = "black") {
    this.context2d.fillStyle = color;
    this.context2d.fillText(text, x, y);
  }

  /**
   * 縁を描画する
   * @param x x座標
   * @param y y座標
   * @param radius 半径
   * @param color 色
   */
  drawCircle(x: number, y: number, radius: number, color: string = "black") {
    if (color != null) {
      this.context2d.fillStyle = color;
    }
    this.context2d.beginPath();
    this.context2d.arc(x, y, radius, 0.0, Math.PI * 2.0);
    this.context2d.closePath();
    this.context2d.fill();
  }
}
