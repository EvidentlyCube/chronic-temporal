import {ScalingStageUpscaleMode} from 'evidently-pixi';
import {CampaignStore} from './GameLogic/Store/CampaignStore';

export interface BootstrapConfig {
	upscaleMode: ScalingStageUpscaleMode;
	campaignStore: CampaignStore;
}
