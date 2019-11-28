export class Direction8 {
	public static readonly UpLeft: Readonly<Direction8> = new Direction8(1, "upleft");
	public static readonly Up: Readonly<Direction8> = new Direction8(2, "up");
	public static readonly UpRight: Readonly<Direction8> = new Direction8(3, "upright");
	public static readonly Left: Readonly<Direction8> = new Direction8(4, "left");
	public static readonly None: Readonly<Direction8> = new Direction8(5, "none");
	public static readonly Right: Readonly<Direction8> = new Direction8(6, "right");
	public static readonly DownLeft: Readonly<Direction8> = new Direction8(7, "downleft");
	public static readonly Down: Readonly<Direction8> = new Direction8(8, "down");
	public static readonly DownRight: Readonly<Direction8> = new Direction8(9, "downright");

	public static readonly all: readonly Direction8[] = [
		Direction8.UpLeft, Direction8.Up, Direction8.UpRight,
		Direction8.Left, Direction8.None, Direction8.Right,
		Direction8.DownLeft, Direction8.Down, Direction8.DownRight,
	];

	public static readonly allDirectional: readonly Direction8[] = [
		Direction8.UpLeft, Direction8.Up, Direction8.UpRight,
		Direction8.Left, Direction8.Right,
		Direction8.DownLeft, Direction8.Down, Direction8.DownRight,
	];

	public static readonly allDiagonal: readonly Direction8[] = [
		Direction8.UpLeft, Direction8.UpRight,
		Direction8.DownLeft, Direction8.DownRight,
	];

	public static readonly allOrthogonal: readonly Direction8[] = [
		Direction8.Up, Direction8.Left, Direction8.Right, Direction8.Down,
	];

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

(Direction8.Left as Direction8).x = -1;
(Direction8.Left as Direction8).nextCW = Direction8.UpLeft;
(Direction8.Left as Direction8).nextCCW = Direction8.DownLeft;
(Direction8.Left as Direction8).opposite = Direction8.Right;

(Direction8.Right as Direction8).x = 1;
(Direction8.Right as Direction8).nextCW = Direction8.DownRight;
(Direction8.Right as Direction8).nextCCW = Direction8.UpRight;
(Direction8.Right as Direction8).opposite = Direction8.Left;

(Direction8.Up as Direction8).y = -1;
(Direction8.Up as Direction8).nextCW = Direction8.UpRight;
(Direction8.Up as Direction8).nextCCW = Direction8.UpLeft;
(Direction8.Up as Direction8).opposite = Direction8.Down;

(Direction8.Down as Direction8).y = 1;
(Direction8.Down as Direction8).nextCW = Direction8.DownLeft;
(Direction8.Down as Direction8).nextCCW = Direction8.DownRight;
(Direction8.Down as Direction8).opposite = Direction8.Up;

(Direction8.UpLeft as Direction8).x = -1;
(Direction8.UpLeft as Direction8).y = -1;
(Direction8.UpLeft as Direction8).nextCW = Direction8.Up;
(Direction8.UpLeft as Direction8).nextCCW = Direction8.Left;
(Direction8.UpLeft as Direction8).opposite = Direction8.DownRight;

(Direction8.UpRight as Direction8).x = 1;
(Direction8.UpRight as Direction8).y = -1;
(Direction8.UpRight as Direction8).nextCW = Direction8.Right;
(Direction8.UpRight as Direction8).nextCCW = Direction8.Up;
(Direction8.UpRight as Direction8).opposite = Direction8.DownLeft;

(Direction8.DownRight as Direction8).x = 1;
(Direction8.DownRight as Direction8).y = 1;
(Direction8.DownRight as Direction8).nextCW = Direction8.Down;
(Direction8.DownRight as Direction8).nextCCW = Direction8.Right;
(Direction8.DownRight as Direction8).opposite = Direction8.UpLeft;

(Direction8.DownLeft as Direction8).x = -1;
(Direction8.DownLeft as Direction8).y = 1;
(Direction8.DownLeft as Direction8).nextCW = Direction8.Left;
(Direction8.DownLeft as Direction8).nextCCW = Direction8.Down;
(Direction8.DownLeft as Direction8).opposite = Direction8.UpLeft;

(Direction8.None as Direction8).nextCW = Direction8.None;
(Direction8.None as Direction8).nextCCW = Direction8.None;
(Direction8.None as Direction8).opposite = Direction8.None;
