import { CanvasUtility } from "./canvas";
import { Character } from "./character";
import { CharacterMapping } from "./characterMapping";
import { Commentary } from "./commentary";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  HERO_HEIGHT,
  HERO_WIDTH,
  MAX_POKEMON_COUNT,
  TREE_WIDTH,
} from "./const";
import { Hero } from "./hero";
import { KeyboardInput } from "./keyboardInput";
import { MonsterBall } from "./monsterBall";
import { Pokemon } from "./pokemon";
import { partition } from "lodash-es";

let util: CanvasUtility;
let characterMapping: CharacterMapping;
let hero: Hero;
const pokemons: Pokemon[] = [];
let userInput: KeyboardInput;
let monsterBall: MonsterBall;
let backgroundObjects: Character[] = [];
let commentary: Commentary;

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

    // 実況コメントを初期化
    commentary = new Commentary(util);

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
    for (let i = 1; i < MAX_POKEMON_COUNT + 1; i++) {
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
    const CRASS_COUNT = 40;
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

    const isCollision = hero.update(
      userInput.downKeys,
      characterMapping.pokemonPositions
    );

    const isPokemonIntoMonsterBall = monsterBall.update(
      userInput.downKeys,
      userInput.upKeys,
      characterMapping.heroPosition,
      characterMapping.pokemonPositions
    );

    pokemons.forEach((pokemon) => {
      const args: {
        isCollision: number | false;
        isPokemonIntoMonsterBall: number | false;
      } = {
        isCollision: false,
        isPokemonIntoMonsterBall: false,
      };
      if (
        isPokemonIntoMonsterBall !== false &&
        isPokemonIntoMonsterBall === pokemon.counterID
      ) {
        args.isPokemonIntoMonsterBall = isPokemonIntoMonsterBall;
      }
      if (isCollision !== false && isCollision === pokemon.counterID) {
        args.isCollision = isCollision;
      }
      pokemon.update(args);
      const status = pokemon.checkPokemonStatus();
      if (status === "get") {
        commentary.pushHistory(`やった、${pokemon.baseInfo.name}をつかまえた`);
      }
      if (status === "run") {
        commentary.pushHistory(
          `あっ、${pokemon.baseInfo.name}はにげてしまった`
        );
      }
    });

    backgroundObjects.forEach((item) => {
      item.draw(item.images["item"] as HTMLImageElement);
    });

    commentary.update();

    if (hero.frame % 500 === 0) {
      // フレームに1回ポケモンの再生成を行う
      checkRegeneratePokemon();
    }

    // 位置情報をマッピングし直す
    reMapping();

    requestAnimationFrame(render);
  }

  function reMapping() {
    const heroPosition = hero.position.target;
    characterMapping.setHeroPosition(heroPosition);

    const [fieldInPokemons, notFieldInPikemons] = partition(
      pokemons,
      (pokemon) => !pokemon.isGet && !pokemon.isRan
    );
    fieldInPokemons.forEach((pokemon) => {
      characterMapping.addPokemonPosition(
        pokemon.counterID,
        pokemon.position.target
      );
    });
    notFieldInPikemons.forEach((pokemon) => {
      characterMapping.removePokemonPosition(pokemon.counterID);
    });
  }

  async function checkRegeneratePokemon() {
    let largestCounterID = 0;

    pokemons.forEach((pokemon) => {
      if (pokemon.counterID > largestCounterID) {
        largestCounterID = pokemon.counterID;
      }
    });
    const fieldInPokemons = pokemons.filter(
      (pokemon) => !pokemon.isGet && !pokemon.isRan
    );
    const addPokemonCount = MAX_POKEMON_COUNT - fieldInPokemons.length;

    if (addPokemonCount <= 0) {
      return;
    }

    for (let i = 1; i <= addPokemonCount; i++) {
      const pokemon = new Pokemon(util, { x: 0, y: 0 }, largestCounterID + i);
      const position = await pokemon.setNewPokemon();
      pokemons.push(pokemon);
      characterMapping.addPokemonCounter();
      characterMapping.addPokemonPosition(i, position);
    }
  }
})();
