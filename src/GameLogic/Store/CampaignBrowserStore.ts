import * as localforage from 'localforage';
import {CampaignStore} from './CampaignStore';
import {Campaign} from '../Campaign';
import {CampaignMetadata} from './CampaignMetadata';
import {PakoUtils} from '../../Utils/PakoUtils';
import {CampaignSerializer} from '../Serialization/CampaignSerializer';
import {CampaignDeserializer} from '../Serialization/CampaignDeserializer';

type StoreRow = [string, string, string];

export class CampaignBrowserStore implements CampaignStore {
	public addCampaign(campaign: Campaign): Promise<void> {
		return localforage.setItem<StoreRow>(campaign.id, [
			campaign.name.toLowerCase(),
			PakoUtils.jsonToString(CampaignSerializer.serializeMetadata(campaign.metadata)),
			PakoUtils.jsonToString(CampaignSerializer.serializeCampaign(campaign)),
		]).then(() => {
			// do nothing
		});
	}

	public getCampaign(id: string): Promise<Campaign | undefined> {
		return localforage.getItem<StoreRow>(id)
			.then(row => {
				return row
					? CampaignDeserializer.deserializeCampaign(PakoUtils.jsonFromString(row[2] as string))
					: undefined;
			});
	}

	public listCampaigns(nameFilter: string, limit: number, offset: number): Promise<CampaignMetadata[]> {
		nameFilter = nameFilter.toLowerCase();

		const results: CampaignMetadata[] = [];
		let toSkip = offset;
		return localforage.iterate<StoreRow, boolean>(row => {
			const name = row[0];

			if (!nameFilter || name.includes(nameFilter)) {
				if (toSkip > 0) {
					toSkip--;
				} else {
					results.push(CampaignDeserializer.deserializeMetadata(PakoUtils.jsonFromString(row[1] as string)));
				}
			}

			return results.length >= limit;
		}).then(() => results);
	}

	public removeCampaign(campaign: Campaign): Promise<void> {
		return localforage.removeItem(campaign.id);
	}
}
