import 'mocha';
import {assert} from 'chai';
import {LevelSerializer} from '../../../src/GameLogic/Serialization/LevelSerializer';
import {LevelDeserializer} from '../../../src/GameLogic/Serialization/LevelDeserializer';
import {generateCompleteLevel} from '../helpers/generateCompleteLevel';
import {Campaign} from '../../../src/GameLogic/Campaign';
import {IdGenerator} from '../../../src/Utils/IdGenerator';
import {CampaignSerializer} from '../../../src/GameLogic/Serialization/CampaignSerializer';
import {CampaignDeserializer} from '../../../src/GameLogic/Serialization/CampaignDeserializer';

describe('GameLogic.Serialization', () => {
	it('Should serialize and deserialize level', () => {
		const level = generateCompleteLevel();
		const serializedLevel = LevelSerializer.serialize(level);
		const deserializedLevel = LevelDeserializer.deserialize(serializedLevel);

		assert.deepEqual(
			JSON.parse(JSON.stringify(deserializedLevel)),
			JSON.parse(JSON.stringify(level)),
		);
	});
	it('Should serialize and deserialize campaign', () => {
		const campaign = new Campaign(IdGenerator.generateId());
		campaign.name = `Test #${campaign.id}`;
		campaign.levels.push(generateCompleteLevel(), generateCompleteLevel(), generateCompleteLevel());

		const serializedCampaign = CampaignSerializer.serializeCampaign(campaign);
		const deserializedCampaign = CampaignDeserializer.deserializeCampaign(serializedCampaign);

		assert.deepEqual(
			JSON.parse(JSON.stringify(deserializedCampaign)),
			JSON.parse(JSON.stringify(campaign)),
		);
	});
	it('Should serialize and deserialize campaign metadata', () => {
		const campaign = new Campaign(IdGenerator.generateId());
		campaign.name = `Test #${campaign.id}`;
		campaign.levels.push(generateCompleteLevel(), generateCompleteLevel(), generateCompleteLevel());

		const serializedCampaignMetadata = CampaignSerializer.serializeMetadata(campaign.metadata);
		const deserializedCampaignMetadata = CampaignDeserializer.deserializeMetadata(serializedCampaignMetadata);

		assert.deepEqual(
			JSON.parse(JSON.stringify(deserializedCampaignMetadata)),
			JSON.parse(JSON.stringify(campaign.metadata)),
		);
	});
});
