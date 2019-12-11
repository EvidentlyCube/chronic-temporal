import 'mocha';
import {assert} from 'chai';
import {LevelSerializer} from '../../../src/GameLogic/Serialization/LevelSerializer';
import {LevelDeserializer} from '../../../src/GameLogic/Serialization/LevelDeserializer';
import {generateCompleteLevel} from '../helpers/generateCompleteLevel';

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
});
