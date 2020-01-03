import {deflate, inflate} from 'pako';

export class PakoUtils {
	public static jsonToString(json: object): string {
		return deflate(JSON.stringify(json), {to: 'string'});
	}

	public static jsonFromString(string: string): object {
		return JSON.parse(inflate(string, {to: 'string'}));
	}
}
