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
    this.hero = position;
  }

  addPokemonPosition(counter: number, position: PositionType) {
    this.pokemons[counter] = position;
  }

  removePokemonPosition(counter: number) {
    delete this.pokemons[counter];
  }

  addPokemonCounter() {
    this.pokemonCounter++;
  }
}
