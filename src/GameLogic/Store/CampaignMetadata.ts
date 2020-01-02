
export class CampaignMetadata {
	public id: string;

	public name: string;

	public levelCount: number;

	constructor(id: string, name: string, levelCount: number) {
		this.id = id;
		this.name = name;
		this.levelCount = levelCount;
	}
}
