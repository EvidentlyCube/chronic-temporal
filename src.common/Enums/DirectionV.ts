export interface DirectionV
{
	readonly id: number;
	readonly name: string;
	readonly y: number;
	readonly opposite: DirectionV;
}

class DirectionVImpl implements DirectionV
{
	public id: number;
	public name: string;
	public y: number;
	public opposite: DirectionV;

	public get isDirection(): boolean
	{
		return this.y !== 0;
	}

	public get isUp(): boolean
	{
		return this.y < 0;
	}

	public get isDown(): boolean
	{
		return this.y > 0;
	}

	public constructor(id: number, name: string)
	{
		this.id = id;
		this.name = name;
		this.y = 0;
		this.opposite = this;
	}
}

export namespace DirectionV
{
	export const Up: DirectionVImpl = new DirectionVImpl(1, "up");
	export const Down: DirectionVImpl = new DirectionVImpl(2, "down");
	export const None: DirectionVImpl = new DirectionVImpl(3, "none");

	Up.y = -1;
	Up.opposite = Down;

	Down.y = 1;
	Down.opposite = Up;
}