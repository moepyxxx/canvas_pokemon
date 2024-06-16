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
      this.pokemons[counter] = { x: position.x, y: position.y };
    }

    this.pokemons[counter].x = position.x;
    this.pokemons[counter].y = position.y;
  }

  removePokemonPosition(counter: number) {
    const newPositions: Record<number, PositionType> = Object.assign(
      {},
      ...Object.keys(this.pokemons)
        .filter((key) => Number(key) !== counter)
        .map((key) => ({ [key]: this.pokemons[Number(key)] }))
    );
    this.pokemons = newPositions;
  }

  addPokemonCounter() {
    this.pokemonCounter++;
  }
}
