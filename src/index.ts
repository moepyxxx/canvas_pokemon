import { CanvasUtility } from "./canvas";
import { Character } from "./character";
import { CharacterMapping } from "./characterMapping";
import { Hero } from "./hero";
import { KeyboardInput } from "./keyboardInput";
import { MonsterBall } from "./monsterBall";
import { Pokemon } from "./pokemon";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

const HERO_WIDTH = 32;
const HERO_HEIGHT = 32;

export const TREE_WIDTH = 32;

const MAX_POKEMON_COUNT = 5;

let util: CanvasUtility;
let characterMapping: CharacterMapping;
let hero: Hero;
const pokemons: Pokemon[] = [];
let userInput: KeyboardInput;
let monsterBall: MonsterBall;
let backgroundObjects: Character[] = [];

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

    initializeObjects();

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
      {
        hero: "images/hero.png",
        hero_above: "images/hero/above.png",
        hero_below: "images/hero/below.png",
        hero_left: "images/hero/left.png",
        hero_right: "images/hero/right.png",
      }
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

  function initializeObjects() {
    // 🌲の初期化
    for (
      let width = TREE_WIDTH / 2;
      width < util.canvas.width;
      width += TREE_WIDTH
    ) {
      const treeAbove = new Character(
        util,
        { x: width, y: TREE_WIDTH / 2 },
        { x: 0, y: 0 },
        TREE_WIDTH,
        TREE_WIDTH,
        { item: "images/tree.png" }
      );
      backgroundObjects.push(treeAbove);
      const treeBelow = new Character(
        util,
        { x: width, y: util.canvas.height - TREE_WIDTH / 2 },
        { x: 0, y: 0 },
        TREE_WIDTH,
        TREE_WIDTH,
        { item: "images/tree.png" }
      );
      backgroundObjects.push(treeBelow);
    }
    for (
      let height = TREE_WIDTH * 2 - TREE_WIDTH / 2;
      height < util.canvas.height;
      height += TREE_WIDTH
    ) {
      const treeLeft = new Character(
        util,
        { x: TREE_WIDTH / 2, y: height },
        { x: 0, y: 0 },
        TREE_WIDTH,
        TREE_WIDTH,
        { item: "images/tree.png" }
      );
      backgroundObjects.push(treeLeft);
      const treeRight = new Character(
        util,
        { x: util.canvas.width - TREE_WIDTH / 2, y: height },
        { x: 0, y: 0 },
        TREE_WIDTH,
        TREE_WIDTH,
        { item: "images/tree.png" }
      );
      backgroundObjects.push(treeRight);
    }

    // 芝生の初期化
    const GRASS_WIDTH = 32;
    const CRASS_COUNT = 30;
    for (let i = 0; i < CRASS_COUNT; i++) {
      const y = Math.floor(
        Math.random() * (util.canvas.height - TREE_WIDTH - GRASS_WIDTH)
      );
      const x = Math.floor(
        Math.random() * (util.canvas.width - TREE_WIDTH - GRASS_WIDTH)
      );
      const grass = new Character(
        util,
        { x, y },
        { x: 0, y: 0 },
        GRASS_WIDTH,
        GRASS_WIDTH,
        { item: "images/grass.png" }
      );
      backgroundObjects.push(grass);
    }
  }

  function loadCheck() {
    let ready = true;
    for (const pokemon of pokemons) {
      if (!pokemon.ready) {
        ready = false;
      }
    }

    for (const object of backgroundObjects) {
      if (!object.ready) {
        ready = false;
      }
    }

    if (!hero.ready || !monsterBall.ready) {
      ready = false;
    }

    if (!ready) {
      setTimeout(loadCheck, 100);
      return;
    }

    render();
  }

  function render() {
    util.drawRect(0, 0, util.canvas.width, util.canvas.height, "#9CDF7D");

    hero.update(userInput.downKeys);

    const pokemonID = monsterBall.update(
      userInput.downKeys,
      userInput.upKeys,
      characterMapping.heroPosition,
      characterMapping.pokemonPositions
    );

    pokemons.forEach((pokemon) => {
      if (pokemonID !== false && pokemonID === pokemon.counterID) {
        pokemon.update(pokemonID);
      } else {
        pokemon.update();
      }
    });

    backgroundObjects.forEach((item) => {
      item.draw(item.images["item"] as HTMLImageElement);
    });

    // 位置情報をマッピングし直す
    reMapping();

    requestAnimationFrame(render);
  }

  function reMapping() {
    const heroPosition = hero.position.target;
    characterMapping.setHeroPosition(heroPosition);

    pokemons.forEach((pokemon) => {
      const pokemonPosition = pokemon.position.target;
      characterMapping.addPokemonPosition(pokemon.counterID, pokemonPosition);
    });
  }
})();
