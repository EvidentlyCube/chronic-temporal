export interface Direction8 {
	readonly id: number;
	readonly name: string;
	readonly x: number;
	readonly y: number;
	readonly nextCW: Direction8;
	readonly nextCCW: Direction8;
	readonly opposite: Direction8;
}

class Direction8Impl implements Direction8 {
	public id: number;
	public name: string;
	public x: number;
	public y: number;
	public nextCW: Direction8;
	public nextCCW: Direction8;
	public opposite: Direction8;

	public constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
		this.x = 0;
		this.y = 0;
		this.nextCW = this;
		this.nextCCW = this;
		this.opposite = this;
	}
}

export namespace Direction8 {
	export const UpLeft: Direction8 = new Direction8Impl(1, "upleft");
	export const Up: Direction8 = new Direction8Impl(2, "up");
	export const UpRight: Direction8 = new Direction8Impl(3, "upright");
	export const Left: Direction8 = new Direction8Impl(4, "left");
	export const None: Direction8 = new Direction8Impl(5, "none");
	export const Right: Direction8 = new Direction8Impl(6, "right");
	export const DownLeft: Direction8 = new Direction8Impl(7, "downleft");
	export const Down: Direction8 = new Direction8Impl(8, "down");
	export const DownRight: Direction8 = new Direction8Impl(9, "downright");

	export const all: ReadonlyArray<Direction8> = [
		UpLeft, Up, UpRight,
		Left, None, Right,
		DownLeft, Down, DownRight,
	];

	export const allDirectional: ReadonlyArray<Direction8> = [
		UpLeft, Up, UpRight,
		Left, Right,
		DownLeft, Down, DownRight,
	];

	export const allDiagonal: ReadonlyArray<Direction8> = [
		UpLeft, UpRight,
		DownLeft, DownRight,
	];

	export const allOrthogonal: ReadonlyArray<Direction8> = [
		Up, Left, Right, Down,
	];

	(Left as Direction8Impl).x = -1;
	(Left as Direction8Impl).nextCW = UpLeft;
	(Left as Direction8Impl).nextCCW = DownLeft;
	(Left as Direction8Impl).opposite = Right;

	(Right as Direction8Impl).x = 1;
	(Right as Direction8Impl).nextCW = DownRight;
	(Right as Direction8Impl).nextCCW = UpRight;
	(Right as Direction8Impl).opposite = Left;

	(Up as Direction8Impl).y = -1;
	(Up as Direction8Impl).nextCW = UpRight;
	(Up as Direction8Impl).nextCCW = UpLeft;
	(Up as Direction8Impl).opposite = Down;

	(Down as Direction8Impl).y = 1;
	(Down as Direction8Impl).nextCW = DownLeft;
	(Down as Direction8Impl).nextCCW = DownRight;
	(Down as Direction8Impl).opposite = Up;

	(UpLeft as Direction8Impl).x = -1;
	(UpLeft as Direction8Impl).y = -1;
	(UpLeft as Direction8Impl).nextCW = Up;
	(UpLeft as Direction8Impl).nextCCW = Left;
	(UpLeft as Direction8Impl).opposite = DownRight;

	(UpRight as Direction8Impl).x = 1;
	(UpRight as Direction8Impl).y = -1;
	(UpRight as Direction8Impl).nextCW = Right;
	(UpRight as Direction8Impl).nextCCW = Up;
	(UpRight as Direction8Impl).opposite = DownLeft;

	(DownRight as Direction8Impl).x = 1;
	(DownRight as Direction8Impl).y = 1;
	(DownRight as Direction8Impl).nextCW = Down;
	(DownRight as Direction8Impl).nextCCW = Right;
	(DownRight as Direction8Impl).opposite = UpLeft;

	(DownLeft as Direction8Impl).x = -1;
	(DownLeft as Direction8Impl).y = 1;
	(DownLeft as Direction8Impl).nextCW = Left;
	(DownLeft as Direction8Impl).nextCCW = Down;
	(DownLeft as Direction8Impl).opposite = UpLeft;

	(None as Direction8Impl).nextCW = None;
	(None as Direction8Impl).nextCCW = None;
	(None as Direction8Impl).opposite = None;
}