
export class IdGenerator {
	public static generateId(): string {
		const date = Math.floor(Date.now() / 1000).toString(36).padStart(7, '0');
		const random1 = Math.random().toString(36).replace('.', '').padStart(6, '0').substr(0, 6);
		const random2 = Math.random().toString(36).replace('.', '').padStart(6, '0').substr(0, 6);
		const random3 = Math.random().toString(36).replace('.', '').padStart(6, '0').substr(0, 6);

		return `${date}${random1}${random2}${random3}`;
	}
}
