
export interface Entity {
	readonly type: any;
	x: number;
	y: number;

	update(): void;
}