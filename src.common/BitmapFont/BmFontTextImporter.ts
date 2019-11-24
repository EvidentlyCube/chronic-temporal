import * as PIXI from 'pixi.js';

interface BmFontRow
{
	header: string,
	fields: { [s: string]: string }
}

function extractRow(row: string): BmFontRow | null
{
	const fieldMatchRegex = /(\S+?)=(".*?"|[^"]+?\s)/g;
	const matches = row.match(/^\S+/);

	if (!matches || matches.length === 0) {
		return null;
	}

	const rowData: BmFontRow = {
		header: matches[0],
		fields: {},
	};

	let field;

	while ((field = fieldMatchRegex.exec(row)))
	{
		rowData.fields[field[1]] = field[2].replace(/^(?:"|\s)*(.*?)(?:"|\s)*$/, '$1');
	}

	return rowData;
}

export class BmFontTextImporter
{
	static importFont(fontData: string, texture: PIXI.Texture)
	{
		const data: any = {
			chars: {},
		};

		fontData = fontData.replace(/[\n\r]+/g, "\n");

		for (const row of fontData.split("\n"))
		{
			if (!row.trim())
			{
				continue;
			}

			const rowData = extractRow(row);

			if (!rowData) {
				continue;
			}

			switch (rowData.header)
			{
				case 'info':
					data.font = rowData.fields.face;
					data.size = parseInt(rowData.fields.size, 10);
					break;

				case 'common':
					data.lineHeight = parseInt(rowData.fields.lineHeight, 10);
					data.chars = {};
					break;

				case 'char':
					const textureRect = new PIXI.Rectangle(
						texture.frame.x + parseInt(rowData.fields.x, 10),
						texture.frame.y + parseInt(rowData.fields.y, 10),
						parseInt(rowData.fields.width, 10),
						parseInt(rowData.fields.height, 10),
					);
					const charCode = parseInt(rowData.fields.id, 10);
					data.chars[charCode] = {
						xOffset: parseInt(rowData.fields.xoffset, 10),
						yOffset: parseInt(rowData.fields.yoffset, 10),
						xAdvance: parseInt(rowData.fields.xadvance, 10),
						kerning: {},
						texture: new PIXI.Texture(texture.baseTexture, textureRect),
						page: rowData.fields.page,
					};
					break;
			}
		}

		PIXI.extras.BitmapText.fonts[data.font] = data;
	}
}