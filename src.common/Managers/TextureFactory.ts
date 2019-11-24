import * as PIXI from 'pixi.js';

export interface TilesetTextureConfig {
	offsetX: number,
	offsetY: number,
	tileWidth: number,
	tileHeight: number,
	spacingX: number,
	spacingY: number
}

function assertTilesetConfigField(config: TilesetTextureConfig, expectedLowerBound: number, fieldName: Extract<keyof TilesetTextureConfig, string>): void
{
	if (config[fieldName] < expectedLowerBound) {
		throw new Error(`${fieldName} expected to be equal or larger to ${expectedLowerBound}, '${config[fieldName]}' given instead.`);
	}
}

export class TextureFactory {
	private nameToTextureMap: Map<string, PIXI.Texture> = new Map();
	private textureToNameMap: Map<PIXI.Texture, string> = new Map();
	private nameToTilesetConfigMap: Map<string, TilesetTextureConfig> = new Map();

	public registerTexture(texture: PIXI.Texture, name: string): void {
		this.nameToTextureMap.set(name, texture);
		this.textureToNameMap.set(texture, name);
	}

	public registerTileset(textureName: string, config: TilesetTextureConfig): void {
		if (!this.nameToTextureMap.has(textureName)) {
			throw new Error(`Cannot register tileset for not-registered texture '${textureName}'.`);
		}

		if (this.nameToTilesetConfigMap.has(textureName)) {
			throw new Error(`Tileset for texture '${textureName}' is already defined!`);
		}

		assertTilesetConfigField(config, 0, 'offsetX');
		assertTilesetConfigField(config, 0, 'offsetY');
		assertTilesetConfigField(config, 0, 'spacingX');
		assertTilesetConfigField(config, 0, 'spacingY');
		assertTilesetConfigField(config, 1, 'tileWidth');
		assertTilesetConfigField(config, 1, 'tileHeight');

		this.nameToTilesetConfigMap.set(textureName, {...config});
	}

	public getTextureName(texture: PIXI.Texture): string {
		if (!this.textureToNameMap.has(texture)) {
			throw new Error("Texture was not registered.");
		}

		return this.textureToNameMap.get(texture)!;
	}

	public getTexture(name: string): PIXI.Texture {
		if (!this.nameToTextureMap.has(name)) {
			const pieces = name.split('~');

			if (pieces.length === 5) {
				const [baseName, x, y, width, height] = pieces;
				return this.getTextureRectangle(baseName, parseInt(x), parseInt(y), parseInt(width), parseInt(height));
			} else {
				throw new Error(`Unknown texture '${name}'`);
			}
		}

		return this.nameToTextureMap.get(name)!;
	}

	public getTextureRectangle(name: string, x: number, y: number, width: number, height: number): PIXI.Texture {
		const texture = this.getTexture(name);
		const baseName = name.replace(/~.+/, '');
		const baseTexture = this.getTexture(baseName);

		if (width <= 0) {
			throw new Error("Width must be a positive integer");
		}
		if (height <= 0) {
			throw new Error("Height must be a positive integer");
		}

		const newTexture = new PIXI.Texture(
			texture.baseTexture,
			new PIXI.Rectangle(texture.frame.x + x, texture.frame.y + y, width, height),
		);

		const newName = `${baseName}~${newTexture.frame.x - baseTexture.frame.x}~${newTexture.frame.y - baseTexture.frame.y}~${width}~${height}`;
		this.nameToTextureMap.set(newName, newTexture);
		this.textureToNameMap.set(newTexture, newName);

		return newTexture;
	}

	public getTile(name: string, x: number, y: number): PIXI.Texture {
		if (!this.nameToTilesetConfigMap.has(name)) {
			throw new Error(`No tileset registered for texture '${name}'.`);
		}

		const texture = this.getTexture(name);
		const config = this.nameToTilesetConfigMap.get(name)!;

		const expectedX = config.offsetX + x * (config.tileWidth + config.spacingX);
		const expectedY = config.offsetY + y * (config.tileHeight + config.spacingY);

		return this.getTextureRectangle(name, expectedX, expectedY, config.tileWidth, config.tileHeight);
	}
}