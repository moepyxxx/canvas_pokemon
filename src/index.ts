import { CanvasUtility } from "./canvas";
import { Hero } from "./hero";
import { KeyboardInput } from "./keyboardInput";
import { Pokemon } from "./pokemon";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

const HERO_WIDTH = 32;
const HERO_HEIGHT = 32;

const MAX_POKEMON_COUNT = 5;

(async () => {
  const util = new CanvasUtility(
    document.getElementById("main_canvas") as HTMLCanvasElement
  );
  util.canvas.width = CANVAS_WIDTH;
  util.canvas.height = CANVAS_HEIGHT;

  const offsetX = HERO_WIDTH / 2;
  const offsetY = HERO_HEIGHT / 2;
  const hero = new Hero(
    util.context,
    { x: util.canvas.width / 2 - offsetX, y: util.canvas.height / 2 - offsetY },
    { x: 0, y: 0 },
    "images/hero.png"
  );

  const pokemons = new Array<Pokemon>();
  for (let i = 0; i < MAX_POKEMON_COUNT; i++) {
    const pokemon = new Pokemon(util.context, { x: 32, y: 32 }, { x: 0, y: 0 });
    await pokemon.setNewPokemon();
    pokemons.push(pokemon);
  }

  const userInput = new KeyboardInput();

  initialize();
  loadCheck();

  function initialize() {
    userInput.initialize();
  }

  function loadCheck() {
    render();
  }

  function render() {
    util.drawRect(0, 0, util.canvas.width, util.canvas.height, "#a7d28d");

    hero.update(userInput.keys);
    pokemons.forEach((pokemon) => {
      pokemon.update();
    });
    requestAnimationFrame(render);
  }
})();
