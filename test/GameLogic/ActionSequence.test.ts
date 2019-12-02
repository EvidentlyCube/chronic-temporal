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

	it('push() should add the actions in the correct order.', () => {
		//Arrange
		const actionSequence = new ActionSequence();

		//Act
		for (let i = 0; i < 5; i++) {
			actionSequence.push(actionList[i]);
		}
		//Assert
		assert.deepEqual(actionSequence.actions, actionList);
	});

	it('getNext() should return the correct actions in the correct order.', () => {
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

	it('getNext() should return undefined when it has reached the end of the sequence', () => {
		//Arrange
		const actionSequence = new ActionSequence(actionList);

		//Act
		for (let i = 0; i < 5; i++) {
			actionSequence.getNext();
		}

		//Assert
		assert.equal(actionSequence.getNext(), undefined);
	});

	it('copy() should create copy of the move sequence', () => {
		const base = new ActionSequence(actionList);
		const copy = base.copy();

		assert.notStrictEqual(base, copy);
		assert.deepEqual(base.actions, copy.actions);
	});

	it('get position should return current position in the sequence', () => {
		const sequence = new ActionSequence(actionList);

		for (let i = 0; i < actionList.length; i++) {
			assert.equal(sequence.position, i);
			sequence.getNext();
		}
	});

	it('reset should reset the position to the beginning', () => {
		const sequence = new ActionSequence(actionList);
		sequence.getNext();
		sequence.getNext();
		sequence.getNext();

		sequence.reset();

		assert.equal(sequence.position, 0);
	});
});
