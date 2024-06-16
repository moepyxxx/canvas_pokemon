import { CanvasUtility } from "./canvas";
import {
  COMMENTARY_END_HEIGHT,
  COMMENTARY_END_WIDTH,
  COMMENTARY_START_HEIGHT,
  COMMENTARY_START_WIDTH,
} from "./const";

export class Commentary {
  canvasUtil: CanvasUtility;
  constructor(canvasUtil: CanvasUtility) {
    this.canvasUtil = canvasUtil;
  }

  update() {
    this.drawBackground();
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
