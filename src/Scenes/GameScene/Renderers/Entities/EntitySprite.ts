export interface EntitySprite extends PIXI.Sprite {
	update(timePassed: number): void;

	release(): void;
}
