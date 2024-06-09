export type Keys = {
  ArrowLeft: boolean;
  ArrowRight: boolean;
  ArrowUp: boolean;
  ArrowDown: boolean;
};

export class KeyboardInput {
  private _keys: Keys;

  constructor() {
    this._keys = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
    };
  }

  get keys() {
    return this._keys;
  }

  initialize() {
    const validKeys = Object.keys(this._keys);
    window.addEventListener(
      "keydown",
      (e) => {
        if (validKeys.includes(e.key as keyof typeof this._keys)) {
          this._keys[e.key as keyof typeof this._keys] = true;
        }
      },
      false
    );
    window.addEventListener(
      "keyup",
      (e) => {
        if (validKeys.includes(e.key as keyof typeof this._keys)) {
          this._keys[e.key as keyof typeof this._keys] = false;
        }
      },
      false
    );
  }
}
