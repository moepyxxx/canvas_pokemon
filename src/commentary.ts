import { CanvasUtility } from "./canvas";
import {
  COMMENTARY_END_HEIGHT,
  COMMENTARY_END_WIDTH,
  COMMENTARY_START_HEIGHT,
  COMMENTARY_START_WIDTH,
} from "./const";

export class Commentary {
  canvasUtil: CanvasUtility;
  textWidth: number = COMMENTARY_START_WIDTH + 10;
  histories: string[] = [];
  currentHistoryIndex: number = 0;
  firstLineHeight: number = COMMENTARY_START_HEIGHT + 50;
  secondLineHeight: number = COMMENTARY_START_HEIGHT + 70;
  constructor(canvasUtil: CanvasUtility) {
    this.canvasUtil = canvasUtil;
  }

  pushHistory(text: string) {
    this.histories.push(text);
    if (this.histories.length > 2) {
      this.currentHistoryIndex++;
    }
  }

  update() {
    this.drawBackground();
    this.canvasUtil.drawText(
      this.textWidth,
      COMMENTARY_START_HEIGHT + 20,
      "プレイじかん 10:00",
      "black"
    );
    this.canvasUtil.drawText(
      COMMENTARY_END_WIDTH - 95,
      COMMENTARY_START_HEIGHT + 20,
      "残りボール × 11",
      "black"
    );

    if (this.histories.length >= 1) {
      this.canvasUtil.drawText(
        this.textWidth,
        this.firstLineHeight,
        this.histories[this.currentHistoryIndex],
        "black",
        "14px 'Arial'"
      );
    }

    if (this.histories.length >= 2) {
      this.canvasUtil.drawText(
        this.textWidth,
        this.secondLineHeight,
        this.histories[this.currentHistoryIndex + 1],
        "black",
        "14px 'Arial'"
      );
    }
  }

  drawBackground() {
    this.canvasUtil.drawRect(
      COMMENTARY_START_WIDTH,
      COMMENTARY_START_HEIGHT,
      COMMENTARY_END_WIDTH - COMMENTARY_START_WIDTH,
      COMMENTARY_END_HEIGHT - COMMENTARY_START_HEIGHT,
      "white"
    );
    this.canvasUtil.strokeRect(
      COMMENTARY_START_WIDTH,
      COMMENTARY_START_HEIGHT,
      COMMENTARY_END_WIDTH - COMMENTARY_START_WIDTH,
      COMMENTARY_END_HEIGHT - COMMENTARY_START_HEIGHT,
      "black"
    );
    this.canvasUtil.strokeRect(
      COMMENTARY_START_WIDTH + 3,
      COMMENTARY_START_HEIGHT + 3,
      COMMENTARY_END_WIDTH - COMMENTARY_START_WIDTH - 6,
      COMMENTARY_END_HEIGHT - COMMENTARY_START_HEIGHT - 6,
      "black"
    );
    this.canvasUtil.context;
  }
}
