export type Keys = {
  ArrowLeft: boolean;
  ArrowRight: boolean;
  ArrowUp: boolean;
  ArrowDown: boolean;
  a: boolean;
};

export class KeyboardInput {
  private _downKeys: Keys;
  private _upKeys: Keys;

  constructor() {
    this._downKeys = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
      a: false,
    };
    this._upKeys = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
      a: false,
    };
  }

  get downKeys() {
    return this._downKeys;
  }

  get upKeys() {
    return this._upKeys;
  }

  initialize() {
    const validKeys = Object.keys(this._downKeys);
    window.addEventListener(
      "keydown",
      (e) => {
        if (validKeys.includes(e.key as keyof typeof this._downKeys)) {
          this._downKeys[e.key as keyof typeof this._downKeys] = true;
          this._upKeys[e.key as keyof typeof this._upKeys] = false;
        }
      },
      false
    );
    window.addEventListener(
      "keyup",
      (e) => {
        if (validKeys.includes(e.key as keyof typeof this._upKeys)) {
          this._upKeys[e.key as keyof typeof this._upKeys] = true;
          this._downKeys[e.key as keyof typeof this._downKeys] = false;
          requestAnimationFrame(() => {
            this._upKeys[e.key as keyof typeof this._upKeys] = false;
          });
        }
      },
      false
    );
  }
}
