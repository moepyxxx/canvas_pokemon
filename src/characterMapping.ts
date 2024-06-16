import { PositionType } from "./position";

/**
 * キャラクターの位置情報や存在状態を管理するクラス
 */
export class CharacterMapping {
  hero: PositionType;
  pokemons: Record<number, PositionType> = {};
  pokemonCounter: number = 0;

  constructor() {
    this.hero = { x: 0, y: 0 };
  }

  setHeroPosition(position: PositionType) {
    this.hero.x = position.x;
    this.hero.y = position.y;
  }

  get heroPosition() {
    return this.hero;
  }

  get pokemonPositions() {
    return this.pokemons;
  }

  addPokemonPosition(counter: number, position: PositionType) {
    if (this.pokemons[counter] == null) {
      this.pokemons[counter] = position;
    }

    this.pokemons[counter].x = position.x;
    this.pokemons[counter].y = position.y;
  }

  removePokemonPosition(counter: number) {
    delete this.pokemons[counter];
  }

  addPokemonCounter() {
    this.pokemonCounter++;
  }
}
