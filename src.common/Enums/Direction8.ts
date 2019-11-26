export interface Direction8
{
	readonly id: number;
	readonly name: string;
	readonly x: number;
	readonly y: number;
	readonly nextCW: Direction8;
	readonly nextCCW: Direction8;
	readonly opposite: Direction8;
}

class Direction8Impl implements Direction8
{
	public id: number;
	public name: string;
	public x: number;
	public y: number;
	public nextCW: Direction8;
	public nextCCW: Direction8;
	public opposite: Direction8;

	public constructor(id: number, name: string)
	{
		this.id = id;
		this.name = name;
		this.x = 0;
		this.y = 0;
		this.nextCW = this;
		this.nextCCW = this;
		this.opposite = this;
	}
}

export namespace Directions8
{
	export const UpLeft: Direction8Impl = new Direction8Impl(1, "upleft");
	export const Up: Direction8Impl = new Direction8Impl(2, "up");
	export const UpRight: Direction8Impl = new Direction8Impl(3, "upright");
	export const Left: Direction8Impl = new Direction8Impl(4, "left");
	export const None: Direction8Impl = new Direction8Impl(5, "none");
	export const Right: Direction8Impl = new Direction8Impl(6, "right");
	export const DownLeft: Direction8Impl = new Direction8Impl(7, "downleft");
	export const Down: Direction8Impl = new Direction8Impl(8, "down");
	export const DownRight: Direction8Impl = new Direction8Impl(9, "downright");

	Left.x = -1;
	Left.nextCW = UpLeft;
	Left.nextCCW = DownLeft;
	Left.opposite = Right;

	Right.x = 1;
	Right.nextCW = DownRight;
	Right.nextCCW = UpRight;
	Right.opposite = Left;

	Up.y = -1;
	Up.nextCW = UpRight;
	Up.nextCCW = UpLeft;
	Up.opposite = Down;

	Down.y = 1;
	Down.nextCW = DownLeft;
	Down.nextCCW = DownRight;
	Down.opposite = Up;

	UpLeft.x = -1;
	UpLeft.y = -1;
	UpLeft.nextCW = Up;
	UpLeft.nextCCW = Left;
	UpLeft.opposite = DownRight;

	UpRight.x = 1;
	UpRight.y = -1;
	UpRight.nextCW = Right;
	UpRight.nextCCW = Up;
	UpRight.opposite = DownLeft;

	DownRight.x = 1;
	DownRight.y = 1;
	DownRight.nextCW = Down;
	DownRight.nextCCW = Right;
	DownRight.opposite = UpLeft;

	DownLeft.x = -1;
	DownLeft.y = 1;
	DownLeft.nextCW = Left;
	DownLeft.nextCCW = Down;
	DownLeft.opposite = UpLeft;

	None.nextCW = None;
	None.nextCCW = None;
	None.opposite = None;
}