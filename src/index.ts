import { CanvasUtility } from "./canvas";
import { CharacterMapping } from "./characterMapping";
import { Hero } from "./hero";
import { KeyboardInput } from "./keyboardInput";
import { MonsterBall } from "./monsterBall";
import { Pokemon } from "./pokemon";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

const HERO_WIDTH = 32;
const HERO_HEIGHT = 32;

const MAX_POKEMON_COUNT = 5;

let util: CanvasUtility;
let characterMapping: CharacterMapping;
let hero: Hero;
const pokemons: Pokemon[] = [];
let userInput: KeyboardInput;
let monsterBall: MonsterBall;

(async () => {
  await initialize();
  loadCheck();

  async function initialize() {
    // canvasの初期化
    util = new CanvasUtility(
      document.getElementById("main_canvas") as HTMLCanvasElement
    );
    util.canvas.width = CANVAS_WIDTH;
    util.canvas.height = CANVAS_HEIGHT;

    // キャラクター位置情報の初期化
    characterMapping = new CharacterMapping();

    // 主人公の初期化
    const offsetX = HERO_WIDTH / 2;
    const offsetY = HERO_HEIGHT / 2;
    const initialHeroPosition = {
      x: util.canvas.width / 2 - offsetX,
      y: util.canvas.height / 2 - offsetY,
    };
    hero = new Hero(
      util,
      initialHeroPosition,
      { x: 0, y: 0 },
      "images/hero.png"
    );
    characterMapping.setHeroPosition(initialHeroPosition);

    // モンスターボールの初期化
    monsterBall = new MonsterBall(util, initialHeroPosition, {
      x: 0,
      y: 0,
    });

    // ポケモンの初期化
    for (let i = 0; i < MAX_POKEMON_COUNT; i++) {
      const pokemon = new Pokemon(util, { x: 0, y: 0 }, i);
      const position = await pokemon.setNewPokemon();
      pokemons.push(pokemon);
      characterMapping.addPokemonCounter();
      characterMapping.addPokemonPosition(i, position);
    }

    // ユーザーキーボード入力の初期化
    userInput = new KeyboardInput();
    userInput.initialize();
  }

  function loadCheck() {
    render();
  }

  function render() {
    util.drawRect(0, 0, util.canvas.width, util.canvas.height, "#a7d28d");

    hero.update(userInput.downKeys);
    monsterBall.update(
      userInput.downKeys,
      userInput.upKeys,
      hero.position.target
    );
    pokemons.forEach((pokemon) => {
      pokemon.update();
    });
    requestAnimationFrame(render);
  }
})();
