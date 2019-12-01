export class Grid2D<T> {
	private readonly _width: number;

	private readonly _height: number;

	private readonly _squares: T[][];

	public get width(): number {
		return this._width;
	}

	public get height(): number {
		return this._height;
	}

	constructor(width: number, height: number, defaultValue: T) {
		this._width = width;
		this._height = height;

		this._squares = [];
		for (let x = 0; x < this._width; x++) {
			this._squares[x] = [];
			for (let y = 0; y < this._height; y++) {
				this._squares[x][y] = defaultValue;
			}
		}
	}

	public set(x: number, y: number, value: T): void {
		if (!this.isValid(x, y)) {
			return;
		}

		this._squares[x][y] = value;
	}

	public get(x: number, y: number): T {
		if (!this.isValid(x, y)) {
			throw new Error('Trying to get a tile outside the level area.');
		}

		return this._squares[x][y];
	}

	public isValid(x: number, y: number): boolean {
		return x >= 0 && y >= 0 && x < this._width && y < this._height;
	}

	public setAll(value: T): void {
		for (let x = 0; x < this._width; x++) {
			for (let y = 0; y < this._height; y++) {
				this._squares[x][y] = value;
			}
		}
	}

	public setAllByCallback(callback: { (x: number, y: number): T }): void {
		for (let x = 0; x < this._width; x++) {
			for (let y = 0; y < this._height; y++) {
				this._squares[x][y] = callback(x, y);
			}
		}
	}

	public forEach(callback: (item: T) => void): void {
		for (let x = 0; x < this._width; x++) {
			for (let y = 0; y < this._height; y++) {
				const square = this._squares[x][y];
				square && callback(square);
			}
		}
	}
}
