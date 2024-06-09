import { Character } from "./character";
import { PokeAPI } from "./pokeAPI";
import { PositionType } from "./position";

const MIN_ID_NUMBER = 1;
const MAX_ID_NUMBER = 386;

export class Pokemon extends Character {
  private pokeAPI = new PokeAPI();

  constructor(
    context: CanvasRenderingContext2D,
    position: PositionType,
    vector: PositionType,
    width: number,
    height: number
  ) {
    super(context, position, vector, width, height);
  }

  async setNewPokemon() {
    const pokemon = await this.pokeAPI.fetchPokemon(this.getRandomNumber());
    this.setImage(pokemon.sprites.front_default);
  }

  getRandomNumber() {
    return Math.floor(Math.random() * MAX_ID_NUMBER) + MIN_ID_NUMBER;
  }

  update() {
    this.draw();
  }
}
