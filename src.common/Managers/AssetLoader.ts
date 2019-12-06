import {Hashmap, ObjectKeymap} from '../GenericInterfaces';
import {GfxManager} from './GfxManager';
import {TextureFactory, TilesetTextureConfig} from './TextureFactory';
import * as PIXI from 'pixi.js';
import Resource = PIXI.LoaderResource;

interface PendingTexture {
	name: string;
	imageUrl: string;
}

interface PendingSheet {
	name: string;
	imageUrl: string;
	sheetJson: ObjectKeymap;
}

interface PendingTileset {
	name: string;
	config: TilesetTextureConfig;
}

interface PendingPixiAutoFont {
	name: string;
	fontXmlUrl: string;
}

export class AssetLoader {
	private _resources?: Hashmap<Resource>;

	private readonly _wasStarted: boolean;

	private readonly _pendingTextures: PendingTexture[];

	private readonly _pendingSheets: PendingSheet[];

	private readonly _pendingTilesets: PendingTileset[];

	private readonly _pendingPixiAutoFonts: PendingPixiAutoFont[];

	public gfxManager: GfxManager;

	public textureFactory: TextureFactory;

	constructor() {
		this._wasStarted = false;
		this._pendingTextures = [];
		this._pendingSheets = [];
		this._pendingTilesets = [];
		this._pendingPixiAutoFonts = [];
		this.gfxManager = new GfxManager();
		this.textureFactory = new TextureFactory();
	}

	public loadTexture(name: string, imageUrl: string): void {
		this.assertNotStarted();

		this._pendingTextures.push({name, imageUrl});
	}

	public loadSheet(imageUrl: string, sheetJson: ObjectKeymap): void {
		this.assertNotStarted();

		this._pendingSheets.push({
			name: `__sheet#${this._pendingSheets.length}`,
			imageUrl, sheetJson,
		});
	}

	public loadTileset(name: string, config: TilesetTextureConfig): void {
		this.assertNotStarted();

		this._pendingTilesets.push({
			name: name,
			config: {...config},
		});
	}

	public loadPixiAutoFont(name: string, fontXmlUrl: string): void {
		this.assertNotStarted();

		this._pendingPixiAutoFonts.push({name, fontXmlUrl});
	}

	public load(loader: PIXI.Loader): Promise<any> {
		this.assertNotStarted();

		this._pendingTextures.forEach(texture => {
			loader.add(texture.name, texture.imageUrl);
		});
		this._pendingSheets.forEach((sheet) => {
			loader.add(sheet.name, sheet.imageUrl);
		});
		this._pendingPixiAutoFonts.forEach((font) => {
			loader.add(font.name, font.fontXmlUrl);
		});

		const promise = new Promise((resolve) => {
			loader.load((loader, resources) => {
				this._resources = resources as any;
				resolve();
			});
		});

		return promise
			.then(() => this.loadTextures())
			.then(() => this.loadSpritesheets())
			.then(() => this.loadTilesets());
	}

	private loadTextures(): void {
		if (!this._resources) {
			throw new Error('');
		}

		const resources = this._resources;

		this._pendingTextures.forEach(texture => {
			this.textureFactory.registerTexture(resources[texture.name].texture, texture.name);
		});
	}

	private loadSpritesheets(): Promise<any> {
		if (!this._resources) {
			throw new Error('');
		}

		const resources = this._resources;

		return Promise.all(this._pendingSheets.map(sheet => {
			const resource = resources[sheet.name];
			if (!resource.texture) {
				console.error(resources[sheet.name]);
				throw new Error(`Resource '${sheet.name}' loaded from '${sheet.imageUrl}' expected to be texture but it isn't.`);
			}

			this.textureFactory.registerTexture(resource.texture, sheet.name);

			const spritesheet = new PIXI.Spritesheet(
				resource.texture.baseTexture,
				sheet.sheetJson,
			);

			return new Promise((resolve) => {
				spritesheet.parse(() => {
					Object.keys(spritesheet.textures).forEach((textureName) => {
						this.textureFactory.registerTexture(spritesheet.textures[textureName], textureName);
					});

					resolve();
				});
			});
		}));
	}

	private loadTilesets(): void {
		this._pendingTilesets.forEach(tilesetConfig => {
			this.textureFactory.registerTileset(tilesetConfig.name, tilesetConfig.config);
		});
	}

	private assertNotStarted(): void {
		if (this._wasStarted) {
			throw new Error('Asset loader was already started');
		}
	}
}
