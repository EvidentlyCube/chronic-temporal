import {Level} from './Level';
import {CampaignMetadata} from './Store/CampaignMetadata';

export class Campaign {
	public readonly id: string;

	public name: string;

	public levels: Level[];

	public get metadata(): CampaignMetadata {
		return new CampaignMetadata(this.id, this.name, this.levels.length);
	}

	constructor(id: string) {
		this.id = id;
		this.name = '';
		this.levels = [];
	}
}
