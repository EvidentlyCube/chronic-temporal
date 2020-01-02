import {Campaign} from '../Campaign';
import {CampaignMetadata} from '../Store/CampaignMetadata';
import {LevelSerializer} from './LevelSerializer';

export class CampaignSerializer {
	public static serializeCampaign(campaign: Campaign): object {
		return {
			id: campaign.id,
			name: campaign.name,
			levels: campaign.levels.map(LevelSerializer.serialize),
		};
	}

	public static serializeMetadata(meta: CampaignMetadata): object {
		return {
			id: meta.id,
			name: meta.name,
			levelCount: meta.levelCount,
		};
	}
}
