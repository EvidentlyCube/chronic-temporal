
export class RoundedFloat {
	public roundTo: number;
	public value: number;

	public get roundedValue() {
		return this.roundTo === 0 ? this.value : Math.floor(this.value / this.roundTo) * this.roundTo;
	}

	constructor(roundTo: number, value: number)
	{
		this.roundTo = roundTo;
		this.value = value;
	}
}