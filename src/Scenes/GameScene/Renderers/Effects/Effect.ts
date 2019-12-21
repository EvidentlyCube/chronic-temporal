export interface Effect extends PIXI.Sprite {
	update(timePassed: number): void;

	release(): void;
}
