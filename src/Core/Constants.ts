import * as seedrandom from "seedrandom";

const VirtualWidth = 640;
const VirtualHeight = 360;
const TileEdge = 16;
const TileWidth = 16;
const TileHeight = 16;
const DisplayRatio = VirtualWidth / VirtualHeight;

const Random: seedrandom.prng = seedrandom.xor4096();

export default {
	VirtualWidth,
	VirtualHeight,
	TileEdge,
	TileWidth,
	TileHeight,
	DisplayRatio,
	Random: {
		double: function (from: number, to: number)
		{
			if (from > to)
			{
				const temp = from;
				from = to;
				to = temp;
			}

			const delta = to - from;

			return from + (delta * Random.double()) % delta;
		},

		int32: function (from: number, to: number)
		{
			if (from > to)
			{
				const temp = from;
				from = to;
				to = temp;
			}

			const delta = to - from;

			return Math.floor(from + (delta * Random.double()) % delta);
		},
		bool: function (chance: number)
		{
			return Random.double() < chance;
		},
	},
};