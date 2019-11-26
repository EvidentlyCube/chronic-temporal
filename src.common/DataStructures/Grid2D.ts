export class Grid2D<T>
{
	private _width: number;
	private _height: number;
	private _squares: (T|undefined)[][];

	constructor(width: number, height: number)
	{
		this._width = width;
		this._height = height;

		this._squares = [];
		for(let x = 0; x < this._width; x++) {
			this._squares[x] = [];
			for(let y = 0; y < this._height; y++) {
				this._squares[x][y] = undefined;
			}
		}
	}

	public set(x: number, y: number, value: T | undefined)
	{
		if (!this.isValid(x, y)) {
			return;
		}

		this._squares[x][y] = value;
	}

	public getByPoint(point: PIXI.PointLike): T
	{
		return this.get(point.x, point.y);
	}

	public get(x: number, y: number): T
	{
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

	public getOrundefinedByPoint(point: PIXI.PointLike): T | undefined
	{
		return this.getOrundefined(point.x, point.y);
	}

	public getOrundefined(x: number, y: number): T | undefined
	{
		if (!this.isValid(x, y)) {
			return undefined;
		}

		return this._squares[x][y];
	}

	public isValidByPoint(point: PIXI.PointLike): boolean
	{
		return this.isValid(point.x, point.y);
	}

	public isValid(x: number, y: number): boolean
	{
		return x >= 0 && y >= 0 && x < this._width && y < this._height;
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