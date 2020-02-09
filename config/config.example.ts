import {ScalingStageUpscaleMode} from 'evidently-pixi';
import {BootstrapConfig} from '../src/BootstrapConfig';
import {CampaignBrowserStore} from '../src/GameLogic/Store/CampaignBrowserStore';

// Make a copy of this file and call it `config.ts` and then modify it as you wish

export const Config: BootstrapConfig = {
	upscaleMode: ScalingStageUpscaleMode.SnapScale,
	campaignStore: new CampaignBrowserStore(),
};
