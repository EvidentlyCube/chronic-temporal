import * as PIXI from 'pixi.js';

export class PointUtils {
	public static getAllPointsBetween(from: PIXI.IPoint, to: PIXI.IPoint): PIXI.Point[] {
		const points: PIXI.Point[] = [];

		const directionX = Math.sign(to.x - from.x);
		const directionY = Math.sign(to.y - from.y);

		const dY = Math.abs(from.x - to.x);
		const dX = Math.abs(from.y - to.y);
		const smallerDelta = Math.min(dX, dY);

		let stepX = 0;
		let stepY = 0;

		let stepsLeft = Math.max(dX, dY);

		let currentX = from.x;
		let currentY = from.y;

		points.push(new PIXI.Point(currentX, currentY));

		while (stepsLeft-- > 0) {
			stepX += smallerDelta;
			stepY += smallerDelta;

			if (stepX >= dX) {
				currentX += directionX;
				points.push(new PIXI.Point(currentX, currentY));
				stepX -= dX;
			}
			if (stepY >= dY) {
				currentY += directionY;
				points.push(new PIXI.Point(currentX, currentY));
				stepY -= dY;
			}
		}

		return points;
	}
}
