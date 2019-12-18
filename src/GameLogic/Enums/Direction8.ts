export enum Direction8 {
	UpLeft = 1,
	Up = 2,
	UpRight = 3,
	Left = 4,
	None = 5,
	Right = 6,
	DownLeft = 7,
	Down = 8,
	DownRight = 9
}

export class Direction8Utils {
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

	public static getName(direction: Direction8): string {
		switch (direction) {
			case Direction8.Up:
				return 'Up';
			case Direction8.UpRight:
				return 'UpRight';
			case Direction8.Right:
				return 'Right';
			case Direction8.DownRight:
				return 'DownRight';
			case Direction8.Down:
				return 'Down';
			case Direction8.DownLeft:
				return 'DownLeft';
			case Direction8.Left:
				return 'Left';
			case Direction8.UpLeft:
				return 'UpLeft';
			case Direction8.None:
				return 'None';
		}
	}

	public static getX(direction: Direction8): number {
		switch (direction) {
			case Direction8.UpLeft:
			case Direction8.Left:
			case Direction8.DownLeft:
				return -1;
			case Direction8.UpRight:
			case Direction8.Right:
			case Direction8.DownRight:
				return 1;
			case Direction8.Up:
			case Direction8.Down:
			case Direction8.None:
				return 0;
		}
	}

	public static getY(direction: Direction8): number {
		switch (direction) {
			case Direction8.UpLeft:
			case Direction8.Up:
			case Direction8.UpRight:
				return -1;
			case Direction8.DownLeft:
			case Direction8.Down:
			case Direction8.DownRight:
				return 1;
			case Direction8.Left:
			case Direction8.Right:
			case Direction8.None:
				return 0;
		}
	}

	public static cw45(direction: Direction8): Direction8 {
		switch (direction) {
			case Direction8.Up:
				return Direction8.UpRight;
			case Direction8.UpRight:
				return Direction8.Right;
			case Direction8.Right:
				return Direction8.DownRight;
			case Direction8.DownRight:
				return Direction8.Down;
			case Direction8.Down:
				return Direction8.DownLeft;
			case Direction8.DownLeft:
				return Direction8.Left;
			case Direction8.Left:
				return Direction8.UpLeft;
			case Direction8.UpLeft:
				return Direction8.Up;
			case Direction8.None:
				return Direction8.None;
		}
	}

	public static cw90(direction: Direction8): Direction8 {
		switch (direction) {
			case Direction8.Up:
				return Direction8.Right;
			case Direction8.UpRight:
				return Direction8.DownRight;
			case Direction8.Right:
				return Direction8.Down;
			case Direction8.DownRight:
				return Direction8.DownLeft;
			case Direction8.Down:
				return Direction8.Left;
			case Direction8.DownLeft:
				return Direction8.UpLeft;
			case Direction8.Left:
				return Direction8.Up;
			case Direction8.UpLeft:
				return Direction8.UpRight;
			case Direction8.None:
				return Direction8.None;
		}
	}

	public static ccw45(direction: Direction8): Direction8 {
		switch (direction) {
			case Direction8.Up:
				return Direction8.UpLeft;
			case Direction8.UpRight:
				return Direction8.Up;
			case Direction8.Right:
				return Direction8.UpRight;
			case Direction8.DownRight:
				return Direction8.Right;
			case Direction8.Down:
				return Direction8.DownRight;
			case Direction8.DownLeft:
				return Direction8.Down;
			case Direction8.Left:
				return Direction8.DownLeft;
			case Direction8.UpLeft:
				return Direction8.Left;
			case Direction8.None:
				return Direction8.None;
		}
	}

	public static ccw90(direction: Direction8): Direction8 {
		switch (direction) {
			case Direction8.Up:
				return Direction8.Left;
			case Direction8.UpRight:
				return Direction8.UpLeft;
			case Direction8.Right:
				return Direction8.Up;
			case Direction8.DownRight:
				return Direction8.UpRight;
			case Direction8.Down:
				return Direction8.Right;
			case Direction8.DownLeft:
				return Direction8.DownRight;
			case Direction8.Left:
				return Direction8.Down;
			case Direction8.UpLeft:
				return Direction8.DownLeft;
			case Direction8.None:
				return Direction8.None;
		}
	}

	public static opposite(direction: Direction8): Direction8 {
		switch (direction) {
			case Direction8.Up:
				return Direction8.Down;
			case Direction8.UpRight:
				return Direction8.DownLeft;
			case Direction8.Right:
				return Direction8.Left;
			case Direction8.DownRight:
				return Direction8.UpLeft;
			case Direction8.Down:
				return Direction8.Up;
			case Direction8.DownLeft:
				return Direction8.UpRight;
			case Direction8.Left:
				return Direction8.Right;
			case Direction8.UpLeft:
				return Direction8.DownRight;
			case Direction8.None:
				return Direction8.None;
		}
	}
}
