import {TurnState} from '../TurnState';
import {EntityType} from '../Enums/EntityType';

export class FireballRunner {
	public static run(turnState: TurnState): void {
		const {level} = turnState;

		level.entities.getEntitiesOfType(EntityType.Fireball).forEach(entity => entity.update(turnState));
	}
}
