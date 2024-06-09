import { CanvasUtility } from "./canvas";
import { Hero } from "./hero";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

(() => {
  const util = new CanvasUtility(
    document.getElementById("main_canvas") as HTMLCanvasElement
  );
  util.canvas.width = CANVAS_WIDTH;
  util.canvas.height = CANVAS_HEIGHT;

  const hero = new Hero(
    util.context,
    { x: 16, y: 16 },
    { x: 0, y: 0 },
    32,
    32,
    "images/hero.png"
  );

  initialize();
  loadCheck();

  function initialize() {
    util.drawRect(0, 0, util.canvas.width, util.canvas.height, "#eee");
  }

  function loadCheck() {
    render();
  }

  function render() {
    hero.update();
    requestAnimationFrame(render);
  }
})();
