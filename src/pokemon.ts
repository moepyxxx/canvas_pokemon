import { Calculate } from "./calculate";
import { Character } from "./character";
import { PokeAPI } from "./pokeAPI";
import { PositionType } from "./position";

const MIN_ID_NUMBER = 1;
const MAX_ID_NUMBER = 386;
const POKEMON_WIDTH = 64;
const POKEMON_HEIGHT = 64;

export class Pokemon extends Character {
  private pokeAPI = new PokeAPI();

  constructor(
    context: CanvasRenderingContext2D,
    position: PositionType,
    vector: PositionType
  ) {
    super(context, position, vector, POKEMON_WIDTH, POKEMON_HEIGHT);
  }

  async setNewPokemon() {
    const pokemon = await this.pokeAPI.fetchPokemon(
      Calculate.getRandomNumberFromRange(MIN_ID_NUMBER, MAX_ID_NUMBER)
    );
    this.setImage(pokemon.sprites.front_default);
    this.position.set({
      x: Calculate.getRandomNumberFromRange(
        POKEMON_WIDTH / 2,
        this.context2d.canvas.width
      ),
      y: Calculate.getRandomNumberFromRange(
        POKEMON_HEIGHT / 2,
        this.context2d.canvas.height
      ),
    });
  }

  update() {
    this.draw();
  }
}
