import {Hashmap, ObjectKeymap} from "../GenericInterfaces";
import {GfxManager} from "./GfxManager";
import {TextureFactory, TilesetTextureConfig} from "./TextureFactory";
import * as PIXI from "pixi.js";
import Resource = PIXI.loaders.Resource;

interface PendingTexture {
	name: string,
	imageUrl: string;
}

interface PendingSheet {
	name: string,
	imageUrl: string,
	sheetJson: ObjectKeymap
}

interface PendingTileset {
	name: string,
	config: TilesetTextureConfig
}

interface PendingFontInTexture {
	fontDataUrl: string
}

export class AssetLoader {
	private _resources?: Hashmap<Resource>;
	private _wasStarted: boolean;
	private readonly _pendingTextures: PendingTexture[];
	private readonly _pendingSheets: PendingSheet[];
	private readonly _pendingTilesets: PendingTileset[];
	private readonly _pendingFontInTextures: PendingFontInTexture[];

	public gfxManager: GfxManager;
	public textureFactory: TextureFactory;

	constructor() {
		this._wasStarted = false;
		this._pendingTextures = [];
		this._pendingSheets = [];
		this._pendingTilesets = [];
		this._pendingFontInTextures = [];
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

	public loadFontInTexture(fontDataUrl: string) {
		this.assertNotStarted();

		this._pendingFontInTextures.push({fontDataUrl});
	}

	public load(loader: PIXI.loaders.Loader): Promise<any> {
		this.assertNotStarted();

		this._pendingTextures.forEach(texture => {
			loader.add(texture.name, texture.imageUrl);
		});
		this._pendingSheets.forEach((sheet) => {
			loader.add(sheet.name, sheet.imageUrl);
		});

		const promise = new Promise((resolve) => {
			loader.load((loader: PIXI.loaders.Loader, resources: Hashmap<Resource>) => {
				this._resources = resources;
				resolve();
			});
		});

		return promise
			.then(() => this.loadTextures())
			.then(() => this.loadSpritesheets())
			.then(() => this.loadTilesets());

	}

	private loadTextures() {
		if (!this._resources) {
			throw new Error('');
		}

		const resources = this._resources;

		this._pendingTextures.forEach(texture => {
			this.textureFactory.registerTexture(resources[texture.name].texture, texture.name);
		});
	}

	private loadSpritesheets() {
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

	private loadTilesets() {
		this._pendingTilesets.forEach(tilesetConfig => {
			this.textureFactory.registerTileset(tilesetConfig.name, tilesetConfig.config);
		});
	}

	private assertNotStarted(): void {
		if (this._wasStarted) {
			throw new Error("Asset loader was already started");
		}
	}
}