export interface DirectionFace {
	readonly id: number;
	readonly name: string;
	readonly x: number;
	readonly opposite: DirectionFace;
	readonly isNeutral: boolean;
}

class DirectionFaceImpl implements DirectionFace {
	public id: number;
	public name: string;
	public x: number;
	public opposite: DirectionFace;

	public get isNeutral(): boolean {
		return this.x === 0;
	}

	public constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
		this.x = 0;
		this.opposite = this;
	}
}

export namespace DirectionsFace {
	export const Left: DirectionFaceImpl = new DirectionFaceImpl(1, "left");
	export const Right: DirectionFaceImpl = new DirectionFaceImpl(2, "right");
	export const None: DirectionFaceImpl = new DirectionFaceImpl(3, "none");

	Left.x = -1;
	Left.opposite = Right;

	Right.x = 1;
	Right.opposite = Left;

	None.x = 0;
	None.opposite = None;

	export function fromX(x: number): DirectionFace {
		if (x < 0) {
			return Left;
		} else if (x > 0) {
			return Right;
		} else {
			return None;
		}
	}
}