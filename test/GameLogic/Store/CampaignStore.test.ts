import {CampaignStore} from '../../../src/GameLogic/Store/CampaignStore';
import {CampaignBrowserStore} from '../../../src/GameLogic/Store/CampaignBrowserStore';
import {Campaign} from '../../../src/GameLogic/Campaign';
import {generateCompleteLevel} from '../helpers/generateCompleteLevel';
import {assertDeepJsonEqual} from '../../helpers/assertDeepJsonEqual';

describe('GameLogic.DataStructures.Store.CampaignStore', () => {
	const stores: Map<string, CampaignStore> = new Map([['', new CampaignBrowserStore()]],);

	let campaignCounter = 0;
	function newCampaign(name: string): Campaign {
		const campaign = new Campaign((campaignCounter++).toString());
		campaign.name = name;
		campaign.levels.push(generateCompleteLevel());

		return campaign;
	}

	for (const [name, store] of stores.entries()) {
		describe(`Store ${name}`, () => {
			it('add and retrieve a campaign', async() => {
				const campaign = newCampaign('test');

				await store.addCampaign(campaign);

				const readCampaign = await store.getCampaign(campaign.id);
				assertDeepJsonEqual(readCampaign, campaign);
			});
		});
	}
});
