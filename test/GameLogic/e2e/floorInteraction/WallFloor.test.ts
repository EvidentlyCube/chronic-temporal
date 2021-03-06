import 'mocha';

import {EntityType} from '../../../../src/GameLogic/Enums/EntityType';
import {FloorType} from '../../../../src/GameLogic/Enums/FloorType';
import {PlayerAction, PlayerActionUtils} from '../../../../src/GameLogic/Enums/PlayerAction';
import {TestLevelBuilder} from '../../helpers/TestLevelBuilder';
import {Direction8Utils} from '../../../../src/GameLogic/Enums/Direction8';

const {getX, getY} = Direction8Utils;

describe('GameLogic.e2e - Wall floor', () => {
	PlayerActionUtils.moves.forEach((action) => {
		it(`Player should not move ${PlayerAction[action]} into a wall`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			TestLevelBuilder.newLevel()
				.plotFloor(10 + getX(moveDirection), 10 + getY(moveDirection), FloorType.Wall)
				.run(action)
				.assertEntityAt(EntityType.Protagonist, 10, 10);
		});
	});
});
