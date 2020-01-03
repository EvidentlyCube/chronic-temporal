import 'mocha';
import {LevelSerializer} from '../../../src/GameLogic/Serialization/LevelSerializer';
import {LevelDeserializer} from '../../../src/GameLogic/Serialization/LevelDeserializer';
import {generateCompleteLevel} from '../helpers/generateCompleteLevel';
import {Campaign} from '../../../src/GameLogic/Campaign';
import {IdGenerator} from '../../../src/Utils/IdGenerator';
import {CampaignSerializer} from '../../../src/GameLogic/Serialization/CampaignSerializer';
import {CampaignDeserializer} from '../../../src/GameLogic/Serialization/CampaignDeserializer';
import {assertDeepJsonEqual} from '../../helpers/assertDeepJsonEqual';

describe('GameLogic.Serialization', () => {
	it('Should serialize and deserialize level', () => {
		const level = generateCompleteLevel();
		const serializedLevel = LevelSerializer.serialize(level);
		const deserializedLevel = LevelDeserializer.deserialize(serializedLevel);

		assertDeepJsonEqual(deserializedLevel, level);
	});
	it('Should serialize and deserialize campaign', () => {
		const campaign = new Campaign(IdGenerator.generateId());
		campaign.name = `Test #${campaign.id}`;
		campaign.levels.push(generateCompleteLevel(), generateCompleteLevel(), generateCompleteLevel());

		const serializedCampaign = CampaignSerializer.serializeCampaign(campaign);
		const deserializedCampaign = CampaignDeserializer.deserializeCampaign(serializedCampaign);

		assertDeepJsonEqual(deserializedCampaign, campaign);
	});
	it('Should serialize and deserialize campaign metadata', () => {
		const campaign = new Campaign(IdGenerator.generateId());
		campaign.name = `Test #${campaign.id}`;
		campaign.levels.push(generateCompleteLevel(), generateCompleteLevel(), generateCompleteLevel());

		const serializedCampaignMetadata = CampaignSerializer.serializeMetadata(campaign.metadata);
		const deserializedCampaignMetadata = CampaignDeserializer.deserializeMetadata(serializedCampaignMetadata);

		assertDeepJsonEqual(deserializedCampaignMetadata, campaign.metadata);
	});
	it('Should serialize and deserialize campaign', () => {
		const campaign = new Campaign(IdGenerator.generateId());
		campaign.name = `Test #${campaign.id}`;
		campaign.levels.push(generateCompleteLevel(), generateCompleteLevel(), generateCompleteLevel());

		const serializedCampaign = CampaignSerializer.serializeCampaign(campaign);
		const deserializedCampaign = CampaignDeserializer.deserializeCampaign(serializedCampaign);

		assertDeepJsonEqual(deserializedCampaign, campaign);
	});
	it('Should serialize and deserialize campaign metadata', () => {
		const campaign = new Campaign(IdGenerator.generateId());
		campaign.name = `Test #${campaign.id}`;
		campaign.levels.push(generateCompleteLevel(), generateCompleteLevel(), generateCompleteLevel());

		const serializedCampaignMetadata = CampaignSerializer.serializeMetadata(campaign.metadata);
		const deserializedCampaignMetadata = CampaignDeserializer.deserializeMetadata(serializedCampaignMetadata);

		assertDeepJsonEqual(deserializedCampaignMetadata, campaign.metadata);
	});
});
