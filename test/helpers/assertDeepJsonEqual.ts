import {assert} from 'chai';

export function assertDeepJsonEqual(given: any, expected: any, message?: string): void {
	assert.deepStrictEqual(
		JSON.parse(JSON.stringify(given)),
		JSON.parse(JSON.stringify(expected)),
		message
	);
}
