import * as PIXI from 'pixi.js';
import {PlotterDirectionRestriction, Plotter} from './Plotter';
import {TextureStore} from 'evidently-pixi';
import {EntityType} from '../../../../../GameLogic/Enums/EntityType';
import {EditorConfig} from '../EditorConfig';
import {Entity} from '../../../../../GameLogic/Entity';
import {GfxConstants} from '../../../../../Core/Constants/GfxConstants';
import {Fireball} from '../../../../../GameLogic/Entities/Fireball';
import {Iceblock} from '../../../../../GameLogic/Entities/Iceblock';
import {Pushable} from '../../../../../GameLogic/Entities/Pushable';
import {TurnState} from '../../../../../GameLogic/TurnState';
import {TurnEventType} from '../../../../../GameLogic/Enums/TurnEventType';

const directionRequirements = new Map<EntityType, PlotterDirectionRestriction>();
directionRequirements.set(EntityType.Iceblock, PlotterDirectionRestriction.NoneAndDirectional);
directionRequirements.set(EntityType.Fireball, PlotterDirectionRestriction.OnlyDirectional);
directionRequirements.set(EntityType.Pushable, PlotterDirectionRestriction.None);

export class EntityPlotter implements Plotter {
	public entityType: EntityType;

	constructor(entity: EntityType) {
		this.entityType = entity;
	}

	public plot(turnState: TurnState, editorConfig: EditorConfig, x: number, y: number): void {
		const {level} = turnState;

		this.cleanupEntities(turnState, x, y, [this.entityType, EntityType.Iceblock]);

		const existingEntity = level.entities.getEntitiesAt(x, y).find(entity => entity.type === this.entityType);
		const existingIceBlock = level.entities.getEntitiesAt(x, y).find(entity => entity.type === EntityType.Iceblock) as Iceblock|undefined;

		if (existingIceBlock?.type === EntityType.Iceblock) {
			if (this.entityType === EntityType.Iceblock) {
				existingIceBlock.containedEntity = undefined;
			} else {
				existingIceBlock.containedEntity = this.createEntity(undefined, editorConfig);
			}
			turnState.addEvent(TurnEventType.EntityModified, existingIceBlock);
		} else if (!existingEntity) {
			const newEntity = this.createEntity(existingEntity, editorConfig);
			newEntity.x = x;
			newEntity.y = y;
			newEntity.prevX = x;
			newEntity.prevY = y;
			level.entities.addEntity(newEntity, turnState);
		}
	}

	public unplot(turnState: TurnState, editorConfig: EditorConfig, x: number, y: number): void {
		const {level} = turnState;

		level.entities.getEntitiesAt(x, y)
			.forEach(entity => level.entities.removeEntity(entity, turnState));
	}

	public getTexture(editorConfig: EditorConfig, textureStore: TextureStore): PIXI.Texture {
		switch (this.entityType) {
			case EntityType.Pushable:
				return textureStore.getTile(GfxConstants.InitialTileset, 7, 5);

			case EntityType.Iceblock:
				return textureStore.getTile(GfxConstants.InitialTileset, 8, 8);

			case EntityType.Fireball:
				return textureStore.getTile(GfxConstants.InitialTileset, 7, 0);

			default:
				throw new Error(`Invalid entity type "${this.entityType}"`);
		}
	}

	private createEntity(existingEntity: Entity | undefined, editorConfig: EditorConfig): Entity {
		switch (this.entityType) {
			case EntityType.Fireball:
				if (existingEntity) {
					(existingEntity as Fireball).direction = editorConfig.direction;
					return existingEntity;
				}
				return new Fireball(editorConfig.direction);

			case EntityType.Iceblock:
				return existingEntity ?? new Iceblock();

			case EntityType.Pushable:
				return existingEntity ?? new Pushable();

			default:
				throw new Error(`Invalid entity type "${this.entityType}"`);
		}
	}

	private cleanupEntities(turnState: TurnState, x: number, y: number, keptTypes: EntityType[]): void {
		const {level} = turnState;

		const entitiesInPlace = level.entities.getEntitiesAt(x, y);
		const otherTypeEntities = entitiesInPlace.filter(entity => !keptTypes.includes(entity.type));

		otherTypeEntities.forEach(entity => level.entities.removeEntity(entity, turnState));
	}

	public getDirectionRequirement(): PlotterDirectionRestriction {
		return directionRequirements.get(this.entityType)!;
	}
}
