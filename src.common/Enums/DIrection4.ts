export interface Direction4
{
	readonly id: number;
	readonly name: string;
	readonly x: number;
	readonly y: number;
	readonly nextCW: Direction4;
	readonly nextCCW: Direction4;
	readonly opposite: Direction4;
}

class Direction4Impl implements Direction4
{
	public id: number;
	public name: string;
	public x: number;
	public y: number;
	public nextCW: Direction4;
	public nextCCW: Direction4;
	public opposite: Direction4;

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

export namespace Directions4
{
	export const Left: Direction4Impl = new Direction4Impl(1, "left");
	export const Up: Direction4Impl = new Direction4Impl(2, "up");
	export const Right: Direction4Impl = new Direction4Impl(3, "right");
	export const Down: Direction4Impl = new Direction4Impl(4, "down");

	Left.x = -1;
	Left.nextCW = Up;
	Left.nextCCW = Down;
	Left.opposite = Right;

	Right.x = 1;
	Right.nextCW = Down;
	Right.nextCCW = Up;
	Right.opposite = Left;

	Up.y = -1;
	Up.nextCW = Right;
	Up.nextCCW = Left;
	Up.opposite = Down;

	Down.y = 1;
	Down.nextCW = Left;
	Down.nextCCW = Right;
	Down.opposite = Up;
}