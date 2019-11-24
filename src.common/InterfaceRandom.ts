
export interface Random {
	double(from: number, to: number): number;
	int32(from: number, to: number): number;
	bool(chance: number): boolean;
}