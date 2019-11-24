export interface DirectionH
{
	readonly id: number;
	readonly name: string;
	readonly x: number;
	readonly opposite: DirectionH;

	readonly isDirection: boolean;
	readonly isLeft: boolean;
	readonly isRight: boolean;
	readonly isNone: boolean;
}

class DirectionHImpl implements DirectionH
{
	public id: number;
	public name: string;
	public x: number;
	public opposite: DirectionH;

	public get isDirection(): boolean
	{
		return this.x !== 0;
	}

	public get isLeft(): boolean
	{
		return this.x < 0;
	}

	public get isRight(): boolean
	{
		return this.x > 0;
	}

	public get isNone(): boolean
	{
		return this.x === 0;
	}

	public constructor(id: number, name: string)
	{
		this.id = id;
		this.name = name;
		this.x = 0;
		this.opposite = this;
	}
}

export namespace DirectionH
{
	export const Left: DirectionHImpl = new DirectionHImpl(1, "left");
	export const Right: DirectionHImpl = new DirectionHImpl(2, "right");
	export const None: DirectionHImpl = new DirectionHImpl(3, "none");

	Left.x = -1;
	Left.opposite = Right;

	Right.x = 1;
	Right.opposite = Left;
}