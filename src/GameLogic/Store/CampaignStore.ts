import {Campaign} from '../Campaign';
import {CampaignMetadata} from './CampaignMetadata';

export interface CampaignStore {
	addCampaign(campaign: Campaign): Promise<void>;
	removeCampaign(campaign: Campaign): Promise<void>;
	getCampaign(id: string): Promise<Campaign|undefined>;

	listCampaigns(nameFilter: string, limit: number, offset: number): Promise<CampaignMetadata[]>;
}
