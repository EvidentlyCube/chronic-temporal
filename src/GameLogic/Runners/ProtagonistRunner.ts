import {TurnState} from '../TurnState';
import {EntityType} from '../Enums/EntityType';
import {Entity} from '../Entity';
import {TurnEventType} from '../Enums/TurnEventType';

export class ProtagonistRunner {
	public static run(turnState: TurnState): void {
		const {level} = turnState;
		const entitiesToRemove: Entity[] = [];

		function paradox(entity: Entity): void {
			if (!entitiesToRemove.includes(entity)) {
				entitiesToRemove.push(entity);
			}
		}

		const protagonists = level.entities.getEntitiesOfType(EntityType.Protagonist);
		const protagonistMovements = protagonists.map(entity => entity.getNextMoveDetails(turnState));
		protagonistMovements.forEach(movement => {
			protagonistMovements.forEach(pairedMovement => {
				if (movement.entity !== pairedMovement.entity) {
					if (movement.newX == pairedMovement.newX && movement.newY == pairedMovement.newY) {
						paradox(movement.entity);
					} else if (
						movement.newX == pairedMovement.oldX &&
						movement.newY == pairedMovement.oldY &&
						movement.oldX == pairedMovement.newX &&
						movement.oldY == pairedMovement.newY
					) {
						paradox(movement.entity);
					} else {
						pairedMovement.others.forEach(pairedOther => {
							if (movement.newX == pairedOther.newX && movement.newY == pairedOther.newY) {
								paradox(movement.entity);
							}
						});
					}
					movement.others.forEach(other => {
						if (other.newX == pairedMovement.newX && other.newY == pairedMovement.newY) {
							paradox(other.entity);
							paradox(movement.entity);
						} else if (
							other.newX == pairedMovement.oldX &&
							other.newY == pairedMovement.oldY &&
							other.oldX == pairedMovement.newX &&
							other.oldY == pairedMovement.newY
						) {
							paradox(other.entity);
							paradox(movement.entity);
						} else {
							pairedMovement.others.forEach(pairedOther => {
								if (other.entity == pairedOther.entity) {
									paradox(other.entity);
									paradox(movement.entity);
								} else if (other.newX == pairedOther.newX && other.newY == pairedOther.newY) {
									paradox(other.entity);
									paradox(movement.entity);
								}
							});
						}
					});
				}
			});
		});

		entitiesToRemove.forEach(entity => {
			level.entities.removeEntity(entity, turnState);
			turnState.addEvent(TurnEventType.EntityParadoxed, entity);
		});
		const remainingProtagonists = level.entities.getEntitiesOfType(EntityType.Protagonist);
		remainingProtagonists.forEach(entity => entity.update(turnState));
	}
}
