export class Grid2D<T> {
	private _width: number;
	private _height: number;
	private _squares: T[][];

	constructor(width: number, height: number, defaultValue: T) {
		this._width = width;
		this._height = height;

		this._squares = [];
		for(let x = 0; x < this._width; x++) {
			this._squares[x] = [];
			for(let y = 0; y < this._height; y++) {
				this._squares[x][y] = defaultValue;
			}
		}
	}

	public set(x: number, y: number, value: T) {
		if (!this.isValid(x, y)) {
			return;
		}

		this._squares[x][y] = value;
	}

	public get(x: number, y: number): T {
		if (!this.isValid(x, y)) {
			throw new Error("Trying to get a tile outside the level area.");
		}

		const square = this._squares[x][y];
		if (square !== undefined) {
			return square;

		} else {
			throw new Error("Requested grid square was undefined.");
		}
	}

	public isValid(x: number, y: number): boolean {
		return x >= 0 && y >= 0 && x < this._width && y < this._height;
	}

	public setAll(value: T): void {
		for(let x = 0; x < this._width; x++) {
			for(let y = 0; y < this._height; y++) {
				this._squares[x][y] = value;
			}
		}
	}

	public setAllByCallback(callback: { (x: number, y: number): T }): void {
		for(let x = 0; x < this._width; x++) {
			for(let y = 0; y < this._height; y++) {
				this._squares[x][y] = callback(x, y);
			}
		}
	}

	public forEach(callback: (item: T) => void) {
		for(let x = 0; x < this._width; x++) {
			for(let y = 0; y < this._height; y++) {
				const square = this._squares[x][y];
				square && callback(square);
			}
		}
	}
}
