const API_URL = "https://pokeapi.co/api/v2/";

export type Pokemon = {
  id: number;
  name: string;
  sprites: {
    back_default: string;
    front_default: string;
  };
};

export class PokeAPI {
  constructor() {}

  async fetchPokemon(id: number): Promise<Pokemon> {
    const response: Promise<Pokemon> = await (
      await fetch(`${API_URL}pokemon/${id}`)
    ).json();
    return response;
  }
}
