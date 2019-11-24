import {TextureFactory} from "./TextureFactory";

export class GfxManager {
	public readonly textureFactory: TextureFactory;

	constructor()
	{
		this.textureFactory = new TextureFactory();
	}

}