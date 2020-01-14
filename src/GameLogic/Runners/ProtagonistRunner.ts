import {TurnState} from '../TurnState';
import {EntityType} from '../Enums/EntityType';

export class ProtagonistRunner {
	public static run(turnState: TurnState): void {
		const {level} = turnState;

		const protagonists = level.entities.getEntitiesOfType(EntityType.Protagonist);
		const protagonistMovements = protagonists.map(entity => entity.getNextMoveDetails(turnState));
		protagonistMovements.forEach(movement => protagonistMovements.forEach(pairedMovement => {
			if (movement.entity !== pairedMovement.entity) {
				// @todo Cross-examine each movement with each other
			}
		}));
		protagonists.forEach(entity => entity.update(turnState));
	}
}
