import 'mocha';
import {assert} from 'chai';
import {PlayerAction} from '../../src/GameLogic/Enums';
import {ActionSequence} from '../../src/GameLogic/DataStructures/ActionSequence';

describe('GameLogic.DataStructures.ActionSequence', () => {
	const actionList: PlayerAction[] = [
		PlayerAction.MoveDownRight,
		PlayerAction.MoveRight,
		PlayerAction.MoveUpLeft,
		PlayerAction.MoveDown,
		PlayerAction.MoveUp,
	];

	it('addEntity should add the actions in the correct order.', () => {
		//Arrange
		const actionSequence = new ActionSequence();

		//Act
		for (let i = 0; i < 5; i++) {
			actionSequence.push(actionList[i]);
		}
		//Assert
		assert.deepEqual(actionSequence.actions, actionList);
	});

	it('getNext should return the correct actions in the correct order.', () => {
		//Arrange
		const actionSequence = new ActionSequence(actionList);
		const result: (PlayerAction | undefined)[] = [];

		//Act
		for (let i = 0; i < 5; i++) {
			result.push(actionSequence.getNext());
		}
		//Assert
		assert.deepEqual(result, actionList);
	});

	it('getNext should return undefined when it has reached the end of the sequence', () => {
		//Arrange
		const actionSequence = new ActionSequence(actionList);

		//Act
		for (let i = 0; i < 5; i++) {
			actionSequence.getNext();
		}

		//Assert
		assert.equal(actionSequence.getNext(), undefined);
	});
});
