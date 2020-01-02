import {Campaign} from '../Campaign';
import {CampaignMetadata} from '../Store/CampaignMetadata';
import {LevelDeserializer} from './LevelDeserializer';

export class CampaignDeserializer {
	public static deserializeCampaign(campaignObject: any): Campaign {
		const campaign = new Campaign(campaignObject.id);
		campaign.name = campaignObject.name;

		campaign.levels.push(...campaignObject.levels.map(LevelDeserializer.deserialize));

		return campaign;
	}

	public static deserializeMetadata(meta: any): CampaignMetadata {
		return new CampaignMetadata(meta.id, meta.name, meta.levelCount);
	}
}
