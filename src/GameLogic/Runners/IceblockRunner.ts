import {TurnState} from '../TurnState';
import {EntityType} from '../Enums/EntityType';

export class IceblockRunner {
	public static run(turnState: TurnState): void {
		const {level} = turnState;

		const iceblocks = level.entities.getEntitiesOfType(EntityType.Iceblock);
		const iceblockMovements = iceblocks.map(entity => entity.getNextMoveDetails(turnState));
		iceblockMovements.forEach(movement => iceblockMovements.forEach(pairedMovement => {
			if (movement.entity !== pairedMovement.entity) {
				// @todo Cross-examine each movement with each other
			}
		}));
		iceblocks.forEach(entity => entity.update(turnState));
	}
}
